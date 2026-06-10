import sys
from pathlib import Path
import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
async def auth_client(client):
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "manoj@gmail.com", "password": "Manoj@5424"},
    )
    access_token = login_response.cookies.get("access_token")
    client.cookies.set("access_token", access_token)
    return client
