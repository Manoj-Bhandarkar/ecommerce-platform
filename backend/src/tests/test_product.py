from decimal import Decimal
import pytest
from src.models.product import Product

try:
    from src.core.redis import redis_client
except ImportError:
    redis_client = None


@pytest.fixture(autouse=True)
async def setup_mock_products(db_session):
    product1 = Product(
        id=721,
        title="Oversized Streetwear Hoodie Vol 11",
        slug="oversized-streetwear-hoodie-vol-11",
        sku="SKU-HOODIE-11",
        price=Decimal("11720.00"),
        stock_quantity=10,
        is_active=True
    )
    product2 = Product(
        id=722,
        title="Blue Denim Jeans",
        slug="blue-denim-jeans",
        sku="SKU-JEANS-01",
        price=Decimal("1500.00"),
        stock_quantity=20,
        is_active=True
    )
    db_session.add_all([product1, product2])
    await db_session.flush()
    await db_session.commit()


@pytest.fixture(autouse=True)
async def clear_redis_pool():
    yield
    if redis_client is not None:
        try:
            await redis_client.aclose()
        except Exception:
            pass


@pytest.mark.asyncio
async def test_get_products(client):
    response = await client.get("/api/v1/product")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_search_products(client):
    response = await client.get("/api/v1/product/search/?title=jeans")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_product_invalid_slug(client):
    response = await client.get("/api/v1/product/invalid-product-slug")
    assert response.status_code in [404, 400]


@pytest.mark.asyncio
async def test_get_product_by_slug(client):
    response = await client.get("/api/v1/product/oversized-streetwear-hoodie-vol-11")
    assert response.status_code == 200
    assert response.json()["slug"] == "oversized-streetwear-hoodie-vol-11"
