from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class AuditBase(BaseModel):
    audit_date: date
    audit_type: Optional[str] = None
    computer_name: Optional[str] = None
    employee_name: Optional[str] = None
    username: Optional[str] = None
    client: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    risk_level: Optional[str] = None
    status: Optional[str] = "pending"

    date_resolved: Optional[date] = None
    resolved_by: Optional[int] = None
    validation_date: Optional[date] = None
    validated_by: Optional[int] = None
    audited_by: Optional[int] = None


class AuditCreate(AuditBase):
    pass


class AuditUpdate(AuditBase):
    pass


class AuditOut(AuditBase):
    id: int
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditResponse(AuditOut):
    pass
