from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date


class BranchBase(BaseModel):
    code: str = Field(min_length=1, max_length=20)
    name: str = Field(min_length=1, max_length=200)
    location: Optional[str] = None
    status: Optional[str] = None
    date_established: Optional[date] = None

    @field_validator("location", "code", "name", "status", "date_established", mode="before", check_fields=False)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v


class BranchCreate(BranchBase):
    pass


class BranchUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    date_established: Optional[date] = None

    @field_validator("location", "code", "name", "status", "date_established", mode="before", check_fields=False)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v


class BranchRead(BranchBase):
    id: int

    class Config:
        orm_mode = True
