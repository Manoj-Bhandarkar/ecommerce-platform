from fastapi import APIRouter, Depends
from src.dependencies.auth import require_admin
from src.models.user import User
from src.core.database import SessionDep
from src.schemas.category import CategoryOut, CategoryCreate
from src.services.category import create_category

router = APIRouter()


@router.post("/", response_model=CategoryOut)
async def category_create(
    session: SessionDep,
    category: CategoryCreate,
    _: User = Depends(require_admin),
):
    return await create_category(session, category)
