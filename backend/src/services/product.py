from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.product import ProductRepository
from src.repositories.category import CategoryRepository
from src.schemas.product import ProductCreate, ProductUpdate
from src.models.product import Product

from src.utils.file import save_upload_file
from src.utils.slug import generate_slug


async def generate_unique_slug(session: AsyncSession, title: str):
    base_slug = generate_slug(title)
    slug = base_slug
    counter = 1
    while await ProductRepository.slug_exists(session, slug):
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


async def create_product(
    session: AsyncSession, data: ProductCreate, image: UploadFile | None
) -> Product:
    existing_product = await ProductRepository.get_by_sku(session=session, sku=data.sku)
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


async def get_all_products(
    session: AsyncSession, category_names: list[str] | None, limit: int, page: int
):
    offset = (page - 1) * limit
    total, products = await ProductRepository.get_all(
        session=session, category_names=category_names, limit=limit, offset=offset
    )
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": products,
    }


async def get_product_by_slug(session: AsyncSession, slug: str):
    product = await ProductRepository.get_by_slug(session=session, slug=slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


async def search_products(
    session: AsyncSession,
    category_names: list[str] | None,
    title: str | None,
    description: str | None,
    min_price: float | None,
    max_price: float | None,
    limit: int,
    page: int,
):

    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_price cannot be greater than max_price",
        )

    offset = (page - 1) * limit

    total, products = await ProductRepository.search(
        session=session,
        category_names=category_names,
        title=title,
        description=description,
        min_price=min_price,
        max_price=max_price,
        limit=limit,
        offset=offset,
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": products,
    }


async def update_product_by_id(
    session: AsyncSession,
    product_id: int,
    data: ProductUpdate,
    image: UploadFile | None,
) -> Product:

    product = await ProductRepository.get_by_id(
        session=session,
        product_id=product_id,
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # VALIDATE PRICE
    if data.price is not None and data.price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price must be greater than 0",
        )

    # VALIDATE STOCK
    if data.stock_quantity is not None and data.stock_quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock cannot be negative",
        )

    # UPDATE CATEGORIES
    if data.category_ids is not None:
        categories = await CategoryRepository.get_by_ids(
            session=session,
            category_ids=data.category_ids,
        )
        if len(categories) != len(data.category_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more categories not found",
            )
        product.categories = categories

    # UPDATE NORMAL FIELDS
    update_data = data.model_dump(
        exclude={"category_ids"},
        exclude_none=True,
    )

    for key, value in update_data.items():
        setattr(product, key, value)

    # UPDATE SLUG
    if data.title:
        product.slug = generate_slug(data.title)

    # IMAGE UPDATE
    if image:
        image_path = await save_upload_file(image, "products")
        product.image_url = image_path

    return await ProductRepository.save(session=session, product=product)
