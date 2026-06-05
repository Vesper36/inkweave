from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagResponse, TagListResponse
from app.core.utils import generate_slug

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=TagListResponse)
async def list_tags(
    category: str | None = None,
    search: str | None = None,
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    query = select(Tag)
    count_query = select(func.count(Tag.id))

    if category:
        query = query.where(Tag.category == category)
        count_query = count_query.where(Tag.category == category)
    if search:
        query = query.where(Tag.name.ilike(f"%{search}%"))
        count_query = count_query.where(Tag.name.ilike(f"%{search}%"))

    query = query.order_by(Tag.usage_count.desc()).limit(limit)

    result = await db.execute(query)
    tags = result.scalars().all()

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    return TagListResponse(items=tags, total=total)


@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(data: TagCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Tag).where(Tag.name == data.name))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Tag already exists")

    tag = Tag(
        name=data.name,
        slug=generate_slug(data.name),
        color=data.color,
        category=data.category,
    )
    db.add(tag)
    await db.flush()
    await db.refresh(tag)
    return tag


@router.get("/{tag_slug}", response_model=TagResponse)
async def get_tag(tag_slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tag).where(Tag.slug == tag_slug))
    tag = result.scalar_one_or_none()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag
