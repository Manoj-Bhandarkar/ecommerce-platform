from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas.auth import UserLogin
from src.repositories.user import UserRepository
from src.repositories.refresh_token import RefreshTokenRepository
from src.core.security import verify_password, create_access_token, create_refresh_token
from src.core.config import settings


async def login_user(session: AsyncSession, user_login: UserLogin):
    user = await UserRepository.get_by_email(session=session, email=user_login.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    if not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token_str = create_refresh_token()

    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    refresh_token = await RefreshTokenRepository.create(
        session=session,
        token_data={
            "user_id": user.id,
            "token": refresh_token_str,
            "expires_at": expires_at,
        },
    )

    return {"access_token": access_token, "refresh_token": refresh_token.token}
