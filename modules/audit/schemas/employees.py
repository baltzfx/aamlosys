from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from .employee_assignment import EmployeeAssignmentCreate

# ======================
# BASE
# ======================
class EmployeeBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    hire_date: Optional[date] = None


# ======================
# CREATE
# ======================
class EmployeeCreate(BaseModel):
    eid: Optional[str] = None   # 👈 manual override

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None

    date_of_birth: Optional[date] = None
    gender: Optional[str] = None

    email_personal: Optional[str] = None
    phone_work: Optional[str] = None
    phone_mobile: Optional[str] = None
    address: Optional[str] = None

    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    employment_status: Optional[str] = "active"

    job_title: Optional[str] = None
    position_level: Optional[str] = None
    grade: Optional[str] = None
    salary: Optional[float] = None


# ======================
# UPDATE
# ======================
class EmployeeUpdate(BaseModel):
    eid: Optional[str] = None

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None

    date_of_birth: Optional[date] = None
    gender: Optional[str] = None

    email_personal: Optional[str] = None
    phone_work: Optional[str] = None
    phone_mobile: Optional[str] = None
    address: Optional[str] = None

    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    employment_status: Optional[str] = None

    job_title: Optional[str] = None
    position_level: Optional[str] = None
    grade: Optional[str] = None
    salary: Optional[float] = None

    user_id: Optional[int] = None  # admin only



# ======================
# RESPONSE (✅ LOGIN SAFE)
# ======================
class EmployeeResponse(EmployeeBase):
    id: int
    user_id: Optional[int] = None  # ✅ MUST BE OPTIONAL

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }


# ======================
# ASSIGNMENT UPDATE
# ======================
class EmployeeAssignmentUpdate(BaseModel):
    branch_id: Optional[int] = None
    department_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    manager_id: Optional[int] = None
    job_title: Optional[str] = None
    start_assignment: Optional[date] = None
    end_assignment: Optional[date] = None


# ======================
# EMPLOYEE + ASSIGNMENT
# ======================
class EmployeeWithAssignmentUpdate(BaseModel):
    employee: EmployeeUpdate
    assignment: Optional[EmployeeAssignmentUpdate] = None

class EmployeeCreatePayload(BaseModel):
    employee: EmployeeCreate
    assignment: EmployeeAssignmentCreate


