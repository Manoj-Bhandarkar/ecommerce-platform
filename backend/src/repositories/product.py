from sqlalchemy.ext.asyncio import AsyncSession
from src.models.product import Product
from sqlalchemy import and_, select, func
from sqlalchemy.orm import selectinload
from src.models.category import Category


class ProductRepository:
    @staticmethod
    async def get_by_sku(session: AsyncSession, sku: str):
        stmt = select(Product).where(Product.sku == sku)
        return await session.scalar(stmt)

    @staticmethod
    async def slug_exists(session: AsyncSession, slug: str) -> bool:
        stmt = select(Product.id).where(Product.slug == slug)
        result = await session.scalar(stmt)
        return result is not None

    @staticmethod
    async def create(
        session: AsyncSession,
        product_data: dict,
        image_url: str | None,
        categories: list,
    ):
        product = Product(**product_data, image_url=image_url, categories=categories)
        session.add(product)
        await session.commit()
        await session.refresh(product, attribute_names=["categories"])
        return product

    @staticmethod
    async def get_all(
        session: AsyncSession,
        category_names: list[str] | None,
        limit: int,
        offset: int,
    ):
        stmt = select(Product).options(selectinload(Product.categories))
        if category_names:
            stmt = (
                stmt.join(Product.categories)
                .where(Category.name.in_(category_names))
                .distinct()
            )
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await session.scalar(count_stmt)
        stmt = stmt.limit(limit).offset(offset)
        result = await session.execute(stmt)
        products = result.scalars().unique().all()
        return total, products

    @staticmethod
    async def get_by_slug(session: AsyncSession, slug: str) -> Product | None:
        stmt = (
            select(Product)
            .options(selectinload(Product.categories))
            .where(Product.slug == slug)
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()



    @staticmethod
    async def search(
        session: AsyncSession,
        category_names: list[str] | None,
        title: str | None,
        description: str | None,
        min_price: float | None,
        max_price: float | None,
        limit: int,
        offset: int,
    ):
        stmt = select(Product).options(selectinload(Product.categories))
        if category_names:
            stmt = (stmt.join(Product.categories).where(Category.name.in_(category_names)).distinct())
        filters = []

        if title:
            filters.append(Product.title.ilike(f"%{title}%"))
        if description:
            filters.append(Product.description.ilike(f"%{description}%"))
        if min_price is not None:
            filters.append(Product.price >= min_price)
        if max_price is not None:
            filters.append(Product.price <= max_price)
        if filters:
            stmt = stmt.where(and_(*filters))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await session.scalar(count_stmt)
        stmt = stmt.limit(limit).offset(offset)
        result = await session.execute(stmt)
        products = result.scalars().unique().all()
        return total, products