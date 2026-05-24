from decimal import Decimal
from pydantic import BaseModel, Field
from typing import Literal
from src.models.payment import PaymentGatewayEnum


class PaymentCreate(BaseModel):
    amount: Decimal
    shipping_address_id: int
    gateway: Literal["mock", "razorpay"] = Field(default="mock")
    simulate_success: bool | None = None


class PaymentOut(BaseModel):
    id: int
    order_id: int
    amount: Decimal
    status: str
    is_paid: bool
    payment_gateway: PaymentGatewayEnum
    model_config = {"from_attributes": True}
