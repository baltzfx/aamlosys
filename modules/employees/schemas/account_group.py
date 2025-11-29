# app/schemas/account_group.py
from pydantic import BaseModel, Field, field_validator
from typing import Optional


class AccountGroupBase(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None

    @field_validator("description", mode="before", check_fields=False)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v


class AccountGroupCreate(AccountGroupBase):
    pass


class AccountGroupUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None

    @field_validator("description", "code", "name", mode="before", check_fields=False)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v


class AccountGroupRead(AccountGroupBase):
    id: int

    class Config:
        from_attributes = True
