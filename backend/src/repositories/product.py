from sqlalchemy.ext.asyncio import AsyncSession
from src.models.product import Product
from sqlalchemy import select

class ProductRepository:
    @staticmethod
    async def get_by_sku(session: AsyncSession, sku: str):
        stmt = select(Product).where(Product.sku == sku)
        return await session.scalar(stmt)

    @staticmethod
    async def get_by_slug(session: AsyncSession, slug: str):
        stmt = select(Product).where(Product.slug == slug)
        return await session.scalar(stmt)
    
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
