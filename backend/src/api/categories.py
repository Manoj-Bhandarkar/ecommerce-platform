from fastapi import APIRouter, Depends, status
from src.dependencies.auth import require_admin
from src.models.user import User
from src.core.database import SessionDep
from src.schemas.category import CategoryOut, CategoryCreate
from src.services.category import create_category, get_all_categories, delete_category

router = APIRouter()


@router.post("/", response_model=CategoryOut)
async def category_create(
    session: SessionDep,
    category: CategoryCreate,
    _: User = Depends(require_admin),
):
    return await create_category(session, category)


@router.get("/", response_model=list[CategoryOut])
async def list_categories(session: SessionDep):
    return await get_all_categories(session=session)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def category_delete(
    session: SessionDep, category_id: int, _: User = Depends(require_admin)
):
    await delete_category(session=session, category_id=category_id)
