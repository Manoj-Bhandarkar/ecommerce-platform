from typing import Annotated
from fastapi import APIRouter, Depends, File, Form, UploadFile
from src.core.database import SessionDep
from src.models.user import User
from src.schemas.product import ProductCreate, ProductOut
from src.services.product import create_product
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
