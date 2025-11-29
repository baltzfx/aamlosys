from pydantic import BaseModel, ConfigDict
from typing import Optional

class AuditFindingBase(BaseModel):
    audit_id: int
    findings: str
    remarks: Optional[str] = None


class AuditFindingCreate(AuditFindingBase):
    pass


class AuditFindingUpdate(BaseModel):
    findings: Optional[str] = None
    remarks: Optional[str] = None


class AuditFindingOut(AuditFindingBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
