from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.db import get_db
from models.audit import Audit
from models.audit_findings import AuditFinding
from schemas.audit_report import AuditReport

router = APIRouter()


@router.get("/audit/{audit_id}", response_model=AuditReport)
def get_audit_report(audit_id: int, db: Session = Depends(get_db)):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    findings = db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id).all()

    return {
        "audit": audit,
        "findings": findings
    }
