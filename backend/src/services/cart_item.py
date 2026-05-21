from decimal import Decimal
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.product import Product
from src.models.cart_item import CartItem
from src.schemas.cart_item import CartItemCreate, CartItemOut, CartSummary
from src.repositories.cart_item import CartRepository


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
    else:
        item = await CartRepository.create_cart_item(
            session=session,
            user_id=user_id,
            product_id=data.product_id,
            quantity=data.quantity,
            price=product.price,
        )

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

    return CartSummary(
        items=cart_data,
        total_quantity=total_quantity,
        total_price=total_price,
    )
