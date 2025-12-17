from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.db import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    asset_tag = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # device, equipment, consumable
    serial_number = Column(String, nullable=True)
    is_consumable = Column(Boolean, default=False)
    status = Column(String, default="available")  # available, assigned, damaged, retired
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
