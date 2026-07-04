from langchain_nvidia_ai_endpoints import ChatNVIDIA
from backend.core.config import settings
import logging

logger = logging.getLogger(__name__)

def get_llm():
    """Returns the LLM for generation."""
    if settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY != "your-nvidia-api-key-here":
        try:
            logger.info(f"Using NVIDIA LLM: {settings.NVIDIA_MODEL}")
            return ChatNVIDIA(model=settings.NVIDIA_MODEL)
        except Exception as e:
            logger.error(f"Failed to initialize NVIDIA LLM: {e}")
            raise
    
    # If no key, maybe use a local mock or throw error
    logger.warning("No NVIDIA API key found. RAG generation might fail if no fallback LLM is provided.")
    raise ValueError("NVIDIA API Key is required for RAG text generation.")
