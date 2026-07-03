import re
import logging
from typing import Optional
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.prompts import ChatPromptTemplate

from backend.core.config import settings
from backend.schemas.analyze import AgentPrediction

logger = logging.getLogger(__name__)

# Heuristics for rule-based fallback scanner
SCAM_KEYWORDS = {
    "Digital Arrest": [
        r"digital\s+arrest", r"cbi", r"police", r"customs", r"money\s+laundering", 
        r"aadhaar\s+blocked", r"narcotics", r"skype\s+call", r"arrest\s+warrant"
    ],
    "Bank Fraud": [
        r"kyc\s+update", r"pan\s+card", r"netbanking", r"account\s+suspended", 
        r"bank\s+blocked", r"sbi", r"hdfc", r"icici", r"card\s+blocked"
    ],
    "UPI Fraud": [
        r"upi\s+pin", r"pay\s+pin", r"receive\s+money", r"scan\s+qr", 
        r"collect\s+request", r"gpay", r"phonepe"
    ],
    "OTP Scam": [
        r"one\s+time\s+password", r"send\s+otp", r"share\s+otp", r"verification\s+code"
    ],
    "Lottery Scam": [
        r"lottery", r"lucky\s+draw", r"kbc", r"won\s+prize", r"processing\s+fee", r"claim\s+reward"
    ]
}

def scan_text_heuristics(text: str) -> Optional[AgentPrediction]:
    """Scans text for scam signals via regex rules to provide high-fidelity fallback predictions."""
    text_lower = text.lower()
    matched_category = None
    matched_keywords = []
    
    for category, patterns in SCAM_KEYWORDS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                matched_keywords.append(pattern.replace(r"\s+", " "))
                if not matched_category:
                    matched_category = category
                    
    if matched_category:
        risk_score = 75.0 + (len(matched_keywords) * 5.0)
        risk_score = min(risk_score, 99.0)
        
        reasoning = (
            f"Rule-based detection identified key indicators relating to '{matched_category}'. "
            f"Matched indicators: {', '.join(matched_keywords)}."
        )
        
        recommendation = (
            "Do NOT share personal information, PINs, or OTPs. "
            "Do NOT transfer money. Block this number and report immediately."
        )
        
        if matched_category == "Digital Arrest":
            recommendation = (
                "Real government authorities NEVER place citizens under 'digital arrest' via Skype/WhatsApp video. "
                "Hang up immediately, contact local police, and do not pay any money."
            )
            
        return AgentPrediction(
            risk_score=risk_score,
            confidence=0.85,
            reasoning=reasoning,
            recommendation=recommendation,
            evidence={"matched_keywords": matched_keywords},
            category=matched_category
        )
        
    return None

async def analyze_text(text: str) -> AgentPrediction:
    """Analyzes a message text for scam patterns using LLM or local heuristics."""
    logger.info("Agent 1 (Citizen Shield) starting text analysis...")
    
    # Check if we should use fallback heuristics
    is_mock_key = (
        not settings.NVIDIA_API_KEY 
        or settings.NVIDIA_API_KEY.startswith("mock") 
        or "your-nvidia-api-key" in settings.NVIDIA_API_KEY
    )
    if is_mock_key:
        logger.info("Using local heuristic scanner (mock key detected)")
        result = scan_text_heuristics(text)
        if result:
            return result
        # Return standard safe template if no keywords match
        return AgentPrediction(
            risk_score=12.0,
            confidence=0.90,
            reasoning="No scam keywords or patterns detected in the text sample.",
            recommendation="The text appears safe, but stay vigilant and never click untrusted URLs.",
            evidence={"indicators": "none"},
            category="Legitimate"
        )
        
    try:
        llm = ChatNVIDIA(
            model=settings.NVIDIA_MODEL,
            api_key=settings.NVIDIA_API_KEY,
            temperature=0.0
        )
        structured_llm = llm.with_structured_output(AgentPrediction)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", (
                "You are an expert Cyber Crime and Fraud Detection agent. "
                "Analyze the following user input (which could be an SMS, a chat transcript, or email text) "
                "and determine if it is a digital scam or fraud. "
                "Identify categories like 'Digital Arrest', 'Bank Fraud', 'UPI Fraud', 'OTP Scam', or 'Lottery Scam'. "
                "If it is safe, set category to 'Legitimate'. "
                "Always return structured JSON matching the requested schema."
            )),
            ("user", "Analyze this text for fraud markers:\n\n{text}")
        ])
        
        chain = prompt | structured_llm
        response = await chain.ainvoke({"text": text})
        return response
    except Exception as e:
        logger.error(f"LLM analysis failed: {e}. Falling back to rule-based scanner.")
        result = scan_text_heuristics(text)
        if result:
            return result
        return AgentPrediction(
            risk_score=35.0,
            confidence=0.50,
            reasoning="AI analysis encountered an error. Scanned text locally; no immediate scam markers detected.",
            recommendation="Treat with normal caution. Run screenshot or link checks if available.",
            evidence={"error": str(e)},
            category="Legitimate"
        )

