from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .branch import BranchRead
from .department import DepartmentRead
from .inventory_item import InventoryItemRead

class InventoryAssignmentBase(BaseModel):
    employee_id: int
    inventory_item_id: int
    branch_id: int
    department_id: int
    quantity: Optional[int] = 1
    assigned_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    condition_out: Optional[str] = None
    condition_in: Optional[str] = None
    remarks: Optional[str] = None

class InventoryAssignmentCreate(InventoryAssignmentBase):
    pass

class InventoryAssignmentUpdate(BaseModel):
    employee_id: Optional[int] = None
    inventory_item_id: Optional[int] = None
    branch_id: Optional[int] = None
    department_id: Optional[int] = None
    quantity: Optional[int] = None
    assigned_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    condition_out: Optional[str] = None
    condition_in: Optional[str] = None
    remarks: Optional[str] = None

class EmployeeReadMinimal(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True

class InventoryAssignmentRead(InventoryAssignmentBase):
    id: int
    employee: Optional[EmployeeReadMinimal] = None
    inventory_item: Optional[InventoryItemRead] = None
    branch: Optional[BranchRead] = None
    department: Optional[DepartmentRead] = None

    class Config:
        from_attributes = True
