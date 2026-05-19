from typing import Annotated
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from src.core.database import SessionDep
from src.models.user import User
from src.schemas.product import ProductCreate, ProductOut, PaginatedProductOut
from src.services.product import create_product, get_all_products
from src.dependencies.auth import require_admin
from decimal import Decimal

router = APIRouter()


@router.post("/", response_model=ProductOut)
async def product_create(
    session: SessionDep,
    title: str = Form(...),
    description: str | None = Form(None),
    sku: str = Form(...),
    price: Decimal = Form(...),
    stock_quantity: int = Form(...),
    category_ids: Annotated[list[int], Form()] = [],
    image: UploadFile | None = File(None),
    admin_user: User = Depends(require_admin),
):

    data = ProductCreate(
        title=title,
        description=description,
        sku=sku,
        price=price,
        stock_quantity=stock_quantity,
        category_ids=category_ids,
    )

    return await create_product(session=session, data=data, image=image)

@router.get("", response_model=PaginatedProductOut)
async def list_products(
    session: SessionDep,
    categories: list[str] | None = Query(default=None),
    limit: int = Query(default=5, ge=1, le=100),
    page: int = Query(default=1, ge=1),
):
    return await get_all_products(session, categories, limit, page)