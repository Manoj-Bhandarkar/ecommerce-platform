from fastapi import APIRouter, Depends, HTTPException, status
from src.dependencies.current_user import get_current_user
from src.models.user import User
from src.core.database import SessionDep
from src.services.payment import get_payment_by_order_id, handle_razorpay_callback, list_payments_by_user
from src.schemas.payment import PaymentOut, RazorpayCallback

router = APIRouter()


@router.get("/{order_id}", response_model=PaymentOut)
async def get_payment_status_by_order(
    session: SessionDep,
    order_id: int,
    user: User = Depends(get_current_user),
):
    payment = await get_payment_by_order_id(session, order_id, user.id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    return payment


@router.get("", response_model=list[PaymentOut])
async def get_all_payments_by_user(
    session: SessionDep, user: User = Depends(get_current_user)
):
    return await list_payments_by_user(session, user.id)

@router.post("/razorpay-callback")
async def razorpay_callback(
    session: SessionDep, payload: RazorpayCallback
):
    return await handle_razorpay_callback(session, payload)
    