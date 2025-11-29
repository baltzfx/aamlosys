# app/models/branch.py
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from app.config.db import Base


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    location = Column(String(200), nullable=True)
    date_established = Column(Date, nullable=True)

    # reverse relationship
    assignments = relationship("EmployeeAssignment", back_populates="branch")