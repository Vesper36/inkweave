"""Search API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.services.search import search_service

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
async def search(
    q: str = Query(..., min_length=1, max_length=200, description="Search query"),
    type: str = Query("all", description="Search type: all, works, chapters"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    status: str | None = Query(None, description="Filter by status"),
    rating: str | None = Query(None, description="Filter by rating"),
    tags: str | None = Query(None, description="Comma-separated tag names"),
    sort: str | None = Query(None, description="Sort: updated_at:desc, view_count:desc, etc."),
):
    """Full-text search across works and chapters."""
    offset = (page - 1) * page_size
    results: dict = {"works": None, "chapters": None, "total": 0}

    # Build filters for works
    work_filters = []
    if status:
        work_filters.append(f"status = '{status}'")
    if rating:
        work_filters.append(f"rating = '{rating}'")
    if tags:
        for tag in tags.split(","):
            tag = tag.strip()
            if tag:
                work_filters.append(f"tags = '{tag}'")
    work_filter_str = " AND ".join(work_filters) if work_filters else None

    # Build sort
    sort_list = None
    if sort:
        parts = sort.split(":")
        if len(parts) == 2:
            sort_list = [f"{parts[0]}:{parts[1]}"]

    if type in ("all", "works"):
        try:
            works_result = await search_service.search_works(
                q,
                offset=offset,
                limit=page_size,
                filters=work_filter_str,
                sort=sort_list,
            )
            results["works"] = {
                "hits": works_result.hits,
                "total_hits": works_result.estimated_total_hits,
                "processing_time": works_result.processing_time_ms,
            }
            results["total"] += works_result.estimated_total_hits or 0
        except Exception:
            results["works"] = {"hits": [], "total_hits": 0, "processing_time": 0}

    if type in ("all", "chapters"):
        chapter_filter = f"status = 'published'" if status == "published" else None
        try:
            chapters_result = await search_service.search_chapters(
                q,
                offset=offset,
                limit=page_size,
                filters=chapter_filter,
            )
            results["chapters"] = {
                "hits": chapters_result.hits,
                "total_hits": chapters_result.estimated_total_hits,
                "processing_time": chapters_result.processing_time_ms,
            }
            results["total"] += chapters_result.estimated_total_hits or 0
        except Exception:
            results["chapters"] = {"hits": [], "total_hits": 0, "processing_time": 0}

    return results


@router.get("/suggest")
async def suggest(
    q: str = Query(..., min_length=1, max_length=100),
):
    """Quick search suggestions for autocomplete."""
    try:
        result = await search_service.search_works(q, limit=5)
        suggestions = []
        for hit in result.hits[:5]:
            suggestions.append({
                "title": hit.get("title", ""),
                "slug": hit.get("slug", ""),
                "author_name": hit.get("author_name", ""),
                "rating": hit.get("rating", ""),
            })
        return {"suggestions": suggestions}
    except Exception:
        return {"suggestions": []}


@router.get("/stats")
async def stats():
    """Return search index stats."""
    return await search_service.get_stats()


@router.post("/sync")
async def sync_all():
    """Re-sync all works and chapters to Meilisearch (admin operation)."""
    from sqlalchemy import select
    from app.database import async_session
    from app.models.work import Work, Chapter
    from app.models.user import User
    from app.models.tag import Tag, WorkTag

    works_docs = []
    chapters_docs = []

    async with async_session() as session:
        # Sync works
        result = await session.execute(select(Work).where(Work.status == "published"))
        works = result.scalars().all()

        for work in works:
            # Get author name
            author = await session.get(User, work.author_id)
            author_name = author.display_name or author.username if author else ""

            # Get tag names
            tag_result = await session.execute(
                select(Tag.name)
                .join(WorkTag, Tag.id == WorkTag.c.tag_id)
                .where(WorkTag.c.work_id == work.id)
            )
            tag_names = [r[0] for r in tag_result.fetchall()]

            works_docs.append(search_service.work_to_document(work, author_name, tag_names))

        # Sync chapters
        chapter_result = await session.execute(
            select(Chapter).where(Chapter.status == "published")
        )
        chapters = chapter_result.scalars().all()

        for chapter in chapters:
            work = await session.get(Work, chapter.work_id)
            work_title = work.title if work else ""
            work_slug = work.slug if work else ""
            author_name = ""
            if work:
                author = await session.get(User, work.author_id)
                author_name = author.display_name or author.username if author else ""

            # Extract plain text from content
            content_text = ""
            if chapter.content_html:
                import re
                content_text = re.sub(r"<[^>]+>", "", chapter.content_html)[:5000]

            chapters_docs.append(
                search_service.chapter_to_document(chapter, work_title, work_slug, author_name, content_text)
            )

    await search_service.index_works_batch(works_docs)
    for doc in chapters_docs:
        await search_service.index_chapter(doc)

    return {"synced_works": len(works_docs), "synced_chapters": len(chapters_docs)}
