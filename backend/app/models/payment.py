from pydantic import BaseModel, Field
from typing import List

class CardInfo(BaseModel):
    card_number: str
    expiration_month: int
    expiration_year: int
    security_code: str
    cardholder_name: str

class PaymentCreate(BaseModel):
    payer_first_name: str
    payer_last_name: str

class PaymentResponse(BaseModel):
    id: str
    status: str
    amount: float
    description: str
    payment_method: str
    external_reference: str

class PaginatedPaymentResponse(BaseModel):
    items: List[PaymentResponse]
    total: int
    page: int
    size: int
    pages: int