from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AgentPrediction(BaseModel):
    """Enforced structured JSON response shape for all FraudShield AI agent outputs."""
    risk_score: float = Field(
        ..., 
        ge=0.0, 
        le=100.0, 
        description="Calculated fraud risk score from 0 (safe) to 100 (extreme scam risk)."
    )
    confidence: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="Model confidence rating for the analysis between 0.0 and 1.0."
    )
    reasoning: str = Field(
        ..., 
        description="Detailed explanation/explanation of indicators found in the input data."
    )
    recommendation: str = Field(
        ..., 
        description="Actionable suggested actions and safety steps for the citizen or law enforcement."
    )
    evidence: Dict[str, Any] = Field(
        ..., 
        description="Key evidence extracted (e.g., threat keywords, suspect entities, flagged bank routes, domains)."
    )
    category: str = Field(
        ..., 
        description="Categorized fraud type (e.g., 'Digital Arrest', 'Bank Fraud', 'UPI Fraud', 'OTP Scam', 'Lottery Scam', 'Legitimate')."
    )

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Message text or transcription to analyze.")

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., description="Link URL to analyze.")

class ReportCreateRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10)
    scam_category: str = Field(..., description="Detected or self-reported scam type.")
    reporter_phone: Optional[str] = None
    reporter_email: Optional[str] = None
    suspect_phone: Optional[str] = None
    suspect_upi: Optional[str] = None
    suspect_bank_account: Optional[str] = None
    suspect_device_id: Optional[str] = None
    suspect_ip: Optional[str] = None
    suspect_email: Optional[str] = None
    amount_lost: Optional[float] = 0.0
    sender_bank: Optional[str] = None
    receiver_bank: Optional[str] = None
    district: Optional[str] = None
