import select
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.repositories.shipping_address import ShippingAddressRepository
from src.schemas.shipping_address import (
    ShippingAddressCreate,
    ShippingAddressOut,
    ShippingAddressUpdate,
)


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


async def list_user_shipping_addresses(
    session: AsyncSession,
    user_id: UUID,
) -> list[ShippingAddressOut]:
    addresses = await ShippingAddressRepository.get_user_addresses(
        session=session,
        user_id=user_id,
    )
    return [ShippingAddressOut.model_validate(address) for address in addresses]


async def get_user_shipping_address_by_address_id(
    session: AsyncSession,
    address_id: int,
    user_id: UUID,
) -> ShippingAddressOut:
    address = await ShippingAddressRepository.get_user_address_by_id(
        session=session,
        address_id=address_id,
        user_id=user_id,
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )
    return ShippingAddressOut.model_validate(address)


async def update_user_shipping_address_by_address_id(
    session: AsyncSession,
    address_id: int,
    user_id: UUID,
    data: ShippingAddressUpdate,
) -> ShippingAddressOut:
    address = await ShippingAddressRepository.get_user_address_by_id(
        session=session,
        address_id=address_id,
        user_id=user_id,
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )
    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    for key, value in update_data.items():
        setattr(address, key, value)
    await ShippingAddressRepository.save(session)
    await session.refresh(address)
    return ShippingAddressOut.model_validate(address)


async def delete_shipping_address_by_address_id(
    session: AsyncSession,
    user_id: UUID,
    address_id: int,
) -> None:
    address = await ShippingAddressRepository.get_user_address_by_id(
        session=session,
        address_id=address_id,
        user_id=user_id,
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )
    await ShippingAddressRepository.delete(session=session, address=address)
    await ShippingAddressRepository.save(session)
