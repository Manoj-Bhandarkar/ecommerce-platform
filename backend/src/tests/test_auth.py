import pytest
from sqlalchemy import select
from sqlalchemy import delete
from src.models.user import User
from src.core.security import hash_password

@pytest.fixture(autouse=True)
async def setup_auth_user(db_session):
    await db_session.execute(delete(User).where(User.email == "manoj@gmail.com"))
    await db_session.flush()
    secure_pass = hash_password("Manoj@5424")
    user = User(
        email="manoj@gmail.com",
        hashed_password=secure_pass, 
        is_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.begin()
    return user

@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "wrong@test.com", "password": "wrongpassword"},
    )
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
    refresh_token = login_response.cookies.get("refresh_token")

    client.cookies.set("refresh_token", refresh_token)
    assert login_response.status_code == 200
    response = await client.post("/api/v1/auth/refresh")
    assert response.status_code == 200
    assert response.json()["message"] == "Token refresh successful"


@pytest.mark.asyncio
async def test_send_password_reset_email(client):
    response = await client.post(
        "/api/v1/auth/send-password-reset-email", json={"email": "manoj@gmail.com"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Password reset link sent"
