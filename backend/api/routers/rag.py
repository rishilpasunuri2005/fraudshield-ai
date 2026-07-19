from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from backend.rag.pipeline import query_rag, ingest_documents
import logging 

logger = logging.getLogger(__name__)

router = APIRouter()

class RAGQuery(BaseModel):
    question: str

class RAGResponse(BaseModel):
    answer: str

@router.post("/explain", response_model=RAGResponse)
async def explain_fraud(query: RAGQuery):
    """Provides a detailed explanation using RAG based on fraud rules and case notes."""
    try:
        answer = query_rag(query.question)
        return RAGResponse(answer=answer)
    except Exception as e:
        logger.error(f"RAG query error: {e}")
        raise HTTPException(status_code=500, detail="Error generating explanation.")

@router.post("/ingest")
async def ingest_data(background_tasks: BackgroundTasks):
    """Triggers ingestion of documents from the data/raw directory into the Vector DB."""
    def run_ingestion():
        try:
            ingest_documents("data/raw")
        except Exception as e:
            logger.error(f"Ingestion failed: {e}")

    background_tasks.add_task(run_ingestion)
    return {"status": "Ingestion started in background."}
