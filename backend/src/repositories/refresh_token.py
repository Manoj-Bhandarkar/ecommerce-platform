from sqlalchemy.ext.asyncio import AsyncSession
from src.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    @staticmethod
    async def create(session: AsyncSession, token_data: dict):
        refresh_token = RefreshToken(**token_data)
        session.add(refresh_token)
        await session.commit()
        await session.refresh(refresh_token)
        return refresh_token
