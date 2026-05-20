from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.models.cart_item import CartItem


class CartRepository:

    @staticmethod
    async def get_user_cart_items(
        session: AsyncSession, user_id: UUID
    ) -> list[CartItem]:

        stmt = (
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .options(selectinload(CartItem.product))
        )
        result = await session.execute(stmt)
        return result.scalars().all()
