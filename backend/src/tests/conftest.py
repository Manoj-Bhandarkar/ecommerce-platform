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
