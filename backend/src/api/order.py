from fastapi import APIRouter, Depends
from src.dependencies.current_user import get_current_user
from src.models.user import User
from src.core.database import SessionDep
from src.schemas.order import OrderOut
from src.services.order import checkout
from src.schemas.payment import PaymentCreate

router = APIRouter()


@router.post("/checkout", response_model=OrderOut)
async def checkout_order(
    session: SessionDep,
    payment_data: PaymentCreate,
    user: User = Depends(get_current_user),
):
    return await checkout(session, user.id, payment_data)
