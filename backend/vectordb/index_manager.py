from backend.vectordb.client import get_chroma_client
import logging

logger = logging.getLogger(__name__)

def get_or_create_collection(collection_name: str = "fraud_knowledge"):
    client = get_chroma_client()
    try:
        collection = client.get_or_create_collection(name=collection_name)
        return collection
    except Exception as e:
        logger.error(f"Error getting/creating collection {collection_name}: {e}")
        raise
