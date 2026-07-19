import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from backend.core.config import settings

logger = logging.getLogger(__name__)

def _create_engine():
    """Create the async engine, falling back to SQLite if PostgreSQL is unavailable."""
    db_url = settings.get_database_url

    if settings.ENV == "production" or not settings.SQLITE_FALLBACK:
        logger.info(f"Using configured database: {db_url[:30]}...")
        return create_async_engine(
            db_url, echo=False, pool_size=10, max_overflow=20,
            pool_recycle=1800, pool_pre_ping=True
        )

    # pool_pre_ping handles connectivity checks — no manual socket probe needed
    try:
        engine = create_async_engine(
            db_url, echo=False, pool_size=10, max_overflow=20,
            pool_recycle=1800, pool_pre_ping=True
        )
        logger.info("PostgreSQL engine created with pool_pre_ping fallback.")
        return engine
    except Exception as e:
        logger.warning(f"PostgreSQL unavailable ({e}). Falling back to SQLite.")
        return create_async_engine(
            settings.SQLITE_URL, echo=False,
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
