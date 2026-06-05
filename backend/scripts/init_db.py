"""Initialize database tables and seed development data."""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, async_session, Base
from app.models import User, Work, Volume, Chapter, Tag, WorkTag
from app.core.security import get_password_hash
from app.core.utils import generate_slug
from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import select, func


async def init_db():
    """Create all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Database tables created")


async def seed_data():
    """Seed development data."""
    async with async_session() as db:
        count = await db.execute(select(func.count(User.id)))
        if count.scalar() > 0:
            print("[SKIP] Database already seeded")
            return

        # Users
        admin_id = str(uuid4())
        author1_id = str(uuid4())
        author2_id = str(uuid4())

        users = [
            User(id=admin_id, username="admin", email="admin@inkweave.dev",
                 hashed_password=get_password_hash("admin123"), display_name="Admin", role="admin"),
            User(id=author1_id, username="evelync", email="evelyn@inkweave.dev",
                 hashed_password=get_password_hash("author123"), display_name="Evelyn Chen",
                 bio="Writing code and fiction in equal measure.", role="author"),
            User(id=author2_id, username="starwriter", email="star@inkweave.dev",
                 hashed_password=get_password_hash("author123"), display_name="Star Writer",
                 bio="Sci-fi enthusiast and chronic over-writer.", role="author"),
        ]
        db.add_all(users)

        # Tags
        tags_data = [
            ("Sci-Fi", "#6366f1", "genre"), ("Fantasy", "#8b5cf6", "genre"),
            ("Romance", "#ec4899", "genre"), ("Mystery", "#f59e0b", "genre"),
            ("Horror", "#ef4444", "genre"), ("AI", "#06b6d4", "theme"),
            ("Time Travel", "#10b981", "theme"), ("Found Family", "#f97316", "trope"),
            ("Enemies to Lovers", "#e11d48", "trope"), ("Slow Burn", "#d97706", "trope"),
        ]
        tag_objs = []
        for name, color, category in tags_data:
            tag = Tag(id=str(uuid4()), name=name, slug=generate_slug(name),
                      color=color, category=category, usage_count=10)
            tag_objs.append(tag)
        db.add_all(tag_objs)

        # Works
        work1_id, work2_id, work3_id = str(uuid4()), str(uuid4()), str(uuid4())
        works = [
            Work(id=work1_id, author_id=author1_id, title="The Last Algorithm",
                 slug="the-last-algorithm",
                 description="In a world where code shapes reality, one programmer discovers the ultimate function.",
                 status="published", word_count=128000, view_count=15200, favorite_count=3400,
                 rating="general", language="en",
                 published_at=datetime(2025, 12, 15, tzinfo=timezone.utc)),
            Work(id=work2_id, author_id=author2_id, title="Starfall Chronicles: Volume 3",
                 slug="starfall-chronicles-v3",
                 description="Commander Li faces her greatest challenge yet beyond the Orion Arm.",
                 status="published", word_count=95000, view_count=8700, favorite_count=2100,
                 content_warning="violence", rating="teen", language="zh-CN",
                 published_at=datetime(2026, 2, 1, tzinfo=timezone.utc)),
            Work(id=work3_id, author_id=author1_id, title="Midnight Garden",
                 slug="midnight-garden",
                 description="A gothic romance set in Victorian England. Secrets bloom in the shadows.",
                 status="published", word_count=67000, view_count=5400, favorite_count=1800,
                 rating="mature", language="en",
                 published_at=datetime(2026, 3, 10, tzinfo=timezone.utc)),
        ]
        db.add_all(works)
        await db.flush()  # Flush to make works available for FK references

        # Work-Tag associations
        for wid, tidx in [(work1_id, 0), (work1_id, 5), (work2_id, 0), (work2_id, 6), (work3_id, 2), (work3_id, 4)]:
            await db.execute(WorkTag.insert().values(work_id=wid, tag_id=tag_objs[tidx].id))

        # Volumes & Chapters for work1
        vol1_id, vol2_id = str(uuid4()), str(uuid4())
        db.add_all([
            Volume(id=vol1_id, work_id=work1_id, title="Part I: The Source Code", sort_order=0),
            Volume(id=vol2_id, work_id=work1_id, title="Part II: Compilation", sort_order=1),
        ])

        chapters = [
            (vol1_id, work1_id, "Chapter 1: Hello World", "hello-world", 4200, 0,
             datetime(2025, 12, 15, tzinfo=timezone.utc),
             "<p>The cursor blinked on an empty screen -- a single, patient pulse of light in the darkness of Dr. Lin's office at 2:47 AM.</p><p>She had been staring at it for forty-three minutes, though anyone watching would have thought she was simply sleeping with her eyes open.</p><p>But Dr. Evelyn Lin never slept. Not anymore.</p><p>The terminal displayed nothing unusual: a standard POSIX shell, a blinking cursor, the soft hum of a machine waiting for instruction.</p><p>Everything was the same, and yet tonight, something was <em>different</em>.</p>"),
            (vol1_id, work1_id, "Chapter 2: The First Variable", "the-first-variable", 3800, 1,
             datetime(2025, 12, 20, tzinfo=timezone.utc),
             "<p>Variables, in Evelyn's experience, were containers for the unknown. You declared them when you needed to hold something you didn't yet understand.</p><p>She declared her first reality variable at 3:14 AM on a Tuesday, and the universe responded with a segmentation fault.</p>"),
            (vol1_id, work1_id, "Chapter 3: Recursive Dreams", "recursive-dreams", 5100, 2,
             datetime(2026, 1, 1, tzinfo=timezone.utc),
             "<p>The dreams started three days after she ran the program. The same dream, nested inside itself like a recursive function with no base case.</p><p>She would dream of a terminal, and in the terminal she would type a command, and the command would open a terminal...</p>"),
            (vol2_id, work1_id, "Chapter 4: Type Errors", "type-errors", 4500, 3,
             datetime(2026, 1, 15, tzinfo=timezone.utc),
             "<p>The type system of reality, Evelyn discovered, was more forgiving than anyone expected. You could cast a photon into a thought, a memory into a stone.</p><p>The compiler of the universe didn't throw errors. It threw earthquakes.</p>"),
            (vol2_id, work1_id, "Chapter 5: The Stack Overflow", "the-stack-overflow", 5800, 4,
             datetime(2026, 2, 1, tzinfo=timezone.utc),
             "<p>When the stack overflowed, it wasn't just the program that crashed. It was the boundary between what was real and what was computed.</p><p>Evelyn stood at the edge of that boundary, staring into an abyss that stared back with the patience of a machine waiting for input.</p>"),
        ]
        for vol_id, wid, title, slug, wc, order, pub_at, content in chapters:
            db.add(Chapter(
                id=str(uuid4()), volume_id=vol_id, work_id=wid, title=title, slug=slug,
                word_count=wc, sort_order=order, status="published", published_at=pub_at,
                content_html=content, content={"type": "doc", "content": content},
            ))

        await db.commit()
        print(f"[OK] Seeded: {len(users)} users, {len(tag_objs)} tags, {len(works)} works, 2 volumes, 5 chapters")


async def main():
    await init_db()
    await seed_data()
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
