

from sqlalchemy import UUID, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.shipping_address import ShippingAddress


class ShippingAddressRepository:

    @staticmethod
    async def create(
        session: AsyncSession, user_id: int, data: dict
    ) -> ShippingAddress:
        address = ShippingAddress(
            user_id=user_id,
            **data,
        )
        session.add(address)
        await session.flush()
        return address

    @staticmethod
    async def save(session: AsyncSession) -> None:
        await session.commit()

    @staticmethod
    async def get_user_addresses(
        session: AsyncSession, user_id: UUID
    ) -> list[ShippingAddress]:
        stmt = (
            select(ShippingAddress)
            .where(ShippingAddress.user_id == user_id)
            .order_by(ShippingAddress.created_at.desc())
        )
        result = await session.execute(stmt)
        return result.scalars().all()
