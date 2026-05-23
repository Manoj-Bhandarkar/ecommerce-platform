from datetime import datetime
from pydantic import BaseModel
from src.models.shipping_status import ShippingStatusEnum


class ShippingStatusOut(BaseModel):
    id: int
    order_id: int
    status: ShippingStatusEnum
    updated_at: datetime
    model_config = {"from_attributes": True}


class ShippingStatusUpdate(BaseModel):
    status: ShippingStatusEnum
