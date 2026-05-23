from fastapi import APIRouter, Depends
from src.core.database import SessionDep
from src.models.user import User
from src.schemas.shipping_status import ShippingStatusOut
from src.dependencies.current_user import get_current_user
from src.services.shipping_status import get_user_order_shipping_status

router = APIRouter()


@router.get("/status/{order_id}", response_model=ShippingStatusOut)
async def shipping_status_for_user_order(
    session: SessionDep,
    order_id: int,
    user: User = Depends(get_current_user),
):
    return await get_user_order_shipping_status(session, user.id, order_id)
