from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


class CartItemBase(BaseModel):
    product_id: int
    quantity: int


class CartItemCreate(CartItemBase):
    pass


class CartItemOut(BaseModel):
    id: int
    user_id: UUID
    product_id: int
    product_title: str
    product_slug: str | None
    product_image: str | None
    quantity: int
    price: Decimal
    total: Decimal


class CartSummary(BaseModel):
    items: list[CartItemOut]
    total_quantity: int
    total_price: Decimal

class CartMessage(BaseModel):
    message: str