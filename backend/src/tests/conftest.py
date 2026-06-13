import sys
from pathlib import Path
from decimal import Decimal
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from src.models.order import Order, OrderStatusEnum
from src.models.payment import Payment, PaymentGatewayEnum, PaymentStatusEnum
from src.models.shipping_address import ShippingAddress
from src.models.shipping_status import ShippingStatus, ShippingStatusEnum
from src.main import app
from src.db.base import Base
from src.models.user import User
from src.models.product import Product
from src.core.security import hash_password

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))
TEST_DATABASE_URL = "postgresql+asyncpg://test_user:test123@localhost/test_db"
engine = create_async_engine(
    TEST_DATABASE_URL, future=True, echo=False, poolclass=NullPool
)
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session():
    async with AsyncSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as cl:
        yield cl


@pytest_asyncio.fixture
async def auth_client(client, db_session):
    secure_password = hash_password("Manoj@5424")
    user = User(
        email="manoj@gmail.com", hashed_password=secure_password, is_verified=True
    )
    db_session.add(user)
    product = Product(
        id=721,
        title="Cart Test Product",
        sku="SKU-CART-721",
        price=Decimal("299.00"),
        stock_quantity=50,
        is_active=True,
    )
    db_session.add(product)
    await db_session.flush()
    await db_session.commit()
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "manoj@gmail.com", "password": "Manoj@5424"},
    )
    assert login_response.status_code == 200, f"Login failed: {login_response.json()}"
    access_token = login_response.cookies.get("access_token")
    client.cookies.set("access_token", access_token)
    yield client


@pytest.mark.asyncio
async def test_get_cart(auth_client):
    response = await auth_client.get("/api/v1/cart/")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_add_to_cart(auth_client):
    response = await auth_client.post(
        "/api/v1/cart/add", json={"product_id": 721, "quantity": 1}
    )
    assert response.status_code in [200, 201]


@pytest.mark.asyncio
async def test_increase_cart_item(auth_client):
    await auth_client.post("/api/v1/cart/add", json={"product_id": 721, "quantity": 1})
    response = await auth_client.patch("/api/v1/cart/increase/721")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_decrease_cart_item(auth_client):
    add_response = await auth_client.post(
        "/api/v1/cart/add", json={"product_id": 721, "quantity": 1}
    )
    assert add_response.status_code in [200, 201]
    try:
        item_id = add_response.json()["id"]
        response = await auth_client.patch(f"/api/v1/cart/decrease/{item_id}")
    except (KeyError, TypeError):
        response = await auth_client.patch("/api/v1/cart/decrease/721")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_add_to_cart_invalid_product(auth_client):
    response = await auth_client.post(
        "/api/v1/cart/add", json={"product_id": 99999, "quantity": 1}
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_empty_cart(auth_client):
    response = await auth_client.get("/api/v1/cart/")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_delete_cart_item(auth_client):
    add_response = await auth_client.post(
        "/api/v1/cart/add", json={"product_id": 721, "quantity": 1}
    )
    assert add_response.status_code in [200, 201]
    try:
        item_id = add_response.json()["id"]
        response = await auth_client.delete(f"/api/v1/cart/delete/{item_id}")
    except (KeyError, TypeError):
        response = await auth_client.delete("/api/v1/cart/delete/721")
    assert response.status_code in [200, 204]


@pytest_asyncio.fixture(scope="function")
async def seed_data(db_session):
    # १. आधी पासवर्ड हॅश करणे
    from src.core.security import hash_password
    secure_password = hash_password("testpassword123")
    
    user = User(
        email="test@test.com",
        hashed_password=secure_password,
        is_verified=True,
    )
    db_session.add(user)
    await db_session.flush()

    product_721 = Product(
        id=721,
        title="Oversized Streetwear Hoodie Vol 11",
        slug="oversized-streetwear-hoodie-vol-11",
        sku="SKU-HOODIE-721",
        price=Decimal("1358.00"),
        stock_quantity=50,
        is_active=True
    )
    
    product_722 = Product(
        id=722,
        title="Blue Denim Jeans",
        slug="blue-denim-jeans",
        sku="SKU-JEANS-722",
        price=Decimal("1500.00"),
        stock_quantity=20,
        is_active=True
    )
    db_session.add_all([product_721, product_722])
    await db_session.flush()

    address = ShippingAddress(
        user_id=user.id,
        name="Test User",
        phone_number="9876543210",
        address_line1="ABC Road",
        address_line2="XYZ",
        city="Mumbai",
        state="MH",
        pin_code="400001",
        country="India",
    )
    db_session.add(address)
    await db_session.flush()

    order = Order(
        user_id=user.id,
        shipping_address_id=address.id,
        total_price=1358,
        status=OrderStatusEnum.pending,
    )
    db_session.add(order)
    await db_session.flush()

    payment = Payment(
        order_id=order.id,
        user_id=user.id,
        amount=Decimal("1358.00"),
        status=PaymentStatusEnum.pending,
        is_paid=False,
        payment_gateway=PaymentGatewayEnum.mock,
    )
    db_session.add(payment)
    await db_session.flush()

    shipping_status = ShippingStatus(
        order_id=order.id,
        status=ShippingStatusEnum.pending,
    )
    db_session.add(shipping_status)
    await db_session.flush()
    await db_session.refresh(user)
    await db_session.refresh(product_721)
    await db_session.refresh(product_722)
    await db_session.refresh(address)
    await db_session.refresh(order)
    await db_session.refresh(payment)
    await db_session.refresh(shipping_status)

    return {
        "user": user,
        "address": address,
        "order": order,
        "payment": payment,
        "shipping_status": shipping_status,
        "product_721": product_721,
        "product_722": product_722
    }
