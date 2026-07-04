from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from backend.core.config import settings
import logging

logger = logging.getLogger(__name__)

def get_embedder():
    """Returns the embedding model."""
    if settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY != "your-nvidia-api-key-here":
        try:
            logger.info("Using NVIDIA Embeddings")
            return NVIDIAEmbeddings(model="NV-Embed-QA")
        except Exception as e:
            logger.warning(f"Failed to initialize NVIDIA Embeddings: {e}. Falling back to local embeddings.")
    
    logger.info("Using local HuggingFace embeddings (all-MiniLM-L6-v2)")
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
