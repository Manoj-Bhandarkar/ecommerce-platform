from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.payment import Payment, PaymentGatewayEnum, PaymentStatusEnum
from src.repositories.payment import PaymentRepository
from src.schemas.payment import PaymentCreate
from src.utils.payment import generate_mock_ids


async def create_payment(
    session: AsyncSession,
    data: PaymentCreate,
    user_id: UUID,
    order_id: int,
) -> Payment:
    gateway = PaymentGatewayEnum(data.gateway)
    if gateway == PaymentGatewayEnum.mock:
        is_success = data.simulate_success
        payment_status = (
            PaymentStatusEnum.success if is_success else PaymentStatusEnum.failed
        )
        pg_order_id, pg_payment_id, pg_signature = generate_mock_ids()
    elif gateway == PaymentGatewayEnum.razorpay:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Razorpay not implemented yet",
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported payment gateway",
        )
    payment = Payment(
        order_id=order_id,
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
    return payment


async def get_payment_by_order_id(
    session: AsyncSession, order_id: int, user_id: UUID
) -> Payment:
    return await PaymentRepository.get_payment_by_order_id(
        session=session, order_id=order_id, user_id=user_id
    )

async def list_payments_by_user(session: AsyncSession, user_id: UUID) -> list[Payment]:
    return await PaymentRepository.get_user_payments(session=session, user_id=user_id)
