from fastapi import APIRouter, Depends
from core.auth import require_session

router = APIRouter()

@router.get("/profile")
def get_profile(user = Depends(require_session)):
    return {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "created_at": user.date_created
    }
