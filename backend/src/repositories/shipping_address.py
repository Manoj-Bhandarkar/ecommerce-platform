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
