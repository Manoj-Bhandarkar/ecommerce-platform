from fastapi import APIRouter, Depends, status

from src.core.database import SessionDep
from src.dependencies.current_user import get_current_user
from src.models.user import User
from src.schemas.cart_item import CartItemCreate, CartItemOut, CartMessage, CartSummary
from src.services.cart_item import (
    add_to_cart,
    change_cart_item_quantity_by_product,
    delete_cart_item,
    list_user_cart,
)

router = APIRouter()


@router.post("/add", response_model=CartItemOut)
async def add_item_to_cart(
    session: SessionDep, item: CartItemCreate, user: User = Depends(get_current_user)
):
    return await add_to_cart(session, item, user.id)


@router.get("/", response_model=CartSummary)
async def list_user_cart_item(
    session: SessionDep, user: User = Depends(get_current_user)
):
    return await list_user_cart(session=session, user_id=user.id)


@router.patch("/increase/{product_id}", response_model=CartItemOut)
async def increase_quantity_by_product(
    session: SessionDep,
    product_id: int,
    user: User = Depends(get_current_user),
):
    return await change_cart_item_quantity_by_product(
        session=session,
        product_id=product_id,
        user_id=user.id,
        delta=1,
    )


@router.patch("/decrease/{product_id}", response_model=CartItemOut | CartMessage)
async def decrease_quantity_by_product(
    session: SessionDep,
    product_id: int,
    user: User = Depends(get_current_user),
):
    return await change_cart_item_quantity_by_product(
        session=session,
        product_id=product_id,
        user_id=user.id,
        delta=-1,
    )


@router.delete(
    "/delete/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def cart_item_delete(
    session: SessionDep,
    item_id: int,
    user: User = Depends(get_current_user),
):
    await delete_cart_item(
        session=session,
        cart_item_id=item_id,
        user_id=user.id,
    )
