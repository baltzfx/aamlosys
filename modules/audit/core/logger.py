from sqlalchemy.orm import Session
from models.activity_log import ActivityLog

def log_action(db: Session, user_id: int, action: str, details: str):
    entry = ActivityLog(
        user_id=user_id,
        action=action,
        details=details
    )
    db.add(entry)
    db.commit()
