from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.users import User
from core.db import SessionLocal
import random

# --------------------
# DB Dependency
# --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --------------------
# Session Store
# --------------------
active_sessions = {}  # {user_id: User}

def require_session(user_id: int):
    if user_id not in active_sessions:
        raise HTTPException(401, "Not logged in")
    return active_sessions[user_id]

def require_admin(user: User = None):
    if user.role != "admin":
        raise HTTPException(403, "Admins only")
    return user

# --------------------
# Reset Code Store
# --------------------
reset_codes = {}  # {email: "123456"}

def generate_reset_code():
    return str(random.randint(100000, 999999))
