import pytest


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "wrong@test.com", "password": "wrongpassword"},
    )
    print(response.json())
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_success(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "manoj@gmail.com", "password": "Manoj@5424"},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies


@pytest.mark.asyncio
async def test_refresh_token_missing(client):
    response = await client.post("/api/v1/auth/refresh")
    assert response.status_code == 401
    assert response.json()["detail"] == "Missing refresh token"


@pytest.mark.asyncio
async def test_refresh_token_invalid(client):
    client.cookies.set("refresh_token", "Invalide_token")
    response = await client.post("/api/v1/auth/refresh")
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid refresh token"


@pytest.mark.asyncio
async def test_refresh_token_success(client):
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "manoj@gmail.com", "password": "Manoj@5424"},
    )
    print(login_response.cookies)
    refresh_token = login_response.cookies.get("refresh_token")

    client.cookies.set("refresh_token", refresh_token)
    assert login_response.status_code == 200
    response = await client.post("/api/v1/auth/refresh")
    print(response.json())
    assert response.status_code == 200
    assert response.json()["message"] == "Token refresh successful"


@pytest.mark.asyncio
async def test_send_password_reset_email(client):
    response = await client.post(
        "/api/v1/auth/send-password-reset-email", json={"email": "manoj@gmail.com"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Password reset link sent"
