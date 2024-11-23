import re
from datetime import datetime
from math import ceil
from typing import Optional
import os

import mercadopago
from bson import ObjectId
from config import MERCADO_PAGO_ACCESS_TOKEN, SOFTWARE_NAME
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from models.payment import CardInfo, PaginatedPaymentResponse, PaymentCreate, PaymentResponse
from utils.security import get_current_user

router = APIRouter()
sdk = mercadopago.SDK(MERCADO_PAGO_ACCESS_TOKEN)

# Get environment variables
PRICE = float(os.getenv("PRICE", "1.0"))
STATEMENT_DESCRIPTOR = os.getenv("STATEMENT_DESCRIPTOR", "MYSTORE")[:13]  # Limit to 13 characters

def get_payment_method_id(card_number: str):
    payment_methods = sdk.payment_methods().list_all()

    for method in payment_methods["response"]:
        if method["payment_type_id"] == "credit_card":
            for setting in method["settings"]:
                if "bin" in setting:
                    pattern = setting["bin"].get("pattern")
                    exclusion_pattern = setting["bin"].get("exclusion_pattern")

                    if pattern and re.match(pattern, card_number):
                        if exclusion_pattern and re.match(exclusion_pattern, card_number):
                            continue
                        return method["id"]

    raise HTTPException(status_code=400, detail="Unable to determine payment method")

@router.post("/create_payment", response_model=PaymentResponse)
async def create_payment(payment: PaymentCreate, card: CardInfo, current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db.users.find_one({"email": current_user})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new payment document in the database
    db_payment = {
        "user_id": user["_id"],
        "amount": PRICE,
        "description": f"{SOFTWARE_NAME} Pro Subscription",
        "payment_method": "credit_card",
        "payment_date": datetime.utcnow(),
        "payer_first_name": payment.payer_first_name,
        "payer_last_name": payment.payer_last_name,
        "status": "pending"
    }
    insert_result = db.payments.insert_one(db_payment)
    payment_id = str(insert_result.inserted_id)

    payment_data = {
        "transaction_amount": PRICE,
        "description": f"{SOFTWARE_NAME} Pro Subscription",
        "payment_method_id": "credit_card",
        "installments": 1,
        "payer": {
            "email": user["email"],
            "first_name": payment.payer_first_name,  # Correctly passing first_name
            "last_name": payment.payer_last_name     # Correctly passing last_name
        },
        "additional_info": {
            "items": [
                {
                    "id": "1",
                    "title": f"{SOFTWARE_NAME} Pro",
                    "description": f"{SOFTWARE_NAME} Pro Subscription",
                    "category_id": "1",
                    "quantity": 1,
                    "unit_price": PRICE
                }
            ]
        },
        "external_reference": payment_id,
        "statement_descriptor": STATEMENT_DESCRIPTOR
    }

    # Create card token
    card_data = {
        "card_number": card.card_number,
        "expiration_month": card.expiration_month,
        "expiration_year": card.expiration_year,
        "security_code": card.security_code,
        "cardholder": {
            "name": card.cardholder_name
        }
    }

    card_token_result = sdk.card_token().create(card_data)

    if card_token_result["status"] != 201:
        # store card_token_result in a log file
        with open("card_token_error.log", "a") as f:
            f.write(f"{card_token_result}\n")

        raise HTTPException(status_code=400, detail="Failed to create card token")

    card_token = card_token_result["response"]["id"]
    payment_data["token"] = card_token
    payment_data["payment_method_id"] = get_payment_method_id(card.card_number)

    payment_response = sdk.payment().create(payment_data)

    if payment_response["status"] == 201:
        payment_result = payment_response["response"]

        # Update the payment document with Mercado Pago's payment ID and status
        db.payments.update_one(
            {"_id": ObjectId(payment_id)},
            {"$set": {
                "payment_id": payment_result["id"],
                "status": payment_result["status"]
            }}
        )

        return PaymentResponse(
            id=str(payment_result["id"]),
            status=payment_result["status"],
            amount=PRICE,
            description=f"{SOFTWARE_NAME} Pro Subscription",
            payment_method="credit_card",
            external_reference=payment_id
        )
    else:
        # If payment failed, update the status in the database
        db.payments.update_one(
            {"_id": ObjectId(payment_id)},
            {"$set": {"status": "failed"}}
        )
        raise HTTPException(status_code=400, detail="Payment creation failed")

@router.post("/webhook")
async def payment_webhook(data: dict):
    if data["type"] == "payment":
        payment_id = data["data"]["id"]
        payment_info = sdk.payment().get(payment_id)

        if payment_info["status"] == 200:
            payment = payment_info["response"]
            db = get_db()
            db_payment = db.payments.find_one({"payment_id": payment_id})

            if db_payment and payment["status"] == "approved":
                db.payments.update_one(
                    {"payment_id": payment_id},
                    {"$set": {"status": "approved"}}
                )

    return {"status": "success"}

@router.get("/payments", response_model=PaginatedPaymentResponse)
async def get_payments(
    current_user: str = Depends(get_current_user),
    payment_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100)
):
    db = get_db()
    user = db.users.find_one({"email": current_user})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare the filter
    filter_query = {"user_id": ObjectId(user["_id"])}
    if payment_id:
        filter_query["payment_id"] = payment_id

    # Get total count
    total = db.payments.count_documents(filter_query)

    # Calculate pagination
    total_pages = ceil(total / size)
    skip = (page - 1) * size

    # Fetch payments
    payments = db.payments.find(filter_query).skip(skip).limit(size)

    # Prepare response
    items = [
        PaymentResponse(
            id=str(payment.get("payment_id", payment["_id"])),
            status=payment["status"],
            amount=payment["amount"],
            description=payment["description"],
            payment_method=payment["payment_method"],
            external_reference=str(payment["_id"])
        ) for payment in payments
    ]

    return PaginatedPaymentResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=total_pages
    )