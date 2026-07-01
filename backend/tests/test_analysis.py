import io
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_text_analysis(client: AsyncClient):
    # Test suspected digital arrest text
    payload = {
        "text": "This is police calling. You are under digital arrest. Transfer 50000 rupees to verify Aadhaar."
    }
    response = await client.post("/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "confidence" in data
    assert data["category"] == "Digital Arrest"
    assert data["risk_score"] > 80

    # Test suspected legitimate text
    payload_safe = {
        "text": "Hey are we still meeting for lunch today at 1pm?"
    }
    response_safe = await client.post("/analyze/text", json=payload_safe)
    assert response_safe.status_code == 200
    data_safe = response_safe.json()
    assert data_safe["category"] == "Legitimate"
    assert data_safe["risk_score"] < 25

@pytest.mark.asyncio
async def test_url_analysis(client: AsyncClient):
    payload = {
        "url": "http://secure-sbi-login.net/update-details"
    }
    response = await client.post("/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "Bank Fraud"
    assert data["risk_score"] > 70

@pytest.mark.asyncio
async def test_image_analysis(client: AsyncClient):
    # Create virtual png file buffer
    file_content = b"fake-png-bytes"
    file_buffer = io.BytesIO(file_content)
    
    # Use sbi_phishing_sms in name to trigger demo text
    files = {"file": ("sbi_phishing_sms.png", file_buffer, "image/png")}
    response = await client.post("/analyze/image", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "Bank Fraud"
    assert "sbi-login" in data["evidence"]["extracted_text"]

@pytest.mark.asyncio
async def test_audio_analysis(client: AsyncClient):
    # Create virtual mp3 file buffer (must be > 100 bytes to satisfy VAD check)
    file_content = b"fake-mp3-bytes-to-satisfy-vad-check-which-needs-a-file-size-greater-than-one-hundred-bytes-in-tests" * 5
    file_buffer = io.BytesIO(file_content)
    
    # Use digital_arrest in name to trigger demo transcript
    files = {"file": ("digital_arrest.mp3", file_buffer, "audio/mp3")}
    response = await client.post("/analyze/audio", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "Digital Arrest"
    assert "digital arrest" in data["evidence"]["transcript"]
