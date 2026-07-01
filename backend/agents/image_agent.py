import logging
from backend.services.ocr import extract_text_from_image
from backend.agents.citizen_agent import analyze_text
from backend.schemas.analyze import AgentPrediction

logger = logging.getLogger(__name__)

async def analyze_screenshot(image_path: str) -> AgentPrediction:
    """Extracts text from the screenshot and analyzes it for fraud patterns."""
    logger.info(f"Agent 3 (Screenshot Analyzer) starting analysis on {image_path}...")
    
    # 1. Extract text using OCR service
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
        
    # 2. Analyze the extracted text using Agent 1's logic
    prediction = await analyze_text(extracted_text)
    
    # Enrich evidence
    enriched_evidence = dict(prediction.evidence)
    enriched_evidence["extracted_text"] = extracted_text
    
    prediction.evidence = enriched_evidence
    
    logger.info(f"Screenshot analysis complete. Category: {prediction.category}, Risk: {prediction.risk_score}")
    return prediction
