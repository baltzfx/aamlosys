from pydantic import BaseModel, Field, field_validator
from typing import Optional


class DepartmentBase(BaseModel):
    code: str = Field(min_length=1, max_length=30)
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None

    @field_validator(
        "code", "name", "description",
        mode="before", check_fields=False
    )
    def empty_string_to_none(cls, v):
        if v == "" or v == 0:
            return None
        return v   

class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    
    @field_validator(
        "code", "name", "description",
        mode="before", check_fields=False
    )
    def empty_string_to_none(cls, v):
        if v == "" or v == 0:
            return None
        return v    


class DepartmentRead(DepartmentBase):
    id: int

    class Config:
        orm_mode = True
