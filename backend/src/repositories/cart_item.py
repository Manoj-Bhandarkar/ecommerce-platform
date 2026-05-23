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
            .with_for_update()
        )
        result = await session.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_cart_item(
        session: AsyncSession,
        user_id: UUID,
        product_id: UUID,
    ) -> CartItem | None:

        stmt = select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id,
        )

        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_cart_item(
        session: AsyncSession,
        user_id: UUID,
        product_id: UUID,
        quantity: int,
        price,
    ) -> CartItem:

        item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity,
            price=price,
        )

        session.add(item)
        await session.commit()
        await session.refresh(item)

        return item

    @staticmethod
    async def delete_cart_item(
        session: AsyncSession,
        item: CartItem,
    ) -> None:
        await session.delete(item)
        await session.commit()

    @staticmethod
    async def save(
        session: AsyncSession,
        item: CartItem,
    ) -> None:
        await session.commit()
        await session.refresh(item)

    @staticmethod
    async def get_cart_item_by_id(
        session: AsyncSession,
        cart_item_id: int,
        user_id: int,
    ) -> CartItem | None:
        stmt = select(CartItem).where(
            CartItem.id == cart_item_id,
            CartItem.user_id == user_id,
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def commit(session: AsyncSession) -> None:
        await session.commit()

    @staticmethod
    async def clear_cart_items(
        session: AsyncSession,
        cart_items: list[CartItem],
    ) -> None:
        for item in cart_items:
            await session.delete(item)
