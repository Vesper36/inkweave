from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://inkweave:inkweave_dev_2024@localhost:5432/inkweave"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Meilisearch
    meili_url: str = "http://localhost:7700"
    meili_master_key: str = "inkweave_meili_dev_key"

    # Auth
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # CORS
    cors_origins: str = "http://localhost:3000"

    # App
    debug: bool = True
    app_name: str = "InkWeave"
    app_version: str = "0.1.0"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
