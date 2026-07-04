import logging
import base64
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.messages import HumanMessage
from backend.core.config import settings

logger = logging.getLogger(__name__)

async def analyze_screenshot(image_bytes: bytes) -> str:
    """Analyzes a screenshot using NVIDIA Vision model to detect fraud patterns."""
    if not settings.NVIDIA_API_KEY or settings.NVIDIA_API_KEY == "your-nvidia-api-key-here":
        logger.warning("No NVIDIA API key for vision. Returning mock analysis.")
        return "Mock Vision Analysis: Detected suspicious request for urgent payment in screenshot."
        
    try:
        # Initialize the vision model dynamically from config
        vision_model = ChatNVIDIA(model=settings.NVIDIA_VISION_MODEL)
        
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        
        prompt = "You are a fraud detection expert. Analyze this screenshot. Is this a scam or phishing attempt? Detail the suspicious elements (e.g. urgent language, strange URLs, request for money)."
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        )
        
        response = vision_model.invoke([message])
        return response.content
        
    except Exception as e:
        logger.error(f"Error in vision analysis: {e}")
        return f"Error analyzing screenshot: {str(e)}"
