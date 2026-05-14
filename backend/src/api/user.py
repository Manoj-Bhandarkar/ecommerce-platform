from typing import Annotated

from fastapi import APIRouter, Depends, status
from src.core.dependencies import get_current_user
from src.models.user import User
from src.core.database import SessionDep
from src.schemas.user import UserCreate, UserOut
from src.services.user import create_user

router = APIRouter()

@router.post("/register", response_model=UserOut,status_code=status.HTTP_201_CREATED)
async def register(session: SessionDep, user: UserCreate):
    return await create_user(session, user)

@router.get("/me", response_model=UserOut)
async def me(user: Annotated[User, Depends(get_current_user)]):
    return user