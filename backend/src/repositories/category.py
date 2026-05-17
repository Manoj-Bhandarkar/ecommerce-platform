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

    @staticmethod
    async def get_all(session: AsyncSession):
        stmt = select(Category).order_by(Category.id)
        result = await session.scalars(stmt)
        return result.all()

    @staticmethod
    async def get_by_id(session: AsyncSession, category_id: int):
        return await session.get(Category, category_id)

    @staticmethod
    async def delete(session: AsyncSession, category: Category):
        await session.delete(category)
        await session.commit()

    @staticmethod
    async def get_by_ids(session: AsyncSession, category_ids: list[int]):
        stmt = select(Category).where(Category.id.in_(category_ids))
        result = await session.scalars(stmt)
        return result.all()
