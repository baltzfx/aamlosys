# app/models/employee_assignment.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from core.db import Base


class EmployeeAssignment(Base):
    __tablename__ = "employee_assignments"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)

    supervisor_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)

    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=True)
