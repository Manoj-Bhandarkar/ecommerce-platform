from fastapi import APIRouter, Depends
from src.dependencies.current_user import get_current_user
from src.models.user import User
from src.core.database import SessionDep
from src.schemas.order import OrderOut
from src.services.order import checkout, get_placed_order_for_user
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
