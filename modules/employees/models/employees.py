from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from core.db import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key to users table
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_id = Column(String, unique=True, index=True)

    # Core identity
    eid = Column(String, unique=True, index=True)  # employee_id
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    middle_name = Column(String)

    # Personal info
    date_of_birth = Column(Date)
    gender = Column(String)

    # Contact
    email_personal = Column(String)
    phone_work = Column(String)
    phone_mobile = Column(String)
    address = Column(String)

    # Employment
    hire_date = Column(Date)
    termination_date = Column(Date)
    employment_status = Column(String)
    job_title = Column(String)
    position_level = Column(String)
    grade = Column(String)

    salary = Column(Float)

    # Audit
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="employees")
