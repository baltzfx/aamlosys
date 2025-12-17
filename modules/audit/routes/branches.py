from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from core.auth import require_session
from models.branch import Branch
from schemas.branch import (
    BranchCreate,
    BranchUpdate,
    BranchRead
)
from typing import List

router = APIRouter()


# CREATE
@router.post("/", response_model=BranchRead)
def create_branch(
    data: BranchCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    branch = Branch(**data.dict())
    db.add(branch)
    db.commit()
    db.refresh(branch)
    return branch


# LIST ALL
@router.get("/", response_model=List[BranchRead])
def list_branches(
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    return db.query(Branch).all()


# GET BY ID
@router.get("/{branch_id}", response_model=BranchRead)
def get_branch(
    branch_id: int,
    db: Session = Depends(get_db)
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch


# UPDATE
@router.put("/{branch_id}", response_model=BranchRead)
def update_branch(
    branch_id: int,
    data: BranchUpdate,
    db: Session = Depends(get_db)
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(branch, key, value)

    db.commit()
    db.refresh(branch)
    return branch


# DELETE
@router.delete("/{branch_id}")
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db)
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    db.delete(branch)
    db.commit()
    return {"message": "Branch deleted successfully"}
