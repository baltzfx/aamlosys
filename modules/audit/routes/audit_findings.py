from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.db import get_db
from models.audit_findings import AuditFinding
from schemas.audit_findings import (
    AuditFindingCreate,
    AuditFindingUpdate,
    AuditFindingOut,
)
from schemas.pagination import PaginatedResponse



router = APIRouter()


@router.post("/", response_model=AuditFindingOut)
def create_finding(data: AuditFindingCreate, db: Session = Depends(get_db)):
    finding = AuditFinding(**data.dict())
    db.add(finding)
    db.commit()
    db.refresh(finding)
    return finding


@router.get("/by-audit/{audit_id}", response_model=list[AuditFindingOut])
def get_findings(audit_id: int, db: Session = Depends(get_db)):
    return db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id).all()


@router.get("/by-audit/{audit_id}", response_model=PaginatedResponse)
def get_findings_by_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    page: int = 1,
    limit: int = 10,
):
    query = db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id)

    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit
    offset = (page - 1) * limit

    findings = query.offset(offset).limit(limit).all()

    return PaginatedResponse(
        page=page,
        limit=limit,
        total_items=total_items,
        total_pages=total_pages,
        items=findings,
    )


@router.put("/{finding_id}", response_model=AuditFindingOut)
def update_finding(finding_id: int, data: AuditFindingUpdate, db: Session = Depends(get_db)):
    finding = db.query(AuditFinding).filter(AuditFinding.id == finding_id).first()

    for key, value in data.dict(exclude_unset=True).items():
        setattr(finding, key, value)

    db.commit()
    db.refresh(finding)
    return finding


@router.delete("/{finding_id}")
def delete_finding(finding_id: int, db: Session = Depends(get_db)):
    db.query(AuditFinding).filter(AuditFinding.id == finding_id).delete()
    db.commit()
    return {"message": "Finding deleted"}
