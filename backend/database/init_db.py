import logging
import asyncio
from backend.models import Base
from backend.database.session import engine

logger = logging.getLogger(__name__)

async def init_db() -> None:
    """Creates all database tables in PostgreSQL if they do not exist with retries."""
    logger.info("Initializing relational database schema...")
    
    max_retries = 6
    retry_delay = 5  # seconds
    
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.begin() as conn:
                # Create all tables defined in models
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Relational database schema initialized successfully.")
            return
        except Exception as e:
            logger.warning(
                f"Database connection attempt {attempt}/{max_retries} failed: {e}. "
                f"Retrying in {retry_delay}s..."
            )
            if attempt == max_retries:
                logger.error("Max database initialization retries reached. Failing startup.")
                raise
            await asyncio.sleep(retry_delay)
