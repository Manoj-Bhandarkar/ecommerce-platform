from fastapi import HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from slugify import slugify

from src.models.category import Category
from src.schemas.category import CategoryCreate


async def create_category(
    session: AsyncSession,
    category: CategoryCreate,
):
    slug = slugify(category.name)
    stmt = select(Category).where(
        or_(
            Category.name.ilike(category.name),
            Category.slug == slug,
        )
    )
    existing_category = await session.scalar(stmt)
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    db_category = Category(name=category.name, slug=slug)
    session.add(db_category)
    await session.commit()
    await session.refresh(db_category)

    return db_category
