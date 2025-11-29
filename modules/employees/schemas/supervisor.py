# app/schemas/supervisor.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class SupervisorBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr


class SupervisorCreate(SupervisorBase):
    pass


class SupervisorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class SupervisorRead(SupervisorBase):
    id: int

    class Config:
        from_attributes = True
