from fastapi import HTTPException, Request, Depends
from models.users import User

active_sessions = {}

def generate_reset_code():
    import secrets
    return secrets.token_hex(3)


def require_session(request: Request):
    user_id = request.cookies.get("user_id")

    if not user_id:
        raise HTTPException(401, "Not logged in")

    user_id = int(user_id)

    if user_id not in active_sessions:
        raise HTTPException(401, "Not logged in")

    return active_sessions[user_id]


def require_admin(user = Depends(require_session)):
    if user.role != "admin":
        raise HTTPException(403, "Admins only")
    return user
