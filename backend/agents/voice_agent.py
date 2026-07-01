import logging
from backend.services.speech import detect_voice_activity, transcribe_audio_file
from backend.agents.citizen_agent import analyze_text
from backend.schemas.analyze import AgentPrediction

logger = logging.getLogger(__name__)

async def analyze_voice_scam(audio_file_path: str) -> AgentPrediction:
    """Orchestrates audio checks, transcription, and scam intelligence extraction."""
    logger.info(f"Agent 2 (Voice Scam Detector) starting analysis on {audio_file_path}...")
    
    # 1. Run VAD check
    has_voice = await detect_voice_activity(audio_file_path)
    if not has_voice:
        logger.warning("No speech detected in audio file by VAD checker.")
        return AgentPrediction(
            risk_score=0.0,
            confidence=0.95,
            reasoning="Voice Activity Detection (VAD) found no significant human speech in the provided audio file.",
            recommendation="The audio file is silent or contains only static. Please provide a clear recording.",
            evidence={"vad_status": "no_speech_detected"},
            category="Legitimate"
        )
        
    # 2. Transcribe audio with Whisper
    transcript = await transcribe_audio_file(audio_file_path)
    logger.info(f"Transcript acquired: '{transcript}'")
    
    # 3. Analyze the transcript text for scams
    prediction = await analyze_text(transcript)
    
    # Enrich evidence with transcript details
    enriched_evidence = dict(prediction.evidence)
    enriched_evidence["transcript"] = transcript
    enriched_evidence["vad_status"] = "speech_detected"
    
    prediction.evidence = enriched_evidence
    
    logger.info(f"Voice scam analysis complete. Category: {prediction.category}, Risk: {prediction.risk_score}")
    return prediction
