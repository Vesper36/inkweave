from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    display_name: Mapped[str | None] = mapped_column(String(100))
    avatar_url: Mapped[str | None] = mapped_column(String(512))
    bio: Mapped[str | None] = mapped_column(Text)
    role: Mapped[str] = mapped_column(String(20), default="author")  # author, editor, moderator, admin
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    works = relationship("Work", back_populates="author", lazy="selectin")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, lazy="selectin")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("users.id"), unique=True, index=True)
    theme: Mapped[str] = mapped_column(String(50), default="light")
    font_size: Mapped[int] = mapped_column(default=16)
    font_family: Mapped[str] = mapped_column(String(100), default="system-ui")
    line_height: Mapped[float] = mapped_column(default=1.75)
    reading_progress: Mapped[str | None] = mapped_column(Text)  # JSON: {work_id: chapter_id, ...}

    user = relationship("User", back_populates="preferences")
