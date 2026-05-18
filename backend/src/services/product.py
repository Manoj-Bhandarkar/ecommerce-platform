from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.product import ProductRepository
from src.repositories.category import CategoryRepository
from src.schemas.product import ProductCreate
from src.models.product import Product

from src.utils.file import save_upload_file
from src.utils.slug import generate_slug


async def generate_unique_slug(
    session: AsyncSession,
    title: str,
):
    base_slug = generate_slug(title)
    slug = base_slug
    counter = 1

    while await ProductRepository.get_by_slug(
        session=session,
        slug=slug,
    ):
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


async def create_product(
    session: AsyncSession, data: ProductCreate, image: UploadFile | None
) -> Product:
    existing_product = await ProductRepository.get_by_sku(
        session=session,
        sku=data.sku,
    )

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists",
        )

    image_path = await save_upload_file(image, "products")
    categories = []
    if data.category_ids:
        categories = await CategoryRepository.get_by_ids(
            session=session,
            category_ids=data.category_ids,
        )
    product_data = data.model_dump(exclude={"category_ids"})

    product_data["slug"] = await generate_unique_slug(session, product_data["title"])

    product = await ProductRepository.create(
        session=session,
        product_data=product_data,
        image_url=image_path,
        categories=categories,
    )

    return product
