import os
import chromadb
from chromadb.config import Settings as ChromaSettings
from backend.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Singleton ChromaDB client
_chroma_client = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        logger.info(f"Initializing ChromaDB client at {settings.CHROMA_PERSIST_DIRECTORY}")
        os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
    return _chroma_client
