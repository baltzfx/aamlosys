from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from core.auth import require_session
from models.department import Department
from schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentRead
)
from typing import List

router = APIRouter()


# CREATE
@router.post("/", response_model=DepartmentRead)
def create_department(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    department = Department(**data.dict())
    db.add(department)
    db.commit()
    db.refresh(department)
    return department


# LIST ALL
@router.get("/", response_model=List[DepartmentRead])
def list_departments(
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    return db.query(Department).all()


# GET BY ID
@router.get("/{department_id}", response_model=DepartmentRead)
def get_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department


# UPDATE
@router.put("/{department_id}", response_model=DepartmentRead)
def update_department(
    department_id: int,
    data: DepartmentUpdate,
    db: Session = Depends(get_db)
):
    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(department, key, value)

    db.commit()
    db.refresh(department)
    return department


# DELETE
@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    db.delete(department)
    db.commit()
    return {"message": "Department deleted successfully"}
