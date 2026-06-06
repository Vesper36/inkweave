"""Meilisearch integration for full-text search."""

from __future__ import annotations

import logging
from typing import Any

from meilisearch_python_sdk import AsyncClient

from app.config import get_settings

logger = logging.getLogger(__name__)

# Index names
WORKS_INDEX = "works"
CHAPTERS_INDEX = "chapters"

# Searchable/filterable attributes
WORKS_SEARCHABLE = ["title", "description", "author_name", "tag_names"]
WORKS_FILTERABLE = ["status", "rating", "tags", "author_name", "language"]
WORKS_SORTABLE = ["updated_at", "created_at", "view_count", "favorite_count", "word_count"]

CHAPTERS_SEARCHABLE = ["title", "content_text", "work_title", "author_name"]
CHAPTERS_FILTERABLE = ["work_id", "work_slug", "status"]
CHAPTERS_SORTABLE = ["updated_at", "sort_order"]


class SearchService:
    """Manages Meilisearch indices and document sync."""

    def __init__(self) -> None:
        self._client: AsyncClient | None = None

    @property
    def client(self) -> AsyncClient:
        if self._client is None:
            settings = get_settings()
            self._client = AsyncClient(settings.meili_url, settings.meili_master_key)
        return self._client

    # ------------------------------------------------------------------
    # Index setup
    # ------------------------------------------------------------------

    async def setup_indices(self) -> None:
        """Create indices with configured searchable/filterable/sortable attributes."""
        try:
            # Works index
            await self.client.create_index(WORKS_INDEX, primary_key="id")
        except Exception:
            pass  # already exists
        try:
            await self.client.create_index(CHAPTERS_INDEX, primary_key="id")
        except Exception:
            pass

        works_index = self.client.index(WORKS_INDEX)
        chapters_index = self.client.index(CHAPTERS_INDEX)

        await works_index.update_searchable_attributes(WORKS_SEARCHABLE)
        await works_index.update_filterable_attributes(WORKS_FILTERABLE)
        await works_index.update_sortable_attributes(WORKS_SORTABLE)
        await works_index.update_ranking_rules([
            "words",
            "typo",
            "proximity",
            "attribute",
            "sort",
            "exactness",
        ])

        await chapters_index.update_searchable_attributes(CHAPTERS_SEARCHABLE)
        await chapters_index.update_filterable_attributes(CHAPTERS_FILTERABLE)
        await chapters_index.update_sortable_attributes(CHAPTERS_SORTABLE)

        logger.info("Meilisearch indices configured")

    # ------------------------------------------------------------------
    # Work sync
    # ------------------------------------------------------------------

    async def index_work(self, work_data: dict[str, Any]) -> None:
        """Index or update a single work document."""
        index = self.client.index(WORKS_INDEX)
        await index.add_or_update_documents([work_data])
        logger.debug("Indexed work: %s", work_data.get("id"))

    async def delete_work(self, work_id: str) -> None:
        """Remove a work from the index."""
        index = self.client.index(WORKS_INDEX)
        await index.delete_document(work_id)

    async def index_works_batch(self, works: list[dict[str, Any]]) -> None:
        """Bulk-index work documents."""
        if not works:
            return
        index = self.client.index(WORKS_INDEX)
        await index.add_or_update_documents(works)
        logger.info("Batch-indexed %d works", len(works))

    # ------------------------------------------------------------------
    # Chapter sync
    # ------------------------------------------------------------------

    async def index_chapter(self, chapter_data: dict[str, Any]) -> None:
        index = self.client.index(CHAPTERS_INDEX)
        await index.add_or_update_documents([chapter_data])

    async def delete_chapter(self, chapter_id: str) -> None:
        index = self.client.index(CHAPTERS_INDEX)
        await index.delete_document(chapter_id)

    # ------------------------------------------------------------------
    # Search
    # ------------------------------------------------------------------

    async def search_works(
        self,
        query: str,
        *,
        offset: int = 0,
        limit: int = 20,
        filters: str | None = None,
        sort: list[str] | None = None,
    ) -> dict[str, Any]:
        """Search works index."""
        index = self.client.index(WORKS_INDEX)
        params: dict[str, Any] = {
            "offset": offset,
            "limit": limit,
            "attributes_to_highlight": ["title", "description"],
            "highlight_pre_tag": "<mark>",
            "highlight_post_tag": "</mark>",
            "attributes_to_crop": ["description"],
            "crop_length": 200,
        }
        if filters:
            params["filter"] = filters
        if sort:
            params["sort"] = sort
        return await index.search(query, **params)

    async def search_chapters(
        self,
        query: str,
        *,
        offset: int = 0,
        limit: int = 20,
        filters: str | None = None,
    ) -> dict[str, Any]:
        """Search chapters index."""
        index = self.client.index(CHAPTERS_INDEX)
        params: dict[str, Any] = {
            "offset": offset,
            "limit": limit,
            "attributes_to_highlight": ["title", "content_text"],
            "highlight_pre_tag": "<mark>",
            "highlight_post_tag": "</mark>",
            "attributes_to_crop": ["content_text"],
            "crop_length": 300,
        }
        if filters:
            params["filter"] = filters
        return await index.search(query, **params)

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------

    async def get_stats(self) -> dict[str, Any]:
        """Return index stats."""
        try:
            stats = await self.client.get_all_stats()
            return {
                "works": stats.indexes.get(WORKS_INDEX, {}),
                "chapters": stats.indexes.get(CHAPTERS_INDEX, {}),
            }
        except Exception as e:
            return {"error": str(e)}

    def work_to_document(self, work: Any, author_name: str = "", tag_names: list[str] | None = None) -> dict[str, Any]:
        """Convert a Work ORM instance to a Meilisearch document."""
        return {
            "id": work.id,
            "title": work.title,
            "slug": work.slug,
            "description": work.description or "",
            "cover_url": work.cover_url or "",
            "status": work.status,
            "rating": work.rating,
            "language": work.language,
            "word_count": work.word_count,
            "view_count": work.view_count,
            "favorite_count": work.favorite_count,
            "author_name": author_name,
            "author_id": work.author_id,
            "tag_names": tag_names or [],
            "tags": tag_names or [],
            "updated_at": int(work.updated_at.timestamp()) if work.updated_at else 0,
            "created_at": int(work.created_at.timestamp()) if work.created_at else 0,
        }

    def chapter_to_document(
        self,
        chapter: Any,
        work_title: str = "",
        work_slug: str = "",
        author_name: str = "",
        content_text: str = "",
    ) -> dict[str, Any]:
        """Convert a Chapter ORM instance to a Meilisearch document."""
        return {
            "id": chapter.id,
            "title": chapter.title,
            "slug": chapter.slug,
            "work_id": chapter.work_id,
            "work_slug": work_slug,
            "work_title": work_title,
            "author_name": author_name,
            "content_text": content_text[:5000],  # limit for index size
            "status": chapter.status,
            "word_count": chapter.word_count,
            "sort_order": chapter.sort_order,
            "updated_at": int(chapter.updated_at.timestamp()) if chapter.updated_at else 0,
        }


search_service = SearchService()
