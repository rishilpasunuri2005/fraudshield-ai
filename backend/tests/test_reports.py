import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_and_list_reports(client: AsyncClient):
    # 1. Create a user to get authentication context
    signup_payload = {
        "email": "reporter@example.com",
        "password": "Password123",
        "full_name": "John Doe",
        "role": "citizen"
    }
    signup_response = await client.post("/auth/signup", json=signup_payload)
    assert signup_response.status_code == 200
    token = signup_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. File a complaint using token auth
    report_payload = {
        "title": "Suspected extortion call",
        "description": "Scammer threatened me over Skype video call, claiming narcotic blocks on Aadhaar.",
        "scam_category": "Digital Arrest",
        "reporter_phone": "+919999888877",
        "suspect_phone": "+919876543210",
        "suspect_upi": "cbi-agent@ybl",
        "suspect_device_id": "IMEI-869234059128340",
        "amount_lost": 25000.00,
        "sender_bank": "HDFC Bank",
        "district": "Mumbai Cyber Cell"
      }
    
    response = await client.post("/report", json=report_payload, headers=headers)
    assert response.status_code == 201
    report_data = response.json()
    assert report_data["title"] == "Suspected extortion call"
    assert report_data["status"] == "pending"
    assert report_data["suspect_phone"] == "+919876543210"

    # 3. List reports (no auth required for citizen views)
    list_response = await client.get("/report")
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert len(list_data) >= 1
    # Check if our submitted report is in the feed list
    titles = [item["title"] for item in list_data]
    assert "Suspected extortion call" in titles
