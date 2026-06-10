import pytest


@pytest.mark.asyncio
async def test_get_products(client):
    response = await client.get("/api/v1/product")

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_search_products(client):
    response = await client.get(
        "/api/v1/product/search/?title=jeans"
    )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_product_invalid_slug(client):
    response = await client.get(
        "/api/v1/product/invalid-product-slug"
    )

    assert response.status_code in [404, 400]

@pytest.mark.asyncio
async def test_get_product_by_slug(client):
    response = await client.get(
        "/api/v1/product/oversized-streetwear-hoodie-vol-11"
    )

    assert response.status_code == 200
    assert response.json()["slug"] == "oversized-streetwear-hoodie-vol-11"