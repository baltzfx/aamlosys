from pydantic import BaseModel
from typing import Optional
from datetime import date


class BranchBase(BaseModel):
    branch_code: str
    branch_name: str
    branch_address: Optional[str] = None
    date_established: Optional[date] = None  # 👈 IMPORTANT


class BranchCreate(BranchBase):
    pass


class BranchUpdate(BaseModel):
    branch_code: Optional[str] = None
    branch_name: Optional[str] = None
    branch_address: Optional[str] = None
    date_established: Optional[date] = None  # 👈 IMPORTANT


class BranchRead(BranchBase):
    id: int

    class Config:
        from_attributes = True
