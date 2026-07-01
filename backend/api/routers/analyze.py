import os
import shutil
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status

from backend.schemas.analyze import AgentPrediction, TextAnalysisRequest, UrlAnalysisRequest
from backend.agents.citizen_agent import analyze_text, analyze_url
from backend.agents.voice_agent import analyze_voice_scam
from backend.agents.image_agent import analyze_screenshot
from backend.utils.rate_limiter import RateLimiter

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analyze", tags=["AI Analysis Services"])

# Define paths for uploaded media files
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/text", response_model=AgentPrediction, dependencies=[Depends(RateLimiter(times=20, seconds=60))])
async def analyze_text_endpoint(payload: TextAnalysisRequest):
    """Analyzes text messages (SMS, WhatsApp transcripts, emails) for scam patterns."""
    try:
        return await analyze_text(payload.text)
    except Exception as e:
        logger.error(f"Text analysis route error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during text analysis: {str(e)}"
        )

@router.post("/url", response_model=AgentPrediction, dependencies=[Depends(RateLimiter(times=20, seconds=60))])
async def analyze_url_endpoint(payload: UrlAnalysisRequest):
    """Analyzes a URL for phishing or fraudulent patterns."""
    try:
        return await analyze_url(payload.url)
    except Exception as e:
        logger.error(f"URL analysis route error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during URL analysis: {str(e)}"
        )

@router.post("/audio", response_model=AgentPrediction, dependencies=[Depends(RateLimiter(times=10, seconds=60))])
async def analyze_audio_endpoint(file: UploadFile = File(...)):
    """Transcribes uploaded audio and analyzes it for fraud patterns (e.g., lottery, UPI PIN requests)."""
    # Verify file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".wav", ".mp3", ".ogg", ".m4a", ".aac"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid audio format. Allowed: .wav, .mp3, .ogg, .m4a, .aac"
        )
        
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    dest_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        # Save file locally
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = await analyze_voice_scam(dest_path)
        return result
    except Exception as e:
        logger.error(f"Audio analysis route error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during audio analysis: {str(e)}"
        )
    finally:
        # Clean up file after analysis if it exists
        if os.path.exists(dest_path):
            try:
                os.remove(dest_path)
            except Exception:
                pass

@router.post("/image", response_model=AgentPrediction, dependencies=[Depends(RateLimiter(times=10, seconds=60))])
async def analyze_image_endpoint(file: UploadFile = File(...)):
    """Performs OCR on an uploaded screenshot and scans it for threat language or phishing indicators."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".webp", ".bmp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Allowed: .png, .jpg, .jpeg, .webp, .bmp"
        )
        
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    dest_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        # Save file locally
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = await analyze_screenshot(dest_path)
        return result
    except Exception as e:
        logger.error(f"Image analysis route error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during screenshot analysis: {str(e)}"
        )
    finally:
        # Clean up file after analysis if it exists
        if os.path.exists(dest_path):
            try:
                os.remove(dest_path)
            except Exception:
                pass
