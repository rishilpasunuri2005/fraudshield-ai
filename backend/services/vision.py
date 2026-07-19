import logging
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from backend.core.config import settings

logger = logging.getLogger(__name__)

async def analyze_screenshot(image_bytes: bytes) -> str:
    """Analyzes a screenshot using NVIDIA Vision model to detect fraud patterns."""
    if not settings.NVIDIA_API_KEY or settings.NVIDIA_API_KEY == "your-nvidia-api-key-here":
        logger.warning("No NVIDIA API key for vision. Returning mock analysis.")
        return "Mock Vision Analysis: Detected suspicious request for urgent payment in screenshot."

    try:
        llm = ChatNVIDIA(
            model=settings.NVIDIA_VISION_MODEL,
            api_key=settings.NVIDIA_API_KEY,
            temperature=0.0
        )
        import base64
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        response = llm.invoke([{
            "role": "user",
            "content": [
                {"type": "text", "text": "You are a fraud detection expert. Analyze this screenshot for scam or phishing indicators. Detail suspicious elements."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        }])
        return response.content
    except Exception as e:
        logger.error(f"Error in vision analysis: {e}")
        return f"Error analyzing screenshot: {str(e)}"
