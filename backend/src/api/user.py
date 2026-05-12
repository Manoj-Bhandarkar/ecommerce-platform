from fastapi import APIRouter, status
from src.core.database import SessionDep
from src.schemas.user import UserCreate, UserOut
from src.services.user import create_user

router = APIRouter()

@router.post("/register", response_model=UserOut,status_code=status.HTTP_201_CREATED)
async def register(session: SessionDep, user: UserCreate):
    return await create_user(session, user)