from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db import get_db
from models.audit import Audit
from schemas.audit import AuditCreate, AuditUpdate, AuditResponse, AuditOut
from schemas.pagination import PaginatedResponse
from datetime import date

router = APIRouter()


@router.post("/", response_model=AuditResponse)
def create_audit(data: AuditCreate, db: Session = Depends(get_db)):
    audit = Audit(**data.dict())
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit


@router.get("/", response_model=PaginatedResponse[AuditOut])
def list_audits(
    db: Session = Depends(get_db),
    client: str = None,
    risk_level: str = None,
    status: str = None,
    computer_name: str = None,
    audited_by: int = None,
    date_from: date = None,
    date_to: date = None,
    page: int = 1,
    limit: int = 10,
):
    query = db.query(Audit)

    if client:
        query = query.filter(Audit.client.ilike(f"%{client}%"))
    if risk_level:
        query = query.filter(Audit.risk_level == risk_level)
    if status:
        query = query.filter(Audit.status == status)
    if computer_name:
        query = query.filter(Audit.computer_name.ilike(f"%{computer_name}%"))
    if audited_by:
        query = query.filter(Audit.audited_by == audited_by)
    if date_from:
        query = query.filter(Audit.audit_date >= date_from)
    if date_to:
        query = query.filter(Audit.audit_date <= date_to)

    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit
    offset = (page - 1) * limit

    audits = query.offset(offset).limit(limit).all()

    # ✅ Convert SQLAlchemy objects to Pydantic using from_attributes
    return PaginatedResponse[AuditOut](
        page=page,
        limit=limit,
        total_items=total_items,
        total_pages=total_pages,
        items=audits
    )


@router.get("/audits/{audit_id}", response_model=AuditOut)
def get_audit(audit_id: int, db: Session = Depends(get_db)):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")

    return audit


@router.put("/{audit_id}", response_model=AuditResponse)
def update_audit(audit_id: int, data: AuditUpdate, db: Session = Depends(get_db)):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()

    for key, value in data.dict(exclude_unset=True).items():
        setattr(audit, key, value)

    db.commit()
    db.refresh(audit)
    return audit


@router.delete("/{audit_id}")
def delete_audit(audit_id: int, db: Session = Depends(get_db)):
    db.query(Audit).filter(Audit.id == audit_id).delete()
    db.commit()
    return {"message": "Audit deleted"}


@router.get("/search/by-auditor/{user_id}", response_model=list[AuditResponse])
def search_by_auditor(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Audit)
        .filter(Audit.audited_by == user_id)
        .order_by(Audit.audit_date.desc())
        .all()
    )


@router.get("/search/computer/{name}", response_model=list[AuditResponse])
def search_by_computer(name: str, db: Session = Depends(get_db)):
    return (
        db.query(Audit)
        .filter(Audit.computer_name.ilike(f"%{name}%"))
        .all()
    )
