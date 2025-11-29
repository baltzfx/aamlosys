from pydantic import BaseModel, ConfigDict
from typing import Generic, TypeVar, List

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    page: int
    limit: int
    total_items: int
    total_pages: int
    items: List[T]

    model_config = ConfigDict(from_attributes=True)
