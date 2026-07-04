import os
import logging
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
import json

logger = logging.getLogger(__name__)

def load_documents(directory_path: str) -> List[Document]:
    """Loads all supported documents from a directory."""
    documents = []
    
    if not os.path.exists(directory_path):
        logger.warning(f"Directory {directory_path} does not exist.")
        return documents
        
    for root, _, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                if file.endswith(".pdf"):
                    loader = PyPDFLoader(file_path)
                    documents.extend(loader.load())
                elif file.endswith(".txt"):
                    loader = TextLoader(file_path, encoding='utf-8')
                    documents.extend(loader.load())
                elif file.endswith(".csv"):
                    loader = CSVLoader(file_path)
                    documents.extend(loader.load())
                elif file.endswith(".json"):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        # Basic JSON loading assumption: it's a list of dicts
                        if isinstance(data, list):
                            for item in data:
                                text_content = json.dumps(item)
                                documents.append(Document(page_content=text_content, metadata={"source": file_path}))
                else:
                    logger.info(f"Skipping unsupported file type: {file_path}")
            except Exception as e:
                logger.error(f"Error loading {file_path}: {e}")
                
    logger.info(f"Loaded {len(documents)} documents from {directory_path}")
    return documents
