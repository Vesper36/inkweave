# InkWeave (墨织)

A structured narrative platform for creators and readers. Building digital libraries where stories breathe.

## Features

- **Volume & Chapter Management** -- Tree-structured organization with drag-and-drop sorting
- **Multi-Theme Reading Engine** -- Parchment, midnight, eye-care, cyberpunk themes with CSS variables
- **MDX Content Support** -- Markdown with safe HTML/CSS/JS sandboxed rendering
- **Tag & Search System** -- Multi-level tagging, full-text search with Meilisearch
- **Responsive Design** -- Mobile-first, fluid typography, reading progress tracking
- **Draft & Version Control** -- Auto-save, version history, conflict resolution

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Radix UI |
| Backend | FastAPI (Python) + SQLAlchemy (async) |
| Database | PostgreSQL 16 + Redis 7 |
| Search | Meilisearch |
| Deploy | Docker Compose (self-hosted) |

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services
docker compose up -d

# 3. Run database migrations
docker compose exec backend alembic upgrade head

# 4. Open in browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Meilisearch: http://localhost:7700
```

## Project Structure

```
inkweave/
├── frontend/          # Next.js 14 application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# UI components
│   │   ├── lib/       # Utilities, API client, themes
│   │   └── stores/    # Zustand state management
│   └── Dockerfile
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── models/    # SQLAlchemy ORM models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── routers/   # API endpoints
│   │   ├── core/      # Auth, security, utils
│   │   └── services/  # Business logic
│   ├── alembic/       # Database migrations
│   └── Dockerfile
├── docker/
│   └── nginx/         # Nginx reverse proxy config
├── docker-compose.yml
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/works` | List works (paginated) |
| POST | `/api/works` | Create work |
| GET | `/api/works/{slug}` | Get work detail |
| PUT | `/api/works/{slug}` | Update work |
| GET | `/api/works/{slug}/volumes` | List volumes |
| POST | `/api/works/{slug}/volumes` | Create volume |
| GET | `/api/works/{slug}/chapters` | List chapters |
| GET | `/api/works/{slug}/chapters/{ch}` | Get chapter content |
| POST | `/api/works/{slug}/volumes/{id}/chapters` | Create chapter |
| GET | `/api/tags` | List tags |
| POST | `/api/tags` | Create tag |

## License

MIT
