from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from core.db import get_db
from models.employees import Employee
from schemas.employees import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse
)

router = APIRouter()


@router.post("/", response_model=EmployeeResponse)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    employee = Employee(**data.dict())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

@router.get("/", response_model=List[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return employees

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(404, "Employee not found")
    
    return employee

@router.get("/search/", response_model=List[EmployeeResponse])
def search_employees(
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Employee)

    if keyword:
        keyword = f"%{keyword}%"
        query = query.filter(
            (Employee.first_name.ilike(keyword)) |
            (Employee.last_name.ilike(keyword)) |
            (Employee.eid.ilike(keyword)) |
            (Employee.job_title.ilike(keyword))
        )

    return query.all()

@router.patch("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: int, data: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        raise HTTPException(404, "Employee not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        raise HTTPException(404, "Employee not found")

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}
