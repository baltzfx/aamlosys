# app/schemas/manager.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class ManagerBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr


class ManagerCreate(ManagerBase):
    pass


class ManagerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class ManagerRead(ManagerBase):
    id: int

    class Config:
        from_attributes = True
