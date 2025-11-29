from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"
    status: str = "active"

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    role: str
    status: str
    date_created: datetime

    class Config:
        from_attributes = True

class UpdateStatus(BaseModel):
    status: str  # active | disabled | banned

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
