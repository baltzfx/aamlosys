from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.auth import require_session, require_admin, get_db
from models.activity_log import ActivityLog
from schemas.activity_log import LogRead

router = APIRouter()

@router.get("/logs", response_model=list[LogRead])
def get_logs(
    page: int = 1,
    limit: int = 20,
    user = Depends(require_session),
    db: Session = Depends(get_db)
):
    require_admin(user)

    logs = db.query(ActivityLog)\
        .order_by(ActivityLog.timestamp.desc())\
        .offset((page - 1) * limit)\
        .limit(limit)\
        .all()

    return logs
