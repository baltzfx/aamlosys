from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from core.db import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    eid = Column(String, unique=True, index=True)
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    middle_name = Column(String)

    date_of_birth = Column(Date)
    gender = Column(String)

    email_personal = Column(String)
    phone_work = Column(String)
    phone_mobile = Column(String)
    address = Column(String)

    hire_date = Column(Date)
    termination_date = Column(Date)
    employment_status = Column(String, default="active")
    job_title = Column(String)
    position_level = Column(String)
    grade = Column(String)
    salary = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)