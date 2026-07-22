import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from prometheus_fastapi_instrumentator import Instrumentator

from backend.core.config import settings
from backend.core.logging import setup_logging
from backend.database.init_db import init_db
from backend.api.routers import auth, analyze, reports, dashboard, rag
from backend.utils.rate_limiter import limiter

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FraudShield AI API",
    description="Digital Public Safety Intelligence Platform API",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event handler
@app.on_event("startup")
async def on_startup():
    logger.info("Starting up FraudShield AI Application...")
    await init_db()
    logger.info("Database schema check completed.")
    # Auto-seed demo users if DB is empty
    try:
        from sqlalchemy.future import select
        from backend.database.session import async_session_maker
        from backend.models.user import User
        from backend.core.security import get_password_hash

        async with async_session_maker() as session:
            result = await session.execute(select(User).limit(1))
            if not result.scalars().first():
                logger.info("No users found — seeding demo accounts...")
                users = [
                    User(email="admin@fraudshield.ai", hashed_password=get_password_hash("AdminPassword123"), full_name="System Administrator", role="admin", is_active=True),
                    User(email="officer@fraudshield.ai", hashed_password=get_password_hash("PolicePassword123"), full_name="Inspector Amit Sharma", role="police", district="Mumbai Cyber Cell", is_active=True),
                    User(email="citizen@fraudshield.ai", hashed_password=get_password_hash("CitizenPassword123"), full_name="Rahul Verma", role="citizen", is_active=True),
                ]
                session.add_all(users)
                await session.commit()
                logger.info("Seeded 3 demo users.")
    except Exception as e:
        logger.warning(f"Auto-seed failed (non-fatal): {e}")

# Expose a simple health check endpoint
@app.get("/health", tags=["System"])
async def health_check():
    """Service health status check."""
    return {"status": "healthy", "environment": settings.ENV}

# Instrument application with Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Mount API Routers
app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(reports.router)
app.include_router(dashboard.router)
app.include_router(rag.router, prefix="/rag", tags=["RAG"])

logger.info("Routers mounted successfully. API initialization complete.")
