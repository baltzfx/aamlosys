from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class EmployeeBase(BaseModel):
    eid: Optional[str] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
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


# --------------------
# CREATE
# --------------------
class EmployeeCreate(EmployeeBase):
    last_name: str
    first_name: str
    user_id: Optional[int] = None  # Only for admin


# --------------------
# UPDATE
# --------------------
class EmployeeUpdate(EmployeeBase):
    user_id: Optional[int] = None   # only admin can use


# --------------------
# RESPONSE
# --------------------
class EmployeeResponse(EmployeeBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
