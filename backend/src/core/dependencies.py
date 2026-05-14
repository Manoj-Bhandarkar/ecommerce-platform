from fastapi import HTTPException, status, Request
from sqlalchemy import select
from src.repositories.user import UserRepository
from src.core.database import SessionDep
from src.models.user import User
from src.core.security import decode_token


async def get_current_user(session: SessionDep, request: Request):
    # is_authenticated give name also
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Access Token",
        )
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or Expired Token",
        )
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token Payload",
        )

    user = await UserRepository.get_by_id(session=session, user_id=user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Not Found",
        )
    return user
