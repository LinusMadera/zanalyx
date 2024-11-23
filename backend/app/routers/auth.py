from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from models.user import UserCreate, UserLogin, UserResetPassword
from utils.security import (
    get_password_hash,
    verify_password,
    get_current_user,
    create_user_response,
    create_reset_token,
    verify_reset_token,
)
from utils.email import send_reset_password_email
from database import get_db
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()


@router.post("/register")
async def register(user: UserCreate):
    db = get_db()
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = {
        "email": user.email,
        "username": user.username,
        "password": hashed_password,
    }
    result = db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return create_user_response(new_user)


@router.post("/login")
async def login(user: UserLogin):
    db = get_db()
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return create_user_response(db_user)


@router.post("/request-password-reset")
async def request_password_reset(email: str, background_tasks: BackgroundTasks):
    db = get_db()
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_token = create_reset_token(user["_id"])
    reset_link = f"https://frontend.link/password-reset?token={reset_token}"

    # Store the reset token in the database
    db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"reset_token": reset_token, "reset_token_expires": datetime.utcnow() + timedelta(hours=3)}},
    )

    # Send email in the background
    background_tasks.add_task(send_reset_password_email, user["email"], reset_link)

    return {"message": "Password reset email sent"}


@router.post("/reset-password")
async def reset_password(reset_data: UserResetPassword):
    db = get_db()
    user = db.users.find_one({"reset_token": reset_data.token})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    if user["reset_token_expires"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token has expired")

    if not verify_reset_token(reset_data.token, str(user["_id"])):
        raise HTTPException(status_code=400, detail="Invalid reset token")

    hashed_password = get_password_hash(reset_data.new_password)

    db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": "", "reset_token_expires": ""}},
    )

    return {"message": "Password reset successfully"}
