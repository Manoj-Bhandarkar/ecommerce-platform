from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.models.order import Order
from src.models.order_item import OrderItem


class OrderRepository:

    @staticmethod
    async def get_order_by_id(
        session: AsyncSession,
        order_id: int,
    ) -> Order | None:
        stmt = (
            select(Order)
            .where(Order.id == order_id)
            .options(
                selectinload(Order.order_items).selectinload(OrderItem.product),
                selectinload(Order.shipping_address),
                selectinload(Order.shipping_status),
                selectinload(Order.payment),
            )
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_order(
        session: AsyncSession,
        order: Order,
    ) -> None:
        session.add(order)
        await session.flush()

    @staticmethod
    async def get_user_orders(
        session: AsyncSession,
        user_id: UUID,
    ) -> list[Order]:

        stmt = (
            select(Order)
            .where(Order.user_id == user_id)
            .options(
                selectinload(Order.order_items).selectinload(OrderItem.product),
                selectinload(Order.shipping_address),
                selectinload(Order.shipping_status),
                selectinload(Order.payment),
            )
            .order_by(Order.created_at.desc())
        )
        result = await session.execute(stmt)
        return result.scalars().all()
