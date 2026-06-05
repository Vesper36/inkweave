from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: str | None = None


class UserUpdate(BaseModel):
    display_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    display_name: str | None
    avatar_url: str | None
    bio: str | None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserPreferenceUpdate(BaseModel):
    theme: str | None = None
    font_size: int | None = None
    font_family: str | None = None
    line_height: float | None = None


class UserPreferenceResponse(BaseModel):
    theme: str
    font_size: int
    font_family: str
    line_height: float
    reading_progress: str | None

    class Config:
        from_attributes = True
