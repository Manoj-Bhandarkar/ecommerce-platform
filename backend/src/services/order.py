from decimal import Decimal
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import select

from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.payment import PaymentStatusEnum
from src.models.order import Order, OrderStatusEnum
from src.models.order_item import OrderItem
from src.models.shipping_status import ShippingStatus, ShippingStatusEnum
from src.repositories.cart_item import CartRepository
from src.repositories.order import OrderRepository
from src.repositories.product import ProductRepository
from src.repositories.shipping_address import ShippingAddressRepository
from src.schemas.payment import PaymentCreate
from src.services.payment import create_payment


async def checkout(
    session: AsyncSession, user_id: UUID, payment_data: PaymentCreate
) -> Order:
    cart_items = await CartRepository.get_user_cart_items(
        session=session,
        user_id=user_id,
    )
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )
    total_price = Decimal("0.00")
    order_items: list[OrderItem] = []
    for item in cart_items:
        if not item.product:
            continue
        if item.product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {item.product.title}",
            )
        if Decimal(str(item.product.price)) != Decimal(str(item.price)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Price changed for {item.product.title}",
            )
        item_total = Decimal(str(item.price)) * item.quantity
        total_price += item_total
        order_items.append(
            OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
            )
        )
    if abs(total_price - Decimal(str(payment_data.amount))) > Decimal("0.01"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment amount mismatch",
        )
    address = await ShippingAddressRepository.get_address_by_id(
        session=session,
        address_id=payment_data.shipping_address_id,
    )
    if not address or address.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid shipping address",
        )
    order = Order(
        user_id=user_id,
        total_price=total_price,
        shipping_address_id=payment_data.shipping_address_id,
        status=OrderStatusEnum.pending,
    )
    await OrderRepository.create_order(session=session, order=order)
    payment = await create_payment(
        session=session,
        data=payment_data,
        user_id=user_id,
        order_id=order.id,
    )
    if not payment.is_paid:
        order.status = OrderStatusEnum.cancelled
        await session.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment failed",
        )
    order.status = OrderStatusEnum.confirmed
    shipping_status = ShippingStatus(
        order_id=order.id,
        status=ShippingStatusEnum.pending,
    )
    session.add(shipping_status)
    for oi in order_items:
        oi.order_id = order.id
        session.add(oi)
        product = await ProductRepository.get_product_by_id(
            session=session,
            product_id=oi.product_id,
        )
        if product:
            product.stock_quantity -= oi.quantity
    await CartRepository.clear_cart_items(session=session, cart_items=cart_items)
    await session.commit()
    return await OrderRepository.get_order_by_id(session=session, order_id=order.id)


async def get_placed_order_for_user(
    session: AsyncSession, user_id: UUID
) -> list[Order]:
    return await OrderRepository.get_user_orders(
        session=session,
        user_id=user_id,
    )


async def get_order_by_id(session: AsyncSession, user_id: UUID, order_id: int) -> Order:
    order = await OrderRepository.get_user_order_by_id(
        session=session,
        user_id=user_id,
        order_id=order_id,
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order


async def cancel_order(session: AsyncSession, user_id: UUID, order_id: int) -> Order:
    order = await OrderRepository.get_user_order_by_id(
        session=session,
        user_id=user_id,
        order_id=order_id,
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    if order.status == OrderStatusEnum.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already cancelled",
        )
    if (
        not order.shipping_status
        or order.shipping_status.status != ShippingStatusEnum.pending
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be cancelled",
        )
    # restore stock
    for item in order.order_items:
        if item.product:
            item.product.stock_quantity += item.quantity
    # update statuses
    order.status = OrderStatusEnum.cancelled
    order.shipping_status.status = ShippingStatusEnum.cancelled
    # update payment
    if order.payment and order.payment.is_paid:
        order.payment.status = PaymentStatusEnum.cancelled
        order.payment.is_paid = False
    await OrderRepository.save(session)

    return await OrderRepository.refresh_order(
        session=session,
        order_id=order.id,
        user_id=user_id,
    )


async def all_placed_order(
    session: AsyncSession,
    shipping_status: str | None = None,
    user_id: int | None = None,
):
    stmt = (
        select(Order)
        .where(Order.status == OrderStatusEnum.confirmed)
        .options(
            selectinload(Order.order_items).selectinload(OrderItem.product),
            selectinload(Order.shipping_status),
        )
    )

    # Filter by user if provided
    if user_id:
        stmt = stmt.where(Order.user_id == user_id)

    # Filter by shipping status if provided
    if shipping_status:
        stmt = stmt.join(Order.shipping_status).where(
            ShippingStatus.status == shipping_status
        )

    result = await session.execute(stmt)
    return result.scalars().all()
