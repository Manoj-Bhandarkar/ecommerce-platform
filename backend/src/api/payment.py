from fastapi import APIRouter, Depends
from src.dependencies.current_user import get_current_user
from src.models.user import User
from src.core.database import SessionDep
from src.services.payment import get_payment_by_order_id
from src.schemas.payment import PaymentOut

router = APIRouter()


@router.get("/{order_id}", response_model=PaymentOut)
async def get_payment_status_by_order(
    session: SessionDep,
    order_id: int,
    user: User = Depends(get_current_user),
):
    return await get_payment_by_order_id(session, order_id, user.id)
