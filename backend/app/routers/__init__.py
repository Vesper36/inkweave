from app.routers.auth import router as auth_router
from app.routers.works import router as works_router
from app.routers.tags import router as tags_router
from app.routers.search import router as search_router

__all__ = ["auth_router", "works_router", "tags_router", "search_router"]
