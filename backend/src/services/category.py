from fastapi import HTTPException
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