async def analyze_url(url: str) -> AgentPrediction:
    """Analyzes a link URL for phishing indicators."""
    logger.info(f"Agent 1 (Citizen Shield) starting URL analysis for {url}...")
    
    # Simple regex for phishing check fallback
    suspicious_domain_regex = r"(sbi-login|secure-bank|win-lottery|verify-pan|pay-upi|kbc-winner)"
    is_suspicious_domain = bool(re.search(suspicious_domain_regex, url.lower()))
    is_ip = bool(re.search(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", url))
    is_http_only = url.lower().startswith("http://")
    
    if is_suspicious_domain or is_ip or is_http_only:
        risk_score = 65.0
        evidence_flags = []
        if is_suspicious_domain:
            risk_score += 25.0
            evidence_flags.append("suspicious_domain_keywords")
        if is_ip:
            risk_score += 15.0
            evidence_flags.append("raw_ip_address_host")
        if is_http_only:
            risk_score += 10.0
            evidence_flags.append("insecure_http_protocol")
            
        risk_score = min(risk_score, 99.0)
        return AgentPrediction(
            risk_score=risk_score,
            confidence=0.90,
            reasoning=f"URL flagged due to high-risk patterns: {', '.join(evidence_flags)}.",
            recommendation="Do NOT open this link. It does not use secure protocol or mimics authentic institutional domains.",
            evidence={"url": url, "flags": evidence_flags},
            category="Bank Fraud"
        )
        
    is_mock_key = (
        not settings.NVIDIA_API_KEY 
        or settings.NVIDIA_API_KEY.startswith("mock") 
        or "your-nvidia-api-key" in settings.NVIDIA_API_KEY
    )
    if is_mock_key:
        return AgentPrediction(
            risk_score=15.0,
            confidence=0.95,
            reasoning="URL matches standard HTTPS protocols and doesn't contain known phishing domains.",
            recommendation="This link looks normal. Confirm that the sender is trustworthy before entering login credentials.",
            evidence={"url": url},
            category="Legitimate"
        )

    try:
        llm = ChatNVIDIA(
            model=settings.NVIDIA_MODEL,
            api_key=settings.NVIDIA_API_KEY,
            temperature=0.0
        )
        structured_llm = llm.with_structured_output(AgentPrediction)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", (
                "You are an expert Phishing and URL Analyst. "
                "Analyze the provided link for scam indicators (e.g., misspelled brand names, IP addresses instead of domains, insecure protocols, high-risk keywords). "
                "Return a structured JSON output defining risk, category, reasoning, and recommendation."
            )),
            ("user", "Analyze this URL for phishing markers: {url}")
        ])
        
        chain = prompt | structured_llm
        response = await chain.ainvoke({"url": url})
        return response
    except Exception as e:
        logger.error(f"LLM URL analysis failed: {e}.")
        return AgentPrediction(
            risk_score=45.0,
            confidence=0.60,
            reasoning="URL inspection fallback activated. The link has been verified against known phishing patterns.",
            recommendation="Verify URL spelling. Institutional links always use official root domains.",
            evidence={"url": url, "fallback": True},
            category="Legitimate"
        )
