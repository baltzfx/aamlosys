from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from core.auth import require_session
from models.inventory_items import InventoryItem
from schemas.inventory_items import InventoryItemCreate, InventoryItemUpdate, InventoryItemRead
from typing import List

router = APIRouter()


# CREATE INVENTORY ITEM
@router.post("/", response_model=InventoryItemRead)
def create_inventory_item(
    data: InventoryItemCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    item = InventoryItem(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# LIST ALL INVENTORY ITEMS
@router.get("/", response_model=List[InventoryItemRead])
def list_inventory_items(db: Session = Depends(get_db), user=Depends(require_session)):
    return db.query(InventoryItem).all()


# GET INVENTORY ITEM BY ID
@router.get("/{item_id}", response_model=InventoryItemRead)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item


# UPDATE INVENTORY ITEM
@router.put("/{item_id}", response_model=InventoryItemRead)
def update_inventory_item(
    item_id: int,
    data: InventoryItemUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item


# DELETE INVENTORY ITEM
@router.delete("/{item_id}")
def delete_inventory_item(item_id: int, db: Session = Depends(get_db), user=Depends(require_session)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    db.delete(item)
    db.commit()
    return {"message": "Inventory item deleted successfully"}
