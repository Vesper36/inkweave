from datetime import datetime
from pydantic import BaseModel


class TagCreate(BaseModel):
    name: str
    color: str | None = None
    category: str | None = None


class TagResponse(BaseModel):
    id: str
    name: str
    slug: str
    color: str | None
    category: str | None
    usage_count: int

    class Config:
        from_attributes = True


class TagListResponse(BaseModel):
    items: list[TagResponse]
    total: int
