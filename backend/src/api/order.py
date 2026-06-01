from fastapi import APIRouter, Depends
from src.dependencies.current_user import get_current_user
from src.dependencies.auth import require_admin
from src.models.user import User
from src.core.database import SessionDep
from src.schemas.order import OrderOut
from src.services.order import (
    cancel_order,
    checkout,
    get_order_by_id,
    get_placed_order_for_user,
    all_placed_order
)
from src.schemas.payment import PaymentCreate

router = APIRouter()


@router.post("/checkout", response_model=OrderOut)
async def checkout_order(
    session: SessionDep,
    payment_data: PaymentCreate,
    user: User = Depends(get_current_user),
):
    return await checkout(session, user.id, payment_data)


@router.get("", response_model=list[OrderOut])
async def get_user_order_list(
    session: SessionDep, user: User = Depends(get_current_user)
):
    return await get_placed_order_for_user(session, user.id)


@router.get("/{order_id}", response_model=OrderOut)
async def get_user_order_by_id(
    session: SessionDep,
    order_id: int,
    user: User = Depends(get_current_user),
):
    return await get_order_by_id(session, user.id, order_id)


@router.patch("/cancel/{order_id}", response_model=OrderOut)
async def order_cancel(
    session: SessionDep, order_id: int, user: User = Depends(get_current_user)
):
    return await cancel_order(session, user.id, order_id)


@router.get("/admin/all", response_model=list[OrderOut])
async def all_order_list(
    session: SessionDep,
    user: User = Depends(require_admin),
    shipping_status: str | None = None,
    user_id: int | None = None,
):
    return await all_placed_order(
        session, shipping_status=shipping_status, user_id=user_id
    )
