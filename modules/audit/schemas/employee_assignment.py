from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .branch import BranchRead
from .department import DepartmentRead

class EmployeeAssignmentBase(BaseModel):
    employee_id: int
    supervisor_id: int
    manager_id: int
    branch_id: int
    department_id: int
    account_group_id: Optional[int] = None
    start_assignment: Optional[datetime] = None
    end_assignment: Optional[datetime] = None

class EmployeeAssignmentCreate(EmployeeAssignmentBase):
    pass

class EmployeeAssignmentUpdate(BaseModel):
    employee_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    manager_id: Optional[int] = None
    branch_id: Optional[int] = None
    department_id: Optional[int] = None
    account_group_id: Optional[int] = None
    start_assignment: Optional[datetime] = None
    end_assignment: Optional[datetime] = None

class EmployeeReadMinimal(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True

class SupervisorRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ManagerRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class EmployeeAssignmentRead(EmployeeAssignmentBase):
    id: int
    employee: Optional[EmployeeReadMinimal] = None
    supervisor: Optional[SupervisorRead] = None
    manager: Optional[ManagerRead] = None
    branch: Optional[BranchRead] = None
    department: Optional[DepartmentRead] = None
    account_group: Optional[dict] = None  # if you have account group schema

    class Config:
        from_attributes = True
