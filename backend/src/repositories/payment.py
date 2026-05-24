from sqlalchemy.ext.asyncio import AsyncSession
from src.models.payment import Payment
from uuid import UUID
from sqlalchemy import select


class PaymentRepository:

    @staticmethod
    async def create_payment(session: AsyncSession, payment: Payment) -> None:
        session.add(payment)
        await session.flush()

    @staticmethod
    async def get_payment_by_order_id(
        session: AsyncSession, order_id: int, user_id: UUID
    ) -> Payment | None:
        stmt = select(Payment).where(
            Payment.order_id == order_id,
            Payment.user_id == user_id,
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_payments(session: AsyncSession, user_id: UUID) -> list[Payment]:
        stmt = (
            select(Payment)
            .where(Payment.user_id == user_id)
            .order_by(Payment.created_at.desc())
        )
        result = await session.execute(stmt)
        return result.scalars().all()
