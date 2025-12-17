from sqlalchemy import Column, Integer, String, Date
from core.db import Base


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    branch_code = Column(String(20), unique=True, index=True, nullable=False)
    branch_name = Column(String(200), nullable=False)
    branch_address = Column(String(200), nullable=True)
    date_established = Column(Date, nullable=True)
