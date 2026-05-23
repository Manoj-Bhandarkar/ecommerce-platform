from sqlalchemy.ext.asyncio import AsyncSession
from src.models.payment import Payment


class PaymentRepository:

    @staticmethod
    async def create_payment(
        session: AsyncSession,
        payment: Payment,
    ) -> None:
        session.add(payment)
        await session.flush()
