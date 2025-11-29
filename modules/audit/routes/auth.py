from fastapi import APIRouter, Depends, HTTPException, Cookie
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from core.db import get_db
from core.auth import active_sessions
from core.util import hash_password, verify_password  # use your Argon2 functions
from models.users import User
from schemas.user import UserCreate, LoginRequest, ResetPassword, ResetRequest, ResetConfirm, UserRead

router = APIRouter()

# ---------------------------
# RESET CODE STORAGE
# ---------------------------
reset_codes = {}  # { email: code }

def generate_reset_token():
    import secrets
    return secrets.token_hex(3)


# ---------------------------
# REGISTER
# ---------------------------
@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    duplicate = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if duplicate:
        raise HTTPException(400, "Username or email already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
        status=user.status,
        employee_id=user.employee_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# ---------------------------
# LOGIN
# ---------------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(400, "Invalid username or password")
    if user.status in ["disabled", "banned"]:
        raise HTTPException(403, f"Your account is {user.status}")

    active_sessions[user.id] = user

    response = JSONResponse({"username": user.username})
    response.set_cookie(
        key="user_id",
        value=str(user.id),
        httponly=True,
        samesite="lax",
        secure=False
    )
    return response


# ---------------------------
# LOGOUT
# ---------------------------
@router.post("/logout")
def logout(user_id: int = Cookie(None)):
    if not user_id:
        raise HTTPException(401, "Not logged in")
    active_sessions.pop(user_id, None)
    response = JSONResponse({"message": "Logged out successfully"})
    response.delete_cookie("user_id")
    return response


# ---------------------------
# PASSWORD RESET
# ---------------------------
@router.post("/password/reset")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated"}


@router.post("/password/reset/request")
def request_reset(data: ResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(404, "Email unknown")
    code = generate_reset_token()
    reset_codes[user.email] = code
    # In real app: send via email/SMS
    return {"reset_code": code}


@router.post("/password/reset/confirm")
def reset_confirm(data: ResetConfirm, db: Session = Depends(get_db)):
    if data.email not in reset_codes:
        raise HTTPException(400, "No reset requested")
    if reset_codes[data.email] != data.code:
        raise HTTPException(400, "Invalid code")
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    del reset_codes[data.email]
    return {"message": "Password successfully changed"}
