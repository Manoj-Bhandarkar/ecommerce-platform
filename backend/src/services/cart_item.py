from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.cart_item import CartItem
from src.schemas.cart_item import CartItemCreate, CartItemOut
from src.models.product import Product


async def add_to_cart(
    session: AsyncSession,
    data: CartItemCreate,
    user_id: int,
):
    product = await session.get(Product, data.product_id)
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )
    stmt = select(CartItem).where(
        CartItem.user_id == user_id,
        CartItem.product_id == data.product_id,
    )
    result = await session.execute(stmt)
    item = result.scalar_one_or_none()

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
        item = CartItem(
            user_id=user_id,
            product_id=data.product_id,
            quantity=data.quantity,
            price=product.price,
        )
        session.add(item)
    await session.commit()
    await session.refresh(item)
    return CartItemOut(
        id=item.id,
        user_id=item.user_id,
        product_id=item.product_id,
        product_title=product.title,
        quantity=item.quantity,
        price=item.price,
        total=item.price * item.quantity,
    )
