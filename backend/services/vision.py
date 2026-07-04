import logging
import base64
import httpx
from backend.core.config import settings

logger = logging.getLogger(__name__)

async def analyze_screenshot(image_bytes: bytes) -> str:
    """Analyzes a screenshot using NVIDIA Vision model to detect fraud patterns."""
    if not settings.NVIDIA_API_KEY or settings.NVIDIA_API_KEY == "your-nvidia-api-key-here":
        logger.warning("No NVIDIA API key for vision. Returning mock analysis.")
        return "Mock Vision Analysis: Detected suspicious request for urgent payment in screenshot."
        
    try:
        model_name = getattr(settings, "NVIDIA_VISION_MODEL", "meta/llama-3.2-90b-vision-instruct")
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        
        prompt = "You are a fraud detection expert. Analyze this screenshot. Is this a scam or phishing attempt? Detail the suspicious elements (e.g. urgent language, strange URLs, request for money)."
        
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
            "Accept": "application/json"
        }
        
        payload = {
            "model": model_name,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
                    ]
                }
            ],
            "max_tokens": 1024
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://integrate.api.nvidia.com/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
            
    except Exception as e:
        logger.error(f"Error in vision analysis: {e}")
        return f"Error analyzing screenshot: {str(e)}"
