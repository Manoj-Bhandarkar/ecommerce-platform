from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update
from src.models.refresh_token import RefreshToken
from sqlalchemy import select


class RefreshTokenRepository:
    @staticmethod
    async def create(session: AsyncSession, token_data: dict):
        refresh_token = RefreshToken(**token_data)
        session.add(refresh_token)
        await session.commit()
        await session.refresh(refresh_token)
        return refresh_token

    @staticmethod
    async def get_by_token(session: AsyncSession, token: str):
        stmt = select(RefreshToken).where(RefreshToken.token == token)
        return await session.scalar(stmt)


    @staticmethod
    async def revoke(session: AsyncSession, refresh_token: RefreshToken):
        refresh_token.revoked = True
        await session.commit()

    @staticmethod
    async def revoke_all_user_tokens(session: AsyncSession,user_id: int):
        stmt = (update(RefreshToken).where(RefreshToken.user_id == user_id).values(revoked=True))
        await session.execute(stmt)
        await session.commit()
