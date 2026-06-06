from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.tasks.email_tasks import send_welcome_email_task
from src.schemas.user import UserCreate
from src.core.security import hash_password
from src.repositories.user import UserRepository


async def create_user(session: AsyncSession, user: UserCreate):
    existing_user = await UserRepository.get_by_email(session=session, email=user.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    new_user = await UserRepository.create(
        session=session,
        user_data={
            "email": user.email,
            "hashed_password": hash_password(user.password),
        },
    )
    print("BEFORE CELERY")
    # SEND WELCOME EMAIL
    result = send_welcome_email_task.delay(
        str(new_user.id),
        new_user.email,
    )
    print(result.id)
    print("AFTER CELERY")
    return new_user
