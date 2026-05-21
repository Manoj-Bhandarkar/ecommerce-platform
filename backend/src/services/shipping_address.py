from sqlalchemy.ext.asyncio import AsyncSession
from src.repositories.shipping_address import ShippingAddressRepository
from src.schemas.shipping_address import ShippingAddressCreate, ShippingAddressOut


async def create_shipping_address(
    session: AsyncSession,
    user_id: int,
    data: ShippingAddressCreate,
) -> ShippingAddressOut:
    address = await ShippingAddressRepository.create(
        session=session,
        user_id=user_id,
        data=data.model_dump(),
    )
    await ShippingAddressRepository.save(session)
    await session.refresh(address)
    return ShippingAddressOut.model_validate(address)
