from pydantic import BaseModel
from typing import Optional
from .branch import BranchRead

class DepartmentBase(BaseModel):
    code: Optional[str] = None
    department: Optional[str] = None
    group: Optional[str] = None
    section: Optional[str] = None
    unit: Optional[str] = None
    branch_id: Optional[int] = None
    remarks: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    code: Optional[str] = None
    department: Optional[str] = None
    group: Optional[str] = None
    section: Optional[str] = None
    unit: Optional[str] = None
    branch_id: Optional[int] = None
    remarks: Optional[str] = None

class DepartmentRead(DepartmentBase):
    id: int
    branch: Optional[BranchRead] = None

    class Config:
        from_attributes = True
