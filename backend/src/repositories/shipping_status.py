from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.models.shipping_status import ShippingStatus
from src.models.order import Order


class ShippingStatusRepository:

    @staticmethod
    async def get_user_order_with_shipping_status(
        session: AsyncSession,
        user_id: UUID,
        order_id: int,
    ) -> Order | None:
        stmt = (
            select(Order)
            .where(
                Order.id == order_id,
                Order.user_id == user_id,
            )
            .options(selectinload(Order.shipping_status))
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_order_id(
        session: AsyncSession, order_id: int
    ) -> ShippingStatus | None:
        stmt = select(ShippingStatus).where(ShippingStatus.order_id == order_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def save(session: AsyncSession) -> None:
        await session.commit()

    @staticmethod
    async def refresh(session: AsyncSession, shipping_status: ShippingStatus) -> None:
        await session.refresh(shipping_status)
