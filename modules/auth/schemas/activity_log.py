from pydantic import BaseModel
from datetime import datetime

class LogRead(BaseModel):
    id: int
    user_id: int
    action: str
    details: str
    timestamp: datetime

    class Config:
        from_attributes = True
