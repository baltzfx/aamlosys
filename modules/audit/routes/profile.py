from fastapi import APIRouter, Depends
from core.auth import require_session

router = APIRouter()

@router.get("/")
def profile(user = Depends(require_session)):
    return {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "created_at": user.date_created,
    }
