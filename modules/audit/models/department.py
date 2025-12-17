from sqlalchemy import Column, Integer, String, ForeignKey
from core.db import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(30), unique=True, index=True, nullable=True)         # changed
    department = Column(String(200), nullable=True)                            # changed
    group = Column(String(200), nullable=True)                                 # changed
    section = Column(String(200), nullable=True)                               # changed
    unit = Column(String(200), nullable=True)                                  # changed
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)     # changed
    remarks = Column(String(500), nullable=True)
