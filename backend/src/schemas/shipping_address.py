from pydantic import BaseModel, Field
from uuid import UUID

class ShippingAddressBase(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    phone_number: str = Field(min_length=10, max_length=20)
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pin_code: str
    country: str


class ShippingAddressCreate(ShippingAddressBase):
    pass


class ShippingAddressOut(ShippingAddressBase):
    id: int
    user_id: UUID
    model_config = {"from_attributes": True}
