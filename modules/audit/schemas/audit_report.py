from pydantic import BaseModel
from typing import List
from schemas.audit import AuditOut
from schemas.audit_findings import AuditFindingOut

class AuditReport(BaseModel):
    audit: AuditOut
    findings: List[AuditFindingOut]
