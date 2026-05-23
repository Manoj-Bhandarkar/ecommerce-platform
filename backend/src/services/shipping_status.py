from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.shipping_status import ShippingStatus, ShippingStatusEnum
from src.repositories.shipping_status import (
    ShippingStatusRepository,
)


async def get_user_order_shipping_status(
    session: AsyncSession, user_id: UUID, order_id: int
) -> ShippingStatus:
    order = await ShippingStatusRepository.get_user_order_with_shipping_status(
        session=session,
        user_id=user_id,
        order_id=order_id,
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or not authorized",
        )
    if not order.shipping_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping status not found",
        )
    return order.shipping_status


async def update_shipping_status(
    session: AsyncSession,
    order_id: int,
    new_status: ShippingStatusEnum,
) -> ShippingStatus:
    shipping_status = await ShippingStatusRepository.get_by_order_id(
        session=session,
        order_id=order_id,
    )
    if not shipping_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping status not found",
        )
    # prevent updates after delivered/cancelled
    if shipping_status.status in [
        ShippingStatusEnum.delivered,
        ShippingStatusEnum.cancelled,
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update final shipping status",
        )
    shipping_status.status = new_status
    await ShippingStatusRepository.save(session)
    await ShippingStatusRepository.refresh(
        session=session,
        shipping_status=shipping_status,
    )
    return shipping_status
