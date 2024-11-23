from fastapi import APIRouter, Depends, HTTPException
from utils.security import get_current_user

router = APIRouter()

@router.get("/example-protected-route")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": "This is a protected route", "user": current_user}