from fastapi import APIRouter, Depends
from src.core.database import SessionDep
from src.models.user import User
from src.dependencies.current_user import get_current_user
from src.schemas.shipping_address import (
    ShippingAddressOut,
    ShippingAddressCreate,
    ShippingAddressUpdate,
)
from src.services.shipping_address import (
    create_shipping_address,
    get_user_shipping_address_by_address_id,
    list_user_shipping_addresses,
    update_user_shipping_address_by_address_id,
)

router = APIRouter()


@router.post("/address", response_model=ShippingAddressOut)
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


@router.get("/address", response_model=list[ShippingAddressOut])
async def shipping_addresses_user_list(
    session: SessionDep,
    user: User = Depends(get_current_user),
):
    return await list_user_shipping_addresses(
        session=session,
        user_id=user.id,
    )


@router.get("/address/{address_id}", response_model=ShippingAddressOut)
async def shipping_address_user_by_address_id(
    session: SessionDep,
    address_id: int,
    user: User = Depends(get_current_user),
):
    return await get_user_shipping_address_by_address_id(
        session=session,
        address_id=address_id,
        user_id=user.id,
    )


@router.patch(
    "/addresses/{address_id}",
    response_model=ShippingAddressOut,
)
async def user_shipping_address_update_by_address_id(
    session: SessionDep,
    address_id: int,
    data: ShippingAddressUpdate,
    user: User = Depends(get_current_user),
):
    return await update_user_shipping_address_by_address_id(
        session=session,
        address_id=address_id,
        user_id=user.id,
        data=data,
    )
