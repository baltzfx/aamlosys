from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from core.auth import require_session
from models.inventory_assignment import InventoryAssignment
from schemas.inventory_assignment import (
    InventoryAssignmentCreate,
    InventoryAssignmentUpdate,
    InventoryAssignmentRead
)
from typing import List

router = APIRouter(prefix="/inventory-assignments", tags=["Inventory Assignments"])


# CREATE
@router.post("/", response_model=InventoryAssignmentRead)
def create_inventory_assignment(
    data: InventoryAssignmentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    assignment = InventoryAssignment(**data.dict())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


# LIST ALL
@router.get("/", response_model=List[InventoryAssignmentRead])
def list_inventory_assignments(db: Session = Depends(get_db), user=Depends(require_session)):
    return db.query(InventoryAssignment).all()


# GET BY ID
@router.get("/{assignment_id}", response_model=InventoryAssignmentRead)
def get_inventory_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(InventoryAssignment).filter(InventoryAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Inventory assignment not found")
    return assignment


# UPDATE
@router.put("/{assignment_id}", response_model=InventoryAssignmentRead)
def update_inventory_assignment(
    assignment_id: int,
    data: InventoryAssignmentUpdate,
    db: Session = Depends(get_db)
):
    assignment = db.query(InventoryAssignment).filter(InventoryAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Inventory assignment not found")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assignment, key, value)

    db.commit()
    db.refresh(assignment)
    return assignment


# DELETE
@router.delete("/{assignment_id}")
def delete_inventory_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(InventoryAssignment).filter(InventoryAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Inventory assignment not found")

    db.delete(assignment)
    db.commit()
    return {"message": "Inventory assignment deleted successfully"}
