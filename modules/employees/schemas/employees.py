from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class EmployeeCreate(BaseModel):
    user_id: Optional[int] = None
    eid: Optional[str] = None
    
    last_name: str
    first_name: str
    middle_name: Optional[str]

    date_of_birth: Optional[date]
    gender: Optional[str]

    email_personal: Optional[str]
    phone_work: Optional[str]
    phone_mobile: Optional[str]
    address: Optional[str]

    hire_date: Optional[date]
    termination_date: Optional[date]
    employment_status: Optional[str]
    job_title: Optional[str]
    position_level: Optional[str]
    grade: Optional[str]

    salary: Optional[float]

class EmployeeUpdate(BaseModel):
    user_id: Optional[int]
    eid: Optional[str]
    last_name: Optional[str]
    first_name: Optional[str]
    middle_name: Optional[str]

    date_of_birth: Optional[date]
    gender: Optional[str]

    email_personal: Optional[str]
    phone_work: Optional[str]
    phone_mobile: Optional[str]
    address: Optional[str]

    hire_date: Optional[date]
    termination_date: Optional[date]
    employment_status: Optional[str]
    job_title: Optional[str]
    position_level: Optional[str]
    grade: Optional[str]

    salary: Optional[float]


class EmployeeResponse(EmployeeCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
