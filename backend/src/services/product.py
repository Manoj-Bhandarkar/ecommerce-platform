from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.product import ProductRepository
from src.repositories.category import CategoryRepository
from src.schemas.product import ProductCreate
from src.models.product import Product

from src.utils.file import save_upload_file
from src.utils.slug import generate_slug


async def create_product(
    session: AsyncSession, data: ProductCreate, image: UploadFile | None
) -> Product:
    if data.stock_quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock quantity cannot be negative",
        )
    image_path = await save_upload_file(image, "products")
    categories = []
    if data.category_ids:
        categories = await CategoryRepository.get_by_ids(
            session=session,
            category_ids=data.category_ids,
        )
    product_data = data.model_dump(exclude={"category_ids"})
    if not product_data.get("slug"):
        product_data["slug"] = generate_slug(product_data["title"])
    product = await ProductRepository.create(
        session=session,
        product_data=product_data,
        image_url=image_path,
        categories=categories,
    )

    return product
