import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from backend.core.config import settings

logger = logging.getLogger(__name__)

def _create_engine():
    """Create the async engine, falling back to SQLite if PostgreSQL is unavailable."""
    db_url = settings.get_database_url
    
    # In production or Docker, always use the configured PostgreSQL
    if settings.ENV == "production" or not settings.SQLITE_FALLBACK:
        logger.info(f"Using configured database: {db_url[:30]}...")
        return create_async_engine(
            db_url,
            echo=False,
            pool_size=10,
            max_overflow=20,
            pool_recycle=1800,
            pool_pre_ping=True
        )
    
    # In development, try PostgreSQL first, fall back to SQLite
    try:
        import asyncpg  # noqa: F401 — just check availability
        # Quick synchronous socket test to see if postgres is listening
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(("localhost", 5432))
        sock.close()
        if result == 0:
            logger.info("PostgreSQL detected on localhost:5432, using asyncpg engine.")
            return create_async_engine(
                db_url,
                echo=False,
                pool_size=10,
                max_overflow=20,
                pool_recycle=1800,
                pool_pre_ping=True
            )
        else:
            raise ConnectionError("PostgreSQL not listening on port 5432")
    except Exception as e:
        logger.warning(f"PostgreSQL unavailable ({e}). Falling back to SQLite at: {settings.SQLITE_URL}")
        return create_async_engine(
            settings.SQLITE_URL,
            echo=False,
            # SQLite doesn't support pool_size / pool_pre_ping the same way
            connect_args={"check_same_thread": False}
        )

# Create async engine with automatic fallback
engine = _create_engine()

# Create session maker for transaction scoped sessions
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for providing database sessions to FastAPI endpoints."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
