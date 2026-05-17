from sqlalchemy.ext.asyncio import AsyncSession
from src.models.product import Product


class ProductRepository:

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
        await session.refresh(product)
        return product
