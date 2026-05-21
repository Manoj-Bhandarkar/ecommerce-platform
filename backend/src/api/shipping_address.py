from fastapi import APIRouter, Depends
from src.core.database import SessionDep
from src.models.user import User
from src.dependencies.current_user import get_current_user
from src.schemas.shipping_address import ShippingAddressOut, ShippingAddressCreate
from src.services.shipping_address import create_shipping_address

router = APIRouter()


@router.post("/addresses", response_model=ShippingAddressOut)
async def shipping_address_create(
    session: SessionDep,
    data: ShippingAddressCreate,
    user: User = Depends(get_current_user),
):
    return await create_shipping_address(
        session=session,
        user_id=user.id,
        data=data,
    )
