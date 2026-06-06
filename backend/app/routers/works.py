import re

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.work import Work, Volume, Chapter
from app.models.tag import Tag, WorkTag
from app.schemas.work import (
    WorkCreate, WorkUpdate, WorkResponse, WorkListResponse,
    VolumeCreate, VolumeUpdate, VolumeResponse,
    ChapterCreate, ChapterUpdate, ChapterResponse, ChapterBriefResponse,
)
from app.core.security import get_current_user
from app.core.utils import generate_slug, count_words

router = APIRouter(prefix="/works", tags=["works"])


async def _sync_work_to_search(work: Work, db: AsyncSession) -> None:
    """Background task to sync a work to Meilisearch."""
    try:
        from app.services.search import search_service

        # Get author
        author = await db.get(User, work.author_id)
        author_name = author.display_name or author.username if author else ""

        # Get tags
        tag_result = await db.execute(
            select(Tag.name).join(WorkTag, Tag.id == WorkTag.c.tag_id).where(WorkTag.c.work_id == work.id)
        )
        tag_names = [r[0] for r in tag_result.fetchall()]

        doc = search_service.work_to_document(work, author_name, tag_names)
        await search_service.index_work(doc)
    except Exception:
        pass  # don't fail the request if search sync fails


async def _sync_chapter_to_search(chapter: Chapter, db: AsyncSession) -> None:
    """Background task to sync a chapter to Meilisearch."""
    try:
        from app.services.search import search_service

        work = await db.get(Work, chapter.work_id)
        work_title = work.title if work else ""
        work_slug = work.slug if work else ""
        author_name = ""
        if work:
            author = await db.get(User, work.author_id)
            author_name = author.display_name or author.username if author else ""

        content_text = ""
        if chapter.content_html:
            content_text = re.sub(r"<[^>]+>", "", chapter.content_html)[:5000]

        doc = search_service.chapter_to_document(chapter, work_title, work_slug, author_name, content_text)
        await search_service.index_chapter(doc)
    except Exception:
        pass


# === Works ===
@router.get("", response_model=WorkListResponse)
async def list_works(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    tag: str | None = None,
    sort: str = "updated_at",
    db: AsyncSession = Depends(get_db),
):
    query = select(Work)
    count_query = select(func.count(Work.id))

    if status:
        query = query.where(Work.status == status)
        count_query = count_query.where(Work.status == status)

    # Sorting
    sort_column = getattr(Work, sort, Work.updated_at)
    query = query.order_by(sort_column.desc())

    # Pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    works = result.scalars().all()

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    return WorkListResponse(items=works, total=total, page=page, page_size=page_size)


@router.post("", response_model=WorkResponse, status_code=status.HTTP_201_CREATED)
async def create_work(
    data: WorkCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    slug = generate_slug(data.title)
    work = Work(
        author_id=current_user.id,
        title=data.title,
        slug=slug,
        description=data.description,
        cover_url=data.cover_url,
        content_warning=data.content_warning,
        rating=data.rating,
        language=data.language,
    )
    db.add(work)
    await db.flush()
    await db.refresh(work)
    background_tasks.add_task(_sync_work_to_search, work, db)
    return work


@router.get("/{work_slug}", response_model=WorkResponse)
async def get_work(work_slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    return work


@router.put("/{work_slug}", response_model=WorkResponse)
async def update_work(
    work_slug: str,
    data: WorkUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    if work.author_id != current_user.id and current_user.role not in ("admin", "moderator"):
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(work, field, value)

    await db.flush()
    await db.refresh(work)
    background_tasks.add_task(_sync_work_to_search, work, db)
    return work


# === Volumes ===
@router.get("/{work_slug}/volumes", response_model=list[VolumeResponse])
async def list_volumes(work_slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    vol_result = await db.execute(
        select(Volume).where(Volume.work_id == work.id).order_by(Volume.sort_order)
    )
    return vol_result.scalars().all()


@router.post("/{work_slug}/volumes", response_model=VolumeResponse, status_code=status.HTTP_201_CREATED)
async def create_volume(
    work_slug: str,
    data: VolumeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    if work.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    volume = Volume(work_id=work.id, title=data.title, description=data.description, sort_order=data.sort_order)
    db.add(volume)
    await db.flush()
    await db.refresh(volume)
    return volume


# === Chapters ===
@router.get("/{work_slug}/chapters", response_model=list[ChapterBriefResponse])
async def list_chapters(work_slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    ch_result = await db.execute(
        select(Chapter).where(Chapter.work_id == work.id).order_by(Chapter.sort_order)
    )
    return ch_result.scalars().all()


@router.get("/{work_slug}/chapters/{chapter_slug}", response_model=ChapterResponse)
async def get_chapter(work_slug: str, chapter_slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    ch_result = await db.execute(
        select(Chapter).where(Chapter.work_id == work.id, Chapter.slug == chapter_slug)
    )
    chapter = ch_result.scalar_one_or_none()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return chapter


@router.post("/{work_slug}/volumes/{volume_id}/chapters", response_model=ChapterResponse, status_code=status.HTTP_201_CREATED)
async def create_chapter(
    work_slug: str,
    volume_id: str,
    data: ChapterCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Work).where(Work.slug == work_slug))
    work = result.scalar_one_or_none()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    if work.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    vol_result = await db.execute(select(Volume).where(Volume.id == volume_id, Volume.work_id == work.id))
    volume = vol_result.scalar_one_or_none()
    if not volume:
        raise HTTPException(status_code=404, detail="Volume not found")

    content_text = str(data.content) if data.content else ""
    chapter = Chapter(
        volume_id=volume_id,
        work_id=work.id,
        title=data.title,
        slug=generate_slug(data.title),
        content=data.content,
        content_html=data.content_html,
        word_count=count_words(content_text),
        sort_order=data.sort_order,
        author_note=data.author_note,
    )
    db.add(chapter)
    await db.flush()
    await db.refresh(chapter)
    background_tasks.add_task(_sync_chapter_to_search, chapter, db)
    return chapter
