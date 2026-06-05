from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    color: Mapped[str | None] = mapped_column(String(7))  # hex color
    category: Mapped[str | None] = mapped_column(String(50))  # fandom, genre, trope, etc.
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    works = relationship("Work", secondary="work_tags", back_populates="tags", lazy="selectin")


# Association table
from sqlalchemy import Column, Table, ForeignKey

WorkTag = Table(
    "work_tags",
    Base.metadata,
    Column("work_id", UUID(as_uuid=False), ForeignKey("works.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", UUID(as_uuid=False), ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)
