from fastapi import APIRouter, Query
from typing import List, Optional
from models.whale_alert import WhaleAlert
from database import get_db

router = APIRouter()

@router.get("/alerts", response_model=List[WhaleAlert])
async def get_whale_alerts(limit: Optional[int] = Query(None, ge=1, description="Limit the number of alerts returned")):
    db = get_db()

    query = db.whale_alerts.find().sort("timestamp", -1)

    if limit:
        query = query.limit(limit)

    alerts = [WhaleAlert(**alert) for alert in query]

    return alerts