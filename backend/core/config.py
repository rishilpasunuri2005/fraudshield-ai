import os
from typing import List, Optional
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    ENV: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database URLs
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/fraudshield"
    DATABASE_URL_DOCKER: str = "postgresql+asyncpg://postgres:postgres@db:5432/fraudshield"

    # Redis URLs
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_URL_DOCKER: str = "redis://redis:6379/0"

    # Neo4j Graph URLs
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_URI_DOCKER: str = "bolt://neo4j:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password123"

    # Security & Authentication
    JWT_SECRET: str = "44efee2d37c8ee5e2df44f128c11ba716dfefc2a688bc89efc464c8d10b77dbd"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # AI Configuration
    OPENAI_API_KEY: str = "mock-key-replace-with-real-key"
    OPENAI_MODEL: str = "gpt-4o-2024-08-06"

    # Logging
    LOG_LEVEL: str = "INFO"

    @property
    def get_database_url(self) -> str:
        # If running inside docker container, we'll use docker host
        if os.environ.get("ENV") == "production" or os.path.exists("/.dockerenv"):
            return self.DATABASE_URL_DOCKER
        return self.DATABASE_URL

    @property
    def get_redis_url(self) -> str:
        if os.environ.get("ENV") == "production" or os.path.exists("/.dockerenv"):
            return self.REDIS_URL_DOCKER
        return self.REDIS_URL

    @property
    def get_neo4j_uri(self) -> str:
        if os.environ.get("ENV") == "production" or os.path.exists("/.dockerenv"):
            return self.NEO4J_URI_DOCKER
        return self.NEO4J_URI

settings = Settings()
