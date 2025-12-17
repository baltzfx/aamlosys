from pydantic import BaseModel
from typing import Optional
from .branch import BranchRead

class InventoryItemBase(BaseModel):
    asset_tag: Optional[str] = None
    name: str
    category: str
    serial_number: Optional[str] = None
    is_consumable: bool = False
    status: str = "available"
    branch_id: int

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(BaseModel):
    asset_tag: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    serial_number: Optional[str] = None
    is_consumable: Optional[bool] = None
    status: Optional[str] = None
    branch_id: Optional[int] = None

class InventoryItemRead(InventoryItemBase):
    id: int
    branch: Optional[BranchRead] = None

    class Config:
        from_attributes = True
