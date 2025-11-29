# app/models/employee_assignment.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.config.db import Base


class EmployeeAssignment(Base):
    __tablename__ = "employee_assignments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    supervisor_id = Column(Integer, ForeignKey("supervisors.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("managers.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    account_group_id = Column(Integer, ForeignKey("account_groups.id"), nullable=True)

    start_assignment = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    end_assignment = Column(DateTime(timezone=True), nullable=True)

    # relationships
    employee = relationship("Employee", back_populates="assignments")
    supervisor = relationship("Supervisor", back_populates="assignments")
    manager = relationship("Manager", back_populates="assignments")
    branch = relationship("Branch", back_populates="assignments")
    department = relationship("Department", back_populates="assignments")
    account_group = relationship("AccountGroup", back_populates="assignments")
