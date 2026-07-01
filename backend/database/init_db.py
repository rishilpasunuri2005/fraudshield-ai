import logging
from backend.models import Base
from backend.database.session import engine

logger = logging.getLogger(__name__)

async def init_db() -> None:
    """Creates all database tables in PostgreSQL if they do not exist."""
    logger.info("Initializing relational database schema...")
    try:
        async with engine.begin() as conn:
            # Create all tables defined in models
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Relational database schema initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database schema: {e}")
        raise
