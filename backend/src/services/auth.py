from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.user import User
from src.schemas.auth import UserLogin
from src.repositories.user import UserRepository
from src.repositories.refresh_token import RefreshTokenRepository
from src.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    create_email_verification_token,
    verify_email_token,
)
from src.core.config import settings


async def authenticate_user(session: AsyncSession, user_login: UserLogin):
    user = await UserRepository.get_by_email(session=session, email=user_login.email)
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return user


# CREATE BOTH TOKENS
async def create_tokens(session: AsyncSession, user: User):
    # ACCESS TOKEN
    access_token = create_access_token(data={"sub": str(user.id)})
    # REFRESH TOKEN STRING
    refresh_token_str = create_refresh_token()
    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    # SAVE REFRESH TOKEN IN DB
    refresh_token = await RefreshTokenRepository.create(
        session=session,
        token_data={
            "user_id": user.id,
            "token": refresh_token_str,
            "expires_at": expires_at,
        },
    )
    return {"access_token": access_token, "refresh_token": refresh_token.token}


# LOGIN FLOW
async def login_user(session: AsyncSession, user_login: UserLogin):
    user = await authenticate_user(session=session, user_login=user_login)
    return await create_tokens(session=session, user=user)


async def verify_refresh_token(session: AsyncSession, token: str):
    db_refresh_token = await RefreshTokenRepository.get_by_token(
        session=session, token=token
    )
    if not db_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    if db_refresh_token.revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked"
        )
    expires_at = db_refresh_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired"
        )
    user = await UserRepository.get_by_id(
        session=session, user_id=db_refresh_token.user_id
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    await RefreshTokenRepository.revoke(session=session, refresh_token=db_refresh_token)
    return user


async def send_verification_email(user: User):
    token = create_email_verification_token(user.id)
    verification_link = f"{settings.FRONTEND_URL}" f"/verify-email?token={token}"
    print(f"Verification Link: " f"{verification_link}")
    return {"message": "Verification email sent successfully"}


async def verify_user_email(session: AsyncSession, token: str):
    user_id = verify_email_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token"
        )
    user = await UserRepository.get_by_id(session=session, user_id=int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if user.is_verified:
        return {"message": "Email already verified"}
    
    # set user as verified
    await UserRepository.verify_user_email(session=session, user=user)
    
    return {"message": "Email verified successfully"}
