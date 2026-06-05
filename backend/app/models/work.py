from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Work(Base):
    __tablename__ = "works"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    author_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    cover_url: Mapped[str | None] = mapped_column(String(512))
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft, reviewing, published, archived
    word_count: Mapped[int] = mapped_column(Integer, default=0)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    favorite_count: Mapped[int] = mapped_column(Integer, default=0)
    content_warning: Mapped[str | None] = mapped_column(String(100))
    rating: Mapped[str] = mapped_column(String(20), default="general")  # general, teen, mature
    language: Mapped[str] = mapped_column(String(10), default="zh-CN")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    author = relationship("User", back_populates="works", lazy="selectin")
    volumes = relationship("Volume", back_populates="work", order_by="Volume.sort_order", lazy="selectin")
    tags = relationship("Tag", secondary="work_tags", back_populates="works", lazy="selectin")


class Volume(Base):
    __tablename__ = "volumes"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    work_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("works.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    work = relationship("Work", back_populates="volumes")
    chapters = relationship("Chapter", back_populates="volume", order_by="Chapter.sort_order", lazy="selectin")


class Chapter(Base):
    __tablename__ = "chapters"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    volume_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("volumes.id"), index=True)
    work_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("works.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255))
    content: Mapped[dict | None] = mapped_column(JSONB)  # MDX AST + metadata
    content_html: Mapped[str | None] = mapped_column(Text)  # Pre-rendered HTML
    status: Mapped[str] = mapped_column(String(20), default="draft")
    word_count: Mapped[int] = mapped_column(Integer, default=0)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    version: Mapped[int] = mapped_column(Integer, default=1)
    author_note: Mapped[str | None] = mapped_column(Text)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    volume = relationship("Volume", back_populates="chapters")
