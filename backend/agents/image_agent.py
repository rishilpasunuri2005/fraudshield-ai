import logging
from backend.services.ocr import extract_text_from_image
from backend.agents.citizen_agent import analyze_text
from backend.schemas.analyze import AgentPrediction
from backend.services.vision import analyze_screenshot as vision_analyze

logger = logging.getLogger(__name__)

async def analyze_screenshot(image_path: str) -> AgentPrediction:
    """Extracts text from the screenshot and analyzes it using the Vision model."""
    logger.info(f"Agent 3 (Screenshot Analyzer) starting analysis on {image_path}...")
    
    # 1. Read image bytes
    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()
    except Exception as e:
        logger.error(f"Failed to read image {image_path}: {e}")
        return AgentPrediction(
            risk_score=0.0,
            confidence=0.0,
            reasoning="Failed to process image.",
            recommendation="Please try uploading again.",
            evidence={},
            category="Error"
        )

    # 2. Extract text using OCR service (for redundancy/context)
    extracted_text = extract_text_from_image(image_path)
    logger.info(f"OCR Extracted Text: '{extracted_text}'")
    
    if not extracted_text.strip():
        return AgentPrediction(
            risk_score=10.0,
            confidence=0.90,
            reasoning="OCR text extraction found no readable text inside the screenshot image.",
            recommendation="Confirm that the image is a clear screenshot of a message, chat, or bank screen and try again.",
            evidence={"extracted_text": ""},
            category="Legitimate"
        )
        
    # 3. Analyze using text logic (baseline)
    prediction = await analyze_text(extracted_text)
    
    # 4. Enhance with deep Vision model analysis
    try:
        vision_reasoning = await vision_analyze(image_bytes)
        prediction.reasoning = f"{prediction.reasoning}\n\nVision Model Deep Analysis:\n{vision_reasoning}"
    except Exception as e:
        logger.warning(f"Vision model analysis failed: {e}")
    
    # Enrich evidence
    enriched_evidence = dict(prediction.evidence)
    enriched_evidence["extracted_text"] = extracted_text
    
    prediction.evidence = enriched_evidence
    
    logger.info(f"Screenshot analysis complete. Category: {prediction.category}, Risk: {prediction.risk_score}")
    return prediction
