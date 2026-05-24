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
    async def get_by_order_id_and_user_id(
        session: AsyncSession, order_id: int, user_id: UUID
    ) -> Payment | None:
        stmt = select(Payment).where(
            Payment.order_id == order_id,
            Payment.user_id == user_id,
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
