from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from core.auth import require_session
from models.employees import Employee
from schemas.employees import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from typing import List

router = APIRouter()


# CREATE EMPLOYEE
@router.post("/", response_model=EmployeeResponse)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    # Admin must specify user_id
    if user.role == "admin":
        if not data.user_id:
            raise HTTPException(status_code=400, detail="Admin must specify user_id")
        assigned_user_id = data.user_id
    else:
        assigned_user_id = user.id

    # Create employee
    emp = Employee(
        **data.dict(exclude={"user_id"}),
        user_id=assigned_user_id
    )

    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


# LIST ALL EMPLOYEES
@router.get("/", response_model=List[EmployeeResponse])
def list_employees(db: Session = Depends(get_db), user=Depends(require_session)):
    if user.role == "admin":
        return db.query(Employee).all()

    return db.query(Employee).filter(Employee.user_id == user.id).all()


# GET EMPLOYEE BY ID
@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db), user=Depends(require_session)):

    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    if user.role != "admin" and emp.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this employee")

    return emp


# UPDATE EMPLOYEE
@router.put("/{emp_id}", response_model=EmployeeResponse)
def update_employee(
    emp_id: int,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Normal user cannot edit others
    if user.role != "admin" and emp.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    # Admin can reassign employee
    if user.role == "admin" and data.user_id is not None:
        emp.user_id = data.user_id

    # Update other fields
    update_data = data.dict(exclude_unset=True, exclude={"user_id"})
    for key, value in update_data.items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp


# DELETE EMPLOYEE
@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db), user=Depends(require_session)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    if user.role != "admin" and emp.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted successfully"}
