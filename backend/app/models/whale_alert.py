from pydantic import BaseModel
from typing import List, Dict, Any

class WhaleAlert(BaseModel):
    channel_id: str
    timestamp: int
    blockchain: str
    transaction_type: str
    from_address: str
    to_address: str
    amounts: List[Dict[str, Any]]
    text: str
    transaction: Dict[str, Any]