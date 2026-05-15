from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.models.user import User


class UserRepository:
    @staticmethod
    async def get_by_email(session: AsyncSession, email: str):
        stmt = select(User).where(User.email == email)
        return await session.scalar(stmt)

    @staticmethod
    async def create(session: AsyncSession, user_data: dict):
        user = User(**user_data)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def get_by_id(session: AsyncSession, user_id: int):
        stmt = select(User).where(User.id == user_id)
        return await session.scalar(stmt)

    @staticmethod
    async def verify_user_email(session: AsyncSession, user: User):
        user.is_verified = True
        await session.commit()
        await session.refresh(user)
        return user
