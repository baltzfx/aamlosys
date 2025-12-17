from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)
from sqlalchemy.sql import func
from core.db import Base


class InventoryAssignment(Base):
    __tablename__ = "inventory_assignments"

    id = Column(Integer, primary_key=True, index=True)

    # Core relations
    employee_id = Column(
        Integer,
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False
    )

    inventory_item_id = Column(
        Integer,
        ForeignKey("inventory_items.id", ondelete="RESTRICT"),
        nullable=False
    )

    # Org snapshot (IMPORTANT)
    branch_id = Column(
        Integer,
        ForeignKey("branches.id"),
        nullable=False
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False
    )

    # Assignment data
    quantity = Column(Integer, default=1)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    returned_at = Column(DateTime(timezone=True), nullable=True)

    condition_out = Column(String, nullable=True)
    condition_in = Column(String, nullable=True)
    remarks = Column(String, nullable=True)

