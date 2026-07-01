import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_signup_and_login(client: AsyncClient):
    # 1. Test Signup
    signup_payload = {
        "email": "test-citizen@example.com",
        "password": "Password123",
        "full_name": "Test Citizen",
        "role": "citizen"
    }
    
    response = await client.post("/auth/signup", json=signup_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "citizen"
    assert data["email"] == "test-citizen@example.com"
    
    # 2. Test Signup Duplicate Rejection
    dup_response = await client.post("/auth/signup", json=signup_payload)
    assert dup_response.status_code == 400
    assert "already exists" in dup_response.json()["detail"]

    # 3. Test Successful Login (Form data URL-encoded)
    login_payload = {
        "username": "test-citizen@example.com",
        "password": "Password123"
    }
    login_response = await client.post("/auth/login", data=login_payload)
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["role"] == "citizen"

    # 4. Test Login Incorrect Password
    bad_login_payload = {
        "username": "test-citizen@example.com",
        "password": "WrongPassword"
    }
    bad_login_response = await client.post("/auth/login", data=bad_login_payload)
    assert bad_login_response.status_code == 401
