from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.shipping_status import ShippingStatus
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
