import os
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

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/fraudshield"
    REDIS_URL: str = "redis://localhost:6379/0"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password123"

    JWT_SECRET: str = "44efee2d37c8ee5e2df44f128c11ba716dfefc2a688bc89efc464c8d10b77dbd"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    NVIDIA_API_KEY: str = ""
    NVIDIA_MODEL: str = "meta/llama-3.3-70b-instruct"
    NVIDIA_VISION_MODEL: str = "meta/llama-3.2-90b-vision-instruct"

    CHROMA_PERSIST_DIRECTORY: str = "./data/embeddings"
    LOG_LEVEL: str = "INFO"

    SQLITE_FALLBACK: bool = True
    SQLITE_URL: str = "sqlite+aiosqlite:///./fraudshield_dev.db"

    @property
    def get_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    @property
    def get_redis_url(self) -> str:
        return self.REDIS_URL

    @property
    def get_neo4j_uri(self) -> str:
        return self.NEO4J_URI

settings = Settings()
