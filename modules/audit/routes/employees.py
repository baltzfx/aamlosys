from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from datetime import datetime
from sqlalchemy.orm import joinedload
import uuid

from core.db import get_db
from core.auth import require_session

from models.branch import Branch
from models.department import Department

from models.employees import Employee
from models.employee_assignment import EmployeeAssignment

from schemas.employees import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
    EmployeeWithAssignmentUpdate
)

router = APIRouter()

def generate_eid():
    return f"E-{uuid.uuid4().hex[:6].upper()}"

# ======================
# CREATE EMPLOYEE
# ======================
@router.post("/")
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_session),
):
    # 1️⃣ Determine EID
    eid = data.eid.strip() if data.eid else generate_eid()

    # 2️⃣ Prevent duplicates early (clean error)
    exists = db.query(Employee).filter(Employee.eid == eid).first()
    if exists:
        raise HTTPException(
            status_code=409,
            detail="EID already exists"
        )

    employee = Employee(
        **data.model_dump(exclude={"eid"}, exclude_unset=True),
        eid=eid,
        user_id=user.id,
    )

    try:
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "EID already exists")


# ======================
# LIST EMPLOYEES
# ======================
@router.get("/")
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    results = []

    for emp in employees:
        assignment = (
            db.query(EmployeeAssignment)
            .filter(EmployeeAssignment.employee_id == emp.id)
            .order_by(EmployeeAssignment.start_date.desc())
            .first()
        )

        supervisor_name = None
        manager_name = None
        department_name = None
        branch_name = None

        if assignment:
            if assignment.supervisor_id:
                sup = db.query(Employee).filter(Employee.id == assignment.supervisor_id).first()
                supervisor_name = f"{sup.first_name} {sup.last_name}" if sup else None

            if assignment.manager_id:
                mgr = db.query(Employee).filter(Employee.id == assignment.manager_id).first()
                manager_name = f"{mgr.first_name} {mgr.last_name}" if mgr else None

            if assignment.department_id:
                dept = db.query(Department).filter(Department.id == assignment.department_id).first()
                department_name = dept.department if dept else None

            if assignment.branch_id:
                branch = db.query(Branch).filter(Branch.id == assignment.branch_id).first()
                branch_name = branch.branch_name if branch else None

        results.append({
            "id": emp.id,
            "eid": emp.eid,
            "first_name": emp.first_name,
            "last_name": emp.last_name,
            "job_title": emp.job_title,
            "position_level": emp.position_level,
            "employment_status": emp.employment_status,
            "department_name": department_name,
            "branch_name": branch_name,
            "supervisor_name": supervisor_name,
            "manager_name": manager_name,
        })

    return results


# ======================
# GET EMPLOYEE
# ======================
@router.get("/{employee_id}")
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    # Fetch employee
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Fetch latest assignment
    latest_assignment = (
        db.query(EmployeeAssignment)
        .filter(EmployeeAssignment.employee_id == employee_id)
        .order_by(EmployeeAssignment.start_date.desc())
        .first()
    )

    supervisor_name = None
    manager_name = None
    department_name = None
    branch_name = None

    if latest_assignment:
        # Supervisor
        if latest_assignment.supervisor_id:
            sup = db.query(Employee).filter(Employee.id == latest_assignment.supervisor_id).first()
            supervisor_name = f"{sup.first_name} {sup.last_name}" if sup else None

        # Manager
        if latest_assignment.manager_id:
            mgr = db.query(Employee).filter(Employee.id == latest_assignment.manager_id).first()
            manager_name = f"{mgr.first_name} {mgr.last_name}" if mgr else None

        # Department
        if latest_assignment.department_id:
            dept = db.query(Department).filter(Department.id == latest_assignment.department_id).first()
            department_name = getattr(dept, "name", None)

        # Branch
        if latest_assignment.branch_id:
            branch = db.query(Branch).filter(Branch.id == latest_assignment.branch_id).first()
            branch_name = getattr(branch, "name", None)

    return {
        "id": emp.id,
        "eid": emp.eid,
        "first_name": emp.first_name,
        "last_name": emp.last_name,
        "email_personal": emp.email_personal,
        "job_title": emp.job_title,
        "position_level": emp.position_level,
        "employment_status": emp.employment_status,
        "department_name": department_name,
        "branch_name": branch_name,
        "supervisor_name": supervisor_name,
        "manager_name": manager_name,
    }



# ======================
# UPDATE EMPLOYEE ONLY
# ======================
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

    if user.role != "admin" and emp.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    if user.role == "admin" and data.user_id is not None:
        emp.user_id = data.user_id

    update_data = data.dict(exclude_unset=True, exclude={"user_id"})
    for key, value in update_data.items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp


# ======================
# UPDATE EMPLOYEE + ASSIGNMENT
# ======================
@router.put("/{employee_id}/with-assignment")
def update_employee_with_assignment(
    employee_id: int,
    payload: EmployeeWithAssignmentUpdate,
    db: Session = Depends(get_db),
):
    # -----------------------
    # FETCH EMPLOYEE
    # -----------------------
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # -----------------------
    # UPDATE EMPLOYEE FIELDS
    # -----------------------
    emp_data = payload.employee.dict(exclude_unset=True)
    for key, value in emp_data.items():
        setattr(employee, key, value)

    # -----------------------
    # UPDATE OR CREATE ASSIGNMENT
    # -----------------------
    if payload.assignment:
        # Look for active assignment
        assignment = (
            db.query(EmployeeAssignment)
            .filter(
                EmployeeAssignment.employee_id == employee_id,
                EmployeeAssignment.end_date.is_(None)  # ✅ matches your model
            )
            .first()
        )

        if not assignment:
            # Create new assignment
            assignment = EmployeeAssignment(
                employee_id=employee_id,
                start_date=datetime.utcnow()
            )
            db.add(assignment)

        assign_data = payload.assignment.dict(exclude_unset=True)
        for key, value in assign_data.items():
            setattr(assignment, key, value)

    db.commit()
    return {"message": "Employee and assignment updated successfully"}

# ======================
# DELETE EMPLOYEE
# ======================
@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_session)
):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    if user.role != "admin" and emp.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted successfully"}
