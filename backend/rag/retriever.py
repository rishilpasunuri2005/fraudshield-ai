from langchain_community.vectorstores import Chroma
from backend.rag.embedder import get_embedder
from backend.vectordb.client import get_chroma_client
from backend.core.config import settings

def get_vectorstore(collection_name: str = "fraud_knowledge"):
    """Returns the Chroma vector store initialized with our embedding function."""
    embedder = get_embedder()
    client = get_chroma_client()
    
    vectorstore = Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embedder
    )
    return vectorstore

def get_retriever(collection_name: str = "fraud_knowledge", k: int = 3):
    """Returns a retriever interface for the vector store."""
    vectorstore = get_vectorstore(collection_name)
    return vectorstore.as_retriever(search_kwargs={"k": k})
