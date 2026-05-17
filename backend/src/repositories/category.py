from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.category import Category


class CategoryRepository:

    @staticmethod
    async def get_by_name_or_slug(session: AsyncSession, name: str, slug: str):
        stmt = select(Category).where(
            or_(
                Category.name.ilike(name),
                Category.slug == slug,
            )
        )
        return await session.scalar(stmt)

    @staticmethod
    async def create(session: AsyncSession, category_data: dict):
        category = Category(**category_data)
        session.add(category)
        await session.commit()
        await session.refresh(category)
        return category
