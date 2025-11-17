from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserCreate, LoginRequest, ResetPassword, ResetRequest, ResetConfirm, UserRead
from models.users import User
from core.auth import active_sessions, generate_reset_code, reset_codes, get_db
from core.util import hash_password, verify_password

router = APIRouter()

# ---------------------------
# Register
# ---------------------------
@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    duplicate = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()

    if duplicate:
        raise HTTPException(400, "Username or email already exists")

    new = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )

    db.add(new)
    db.commit()
    db.refresh(new)
    return new

# ---------------------------
# Login (creates session)
# ---------------------------
@router.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(400, "Invalid username or password")

    active_sessions[user.id] = user

    return {
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role
    }

# ---------------------------
# Password Reset (simple direct change)
# ---------------------------
@router.post("/password/reset")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        raise HTTPException(404, "User not found")

    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated"}

# ---------------------------
# Password Reset via Code
# ---------------------------
@router.post("/password/reset/request")
def request_reset(data: ResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(404, "Email unknown")

    code = generate_reset_code()
    reset_codes[user.email] = code

    # NOTE: send by email or SMS in real app
    return {"reset_code": code}

@router.post("/password/reset/confirm")
def reset_confirm(data: ResetConfirm, db: Session = Depends(get_db)):
    if data.email not in reset_codes:
        raise HTTPException(400, "No reset requested")

    if reset_codes[data.email] != data.code:
        raise HTTPException(400, "Invalid code")

    user = db.query(User).filter(User.email == data.email).first()
    user.hashed_password = hash_password(data.new_password)
    db.commit()

    del reset_codes[data.email]

    return {"message": "Password successfully changed"}


@router.post("/logout")
def logout(user_id: int):
    from core.auth import active_sessions

    if user_id in active_sessions:
        del active_sessions[user_id]
        return {"message": "Logged out successfully"}

    raise HTTPException(400, "User is not logged in")
