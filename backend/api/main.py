import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from backend.core.config import settings
from backend.core.logging import setup_logging
from backend.database.init_db import init_db
from backend.api.routers import auth, analyze, reports, dashboard, rag
# Setup logging config
setup_logging()
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="FraudShield AI API",
    description="Digital Public Safety Intelligence Platform API",
    version="1.0.0"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event handler
@app.on_event("startup")
async def on_startup():
    logger.info("Starting up FraudShield AI Application...")
    # Initialize SQLAlchemy database schema
    await init_db()
    logger.info("Database schema check completed.")

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
