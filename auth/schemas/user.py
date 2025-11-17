from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    role: str
    date_created: datetime

    class Config:
        from_attributes = True

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
