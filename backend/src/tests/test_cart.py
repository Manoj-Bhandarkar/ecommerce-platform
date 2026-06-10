import pytest


@pytest.mark.asyncio
async def test_get_cart(auth_client):
    response = await auth_client.get("/api/v1/cart/")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_add_to_cart(auth_client):
    response = await auth_client.post(
        "/api/v1/cart/add", json={"product_id": 722, "quantity": 1}
    )
    assert response.status_code in [200, 201]


@pytest.mark.asyncio
async def test_increase_cart_item(auth_client):
    await auth_client.post("/api/v1/cart/add", json={"product_id": 722, "quantity": 1})
    response = await auth_client.patch("/api/v1/cart/increase/722")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_decrease_cart_item(auth_client):
    add_response = await auth_client.post("/api/v1/cart/add", json={"product_id": 722, "quantity": 1})
    assert add_response.status_code == 200
    item_id = add_response.json()["id"]
    response = await auth_client.patch(f"/api/v1/cart/decrease/{item_id}")
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
        "/api/v1/cart/add", json={"product_id": 722, "quantity": 1}
    )
    item_id = add_response.json()["id"]
    response = await auth_client.delete(f"/api/v1/cart/delete/{item_id}")
    assert response.status_code == 204
