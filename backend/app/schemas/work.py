from datetime import datetime
from pydantic import BaseModel


# === Work ===
class WorkCreate(BaseModel):
    title: str
    description: str | None = None
    cover_url: str | None = None
    content_warning: str | None = None
    rating: str = "general"
    language: str = "zh-CN"
    tag_ids: list[str] = []


class WorkUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    cover_url: str | None = None
    status: str | None = None
    content_warning: str | None = None
    rating: str | None = None
    tag_ids: list[str] | None = None


class WorkResponse(BaseModel):
    id: str
    author_id: str
    title: str
    slug: str
    description: str | None
    cover_url: str | None
    status: str
    word_count: int
    view_count: int
    favorite_count: int
    content_warning: str | None
    rating: str
    language: str
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None

    class Config:
        from_attributes = True


class WorkListResponse(BaseModel):
    items: list[WorkResponse]
    total: int
    page: int
    page_size: int


# === Volume ===
class VolumeCreate(BaseModel):
    title: str
    description: str | None = None
    sort_order: int = 0


class VolumeUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    sort_order: int | None = None


class VolumeResponse(BaseModel):
    id: str
    work_id: str
    title: str
    description: str | None
    sort_order: int
    created_at: datetime

    class Config:
        from_attributes = True


# === Chapter ===
class ChapterCreate(BaseModel):
    title: str
    content: dict | None = None
    content_html: str | None = None
    author_note: str | None = None
    sort_order: int = 0


class ChapterUpdate(BaseModel):
    title: str | None = None
    content: dict | None = None
    content_html: str | None = None
    status: str | None = None
    author_note: str | None = None
    sort_order: int | None = None


class ChapterResponse(BaseModel):
    id: str
    volume_id: str
    work_id: str
    title: str
    slug: str
    content: dict | None
    content_html: str | None
    status: str
    word_count: int
    sort_order: int
    version: int
    author_note: str | None
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChapterBriefResponse(BaseModel):
    """Chapter without content, for listing."""
    id: str
    volume_id: str
    title: str
    slug: str
    status: str
    word_count: int
    sort_order: int
    published_at: datetime | None

    class Config:
        from_attributes = True
