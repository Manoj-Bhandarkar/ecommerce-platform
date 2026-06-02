from sqlalchemy import select
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.shipping_status import ShippingStatus, ShippingStatusEnum
from src.models.order import Order, OrderStatusEnum
from src.models.payment import Payment, PaymentGatewayEnum, PaymentStatusEnum
from src.repositories.payment import PaymentRepository
from src.schemas.payment import (
    PaymentCreate,
    PaymentOut,
    PaymentWithPG,
    RazorpayCallback,
)
from src.utils.payment import generate_mock_ids
from src.core.config import settings
import razorpay

_razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_KEY_SECRET)
)


async def create_payment(
    session: AsyncSession,
    data: PaymentCreate,
    user_id: UUID,
    order: Order,
) -> PaymentWithPG:
    gateway = PaymentGatewayEnum(data.gateway)

    # initialize razorpay payment if gateway is razorpay
    payment_status = None
    pg_order_id = None
    pg_payment_id = None
    pg_signature = None
    razorpay_data = None

    if gateway == PaymentGatewayEnum.mock:
        is_success = data.simulate_success
        payment_status = (
            PaymentStatusEnum.success if is_success else PaymentStatusEnum.failed
        )
        pg_order_id, pg_payment_id, pg_signature = generate_mock_ids()

        if is_success:
            order.status = OrderStatusEnum.confirmed
            session.add(
                ShippingStatus(order_id=order.id, status=ShippingStatusEnum.pending)
            )
        else:
            order.status = OrderStatusEnum.cancelled
            session.add(
                ShippingStatus(order_id=order.id, status=ShippingStatusEnum.cancelled)
            )

    elif gateway == PaymentGatewayEnum.razorpay:
        try:
            order_data = {
                "amount": int(data.amount * 100),  # amount in paise
                "currency": "INR",
                "payment_capture": 1,
                "receipt": f"order_rcptid_{order.id}",
            }
            razorpay_order = _razorpay_client.order.create(data=order_data)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to create Razorpay order: {e}",
            )
        payment_status = PaymentStatusEnum.pending
        pg_order_id = razorpay_order.get("id")
        razorpay_data = {
            "pg_order_id": pg_order_id,
            "razorpay_key": settings.RAZORPAY_KEY,
            "amount": int(data.amount * 100),
            "currency": order_data["currency"],
            "razorpay_callback_url": settings.RAZORPAY_CALLBACK_URL,
        }
        order.status = OrderStatusEnum.pending
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported payment gateway",
        )
    payment = Payment(
        order_id=order.id,
        user_id=user_id,
        amount=data.amount,
        status=payment_status,
        is_paid=(payment_status == PaymentStatusEnum.success),
        payment_gateway=gateway,
        pg_order_id=pg_order_id,
        pg_payment_id=pg_payment_id,
        pg_signature=pg_signature,
    )
    await PaymentRepository.create_payment(
        session=session,
        payment=payment,
    )
    return PaymentWithPG(
        payment=PaymentOut.model_validate(payment), razorpay_data=razorpay_data
    )


async def get_payment_by_order_id(
    session: AsyncSession, order_id: int, user_id: UUID
) -> Payment:
    return await PaymentRepository.get_payment_by_order_id(
        session=session, order_id=order_id, user_id=user_id
    )


async def list_payments_by_user(session: AsyncSession, user_id: UUID) -> list[Payment]:
    return await PaymentRepository.get_user_payments(session=session, user_id=user_id)


async def handle_razorpay_callback(session: AsyncSession, payload: RazorpayCallback):
    order_id = payload.razorpay_order_id
    payment_id = payload.razorpay_payment_id
    signature = payload.razorpay_signature

    result = await session.execute(
        select(Payment).where(Payment.pg_order_id == order_id)
    )
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found"
        )
    try:
        _razorpay_client.utility.verify_payment_signature(
            {
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            }
        )
    except razorpay.errors.SignatureVerificationError:
        payment.status = PaymentStatusEnum.failed
        payment.is_paid = False
        await session.commit()
        order = await session.get(Order, payment.order_id)
        if order:
            order.status = OrderStatusEnum.cancelled
            shipping_status = ShippingStatus(
                order_id=order.id, status=ShippingStatusEnum.cancelled
            )
            session.add(shipping_status)
            await session.commit()
        return {"status": "failed", "reason": "Signature verification failed"}

    payment.status = PaymentStatusEnum.success
    payment.is_paid = True
    payment.pg_payment_id = payment_id
    payment.pg_signature = signature
    await session.commit()
    order = await session.get(Order, payment.order_id)
    if order:
        order.status = OrderStatusEnum.confirmed
        shipping_status = ShippingStatus(
            order_id=order.id, status=ShippingStatusEnum.pending
        )
        session.add(shipping_status)
        await session.commit()
    return {"status": "success", "rz_payment_id": payment_id, "rz_order_id": order_id}
