# from pydantic import BaseModel, EmailStr, Field
# from typing import Optional
# from datetime import date


# class OnboardEmployee(BaseModel):
#     # User info
#     email: EmailStr
#     fname: str = Field(min_length=1, max_length=100)
#     lname: str = Field(min_length=1, max_length=100)
#     password: str = Field(min_length=3, max_length=128)
#     role: Optional[str] = "user"
#     status: Optional[str] = "active"

#     # Employee info
#     employee_number: str = Field(min_length=1, max_length=30)
#     first_name: str = Field(min_length=1, max_length=100)
#     last_name: str = Field(min_length=1, max_length=100)
#     middle_name: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     gender: Optional[str] = None
#     email_personal: Optional[str] = None
#     phone_work: Optional[str] = None
#     phone_mobile: Optional[str] = None
#     address: Optional[str] = None
#     hire_date: Optional[date] = None
#     termination_date: Optional[date] = None
#     employment_status: Optional[str] = None
#     job_title: Optional[str] = None
#     position_level: Optional[str] = None
#     grade: Optional[str] = None
#     salary: Optional[float] = None
