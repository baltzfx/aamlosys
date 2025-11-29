# app/schemas/employee_assignment.py
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


# ---- Nested Schemas ----
class BranchRead(BaseModel):
    id: int
    code: str
    name: str
    location: Optional[str] = None

    class Config:
        from_attributes = True


class DepartmentRead(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class AccountGroupRead(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None

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


class EmployeeReadMinimal(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


# ---- Main Schemas ----
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

    @field_validator(
        "date_of_birth", "hire_date", "termination_date",
        "middle_name", "gender", "email_personal", "phone_work", "phone_mobile",
        "address", "employment_status", "job_title", "position_level", "grade",
        "salary", "user_id",
        mode="before", check_fields=False
    )
    def empty_string_to_none(cls, v):
        if v == "" or v == 0:
            return None
        return v

class EmployeeAssignmentRead(EmployeeAssignmentBase):
    id: int

    # Nested relationships
    employee: Optional[EmployeeReadMinimal] = None
    supervisor: Optional[SupervisorRead] = None
    manager: Optional[ManagerRead] = None
    branch: Optional[BranchRead] = None
    department: Optional[DepartmentRead] = None
    account_group: Optional[AccountGroupRead] = None

    class Config:
        from_attributes = True
