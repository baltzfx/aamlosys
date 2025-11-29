from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

# ---------------------------
# Base user schemas
# ---------------------------
class UserBase(BaseModel):
    username: str
    email: str
    role: Optional[str] = "user"
    status: Optional[str] = "active"
    employee_id: Optional[int] = None

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    role: str
    status: str
    date_created: datetime

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[str]
    role: Optional[str]
    status: Optional[str]
    employee_id: Optional[int]

class UserOut(UserBase):
    id: int
    date_created: datetime

    class Config:
        from_attributes = True

# ---------------------------
# Auth schemas
# ---------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

class ResetPassword(BaseModel):
    username: str
    new_password: str

class ResetRequest(BaseModel):
    email: str

class ResetConfirm(BaseModel):
    email: str
    code: str
    new_password: str

class AdminResetPassword(BaseModel):
    new_password: str

# ---------------------------
# Admin-specific schemas
# ---------------------------
class UpdateStatus(BaseModel):
    status: Literal["active", "disabled", "banned"]
