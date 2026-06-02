from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from slugify import slugify

from src.schemas.category import CategoryCreate
from src.repositories.category import CategoryRepository


async def create_category(session: AsyncSession, category: CategoryCreate):
    slug = slugify(category.name)
    existing_category = await CategoryRepository.get_by_name_or_slug(
        session=session,
        name=category.name,
        slug=slug,
    )
    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists",
        )
    return await CategoryRepository.create(
        session=session,
        category_data={
            "name": category.name,
            "slug": slug,
        },
    )


async def get_all_categories(session: AsyncSession):
    categories = await CategoryRepository.get_all(session=session)
    return [
        {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "products_count": len(category.products),
        }
        for category in categories
    ]


async def delete_category(session: AsyncSession, category_id: int):
    category = await CategoryRepository.get_by_id(
        session=session, category_id=category_id
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    await CategoryRepository.delete(session=session, category=category)
