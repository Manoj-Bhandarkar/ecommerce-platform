from decimal import Decimal
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.product import Product
from src.schemas.cart_item import CartItemCreate, CartItemOut, CartSummary
from src.repositories.cart_item import CartRepository
import json
from fastapi.encoders import jsonable_encoder
from src.core.redis import redis_client


async def add_to_cart(
    session: AsyncSession,
    data: CartItemCreate,
    user_id: UUID,
):
    product = await session.get(Product, data.product_id)
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )
    item = await CartRepository.get_cart_item(
        session=session,
        user_id=user_id,
        product_id=data.product_id,
    )
    new_quantity = data.quantity
    if item:
        new_quantity = item.quantity + data.quantity
    if new_quantity > product.stock_quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock",
        )

    if item:
        item.quantity = new_quantity
        item.price = product.price
        session.add(item)  
        await session.commit()  
        await session.refresh(item)
    else:
        item = await CartRepository.create_cart_item(
            session=session,
            user_id=user_id,
            product_id=data.product_id,
            quantity=data.quantity,
            price=product.price,
        )
    await redis_client.delete(f"cart:{user_id}")
    return CartItemOut(
        id=item.id,
        user_id=item.user_id,
        product_id=item.product_id,
        product_title=product.title,
        product_slug=product.slug,
        product_image=product.image_url,
        quantity=item.quantity,
        price=item.price,
        total=item.price * item.quantity,
    )


async def list_user_cart(
    session: AsyncSession,
    user_id: UUID,
) -> CartSummary:
    cache_key = f"cart:{user_id}"
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    cart_items = await CartRepository.get_user_cart_items(
        session=session,
        user_id=user_id,
    )

    cart_data: list[CartItemOut] = []
    total_quantity = 0
    total_price = Decimal("0.00")

    for item in cart_items:
        if not item.product:
            continue
        quantity = item.quantity
        price = item.price
        total = quantity * price
        total_quantity += quantity
        total_price += total
        cart_data.append(
            CartItemOut(
                id=item.id,
                user_id=user_id,
                product_id=item.product.id,
                product_title=item.product.title,
                product_slug=item.product.slug,
                product_image=item.product.image_url,
                quantity=quantity,
                price=price,
                total=total,
            )
        )

    response = CartSummary(
        items=cart_data,
        total_quantity=total_quantity,
        total_price=total_price,
    )

    await redis_client.setex(cache_key, 1800, json.dumps(jsonable_encoder(response)))
    return response


async def change_cart_item_quantity_by_product(
    session: AsyncSession,
    product_id: int,
    user_id: int,
    delta: int,
):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    item = await CartRepository.get_cart_item(
        session=session,
        user_id=user_id,
        product_id=product_id,
    )
    if not item:
        if delta < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Item not in cart",
            )
        if product.stock_quantity < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock",
            )
        item = await CartRepository.create_cart_item(
            session=session,
            user_id=user_id,
            product_id=product_id,
            quantity=1,
            price=product.price,
        )
        return CartItemOut(
            id=item.id,
            product_id=item.product_id,
            user_id=user_id,
            product_title=product.title,
            product_slug=product.slug,
            product_image=product.image_url,
            quantity=item.quantity,
            price=item.price,
            total=item.price * item.quantity,
        )

    # Existing item
    new_quantity = item.quantity + delta
    if new_quantity <= 0:
        await CartRepository.delete_cart_item(
            session=session,
            item=item,
        )
        await redis_client.delete(f"cart:{user_id}")
        return {"message": "Item removed from cart"}
    if new_quantity > product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock",
        )
    item.quantity = new_quantity
    item.price = product.price
    await CartRepository.save(session, item)
    await redis_client.delete(f"cart:{user_id}")

    return CartItemOut(
        id=item.id,
        product_id=item.product_id,
        user_id=user_id,
        product_title=product.title,
        product_slug=product.slug,
        product_image=product.image_url,
        quantity=item.quantity,
        price=item.price,
        total=item.price * item.quantity,
    )


async def delete_cart_item(
    session: AsyncSession,
    cart_item_id: int,
    user_id: int,
):
    item = await CartRepository.get_cart_item_by_id(
        session=session,
        cart_item_id=cart_item_id,
        user_id=user_id,
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    await CartRepository.delete_cart_item(session=session, item=item)
    await CartRepository.commit(session)
    await redis_client.delete(f"cart:{user_id}")
