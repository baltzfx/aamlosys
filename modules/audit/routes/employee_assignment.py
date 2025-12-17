from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from core.auth import require_session
from models.employee_assignment import EmployeeAssignment
from schemas.employee_assignment import (
    EmployeeAssignmentCreate,
    EmployeeAssignmentUpdate,
    EmployeeAssignmentRead
)
from typing import List

router = APIRouter(prefix="/employee-assignments", tags=["Employee Assignments"])


# CREATE
@router.post("/", response_model=EmployeeAssignmentRead)
def create_assignment(
    data: EmployeeAssignmentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    assignment = EmployeeAssignment(**data.dict())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


# LIST ALL
@router.get("/", response_model=List[EmployeeAssignmentRead])
def list_assignments(db: Session = Depends(get_db), user=Depends(require_session)):
    return db.query(EmployeeAssignment).all()


# GET BY ID
@router.get("/{assignment_id}", response_model=EmployeeAssignmentRead)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(EmployeeAssignment).filter(EmployeeAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


# UPDATE
@router.put("/{assignment_id}", response_model=EmployeeAssignmentRead)
def update_assignment(
    assignment_id: int,
    data: EmployeeAssignmentUpdate,
    db: Session = Depends(get_db)
):
    assignment = db.query(EmployeeAssignment).filter(EmployeeAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assignment, key, value)

    db.commit()
    db.refresh(assignment)
    return assignment


# DELETE
@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(EmployeeAssignment).filter(EmployeeAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()
    return {"message": "Employee assignment deleted successfully"}
