import pytest


@pytest.mark.asyncio
async def test_get_user_orders(auth_client):
    response = await auth_client.get("/api/v1/order")

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_order_invalid_id(auth_client):
    response = await auth_client.get("/api/v1/order/99999")

    assert response.status_code in [404, 400]


@pytest.mark.asyncio
async def test_checkout_invalid_payment(auth_client):
    response = await auth_client.post(
        "/api/v1/order/checkout",
        json={}
    )

    assert response.status_code in [400, 422]


@pytest.mark.asyncio
async def test_cancel_invalid_order(auth_client):
    response = await auth_client.patch(
        "/api/v1/order/cancel/99999"
    )

    assert response.status_code in [404, 400]

@pytest.mark.asyncio
async def test_checkout_empty_cart(auth_client):
    response = await auth_client.post(
        "/api/v1/order/checkout",
        json={
            "amount": 100,
            "shipping_address_id": 1,
            "gateway": "mock"
        },
    )

    assert response.status_code in [400, 404]

@pytest.mark.asyncio
async def test_checkout_success(auth_client):

    await auth_client.post(
        "/api/v1/cart/add",
        json={
            "product_id": 722,
            "quantity": 1,
        },
    )

    response = await auth_client.post(
        "/api/v1/order/checkout",
        json={
            "amount": 11720,
            "shipping_address_id": 4,
            "gateway": "mock",
            "simulate_success": True,
        },
    )
    assert response.status_code == 200
    assert "order" in response.json()
    assert "payment" in response.json()