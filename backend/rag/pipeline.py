from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from backend.rag.retriever import get_retriever, get_vectorstore
from backend.rag.prompt_builder import build_rag_prompt
from backend.rag.generator import get_llm
from backend.rag.loader import load_documents
from backend.rag.chunker import chunk_documents
import logging

logger = logging.getLogger(__name__)

def ingest_documents(directory_path: str, collection_name: str = "fraud_knowledge"):
    """Loads, chunks, and ingests documents into the vector store."""
    logger.info(f"Starting ingestion from {directory_path} into {collection_name}")
    documents = load_documents(directory_path)
    if not documents:
        logger.warning("No documents found to ingest.")
        return 0
        
    chunks = chunk_documents(documents)
    logger.info(f"Created {len(chunks)} chunks. Adding to vector store...")
    
    vectorstore = get_vectorstore(collection_name)
    # Add documents to Chroma
    vectorstore.add_documents(chunks)
    logger.info("Ingestion complete.")
    return len(chunks)

def query_rag(question: str, collection_name: str = "fraud_knowledge") -> str:
    """End-to-end RAG query."""
    retriever = get_retriever(collection_name)
    prompt = build_rag_prompt()
    llm = get_llm()
    
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
        
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    logger.info(f"Running RAG query for: {question}")
    return rag_chain.invoke(question)
