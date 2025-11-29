from fastapi import APIRouter, Depends, Cookie
from core.auth import require_session

router = APIRouter()

@router.get("/profile")
def profile(user_id: int = Cookie(None)):
    user = require_session(user_id)

    return {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "created_at": user.date_created,
    }