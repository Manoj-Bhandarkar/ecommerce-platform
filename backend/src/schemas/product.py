from decimal import Decimal
from pydantic import BaseModel, Field
from src.schemas.category import CategoryOut


class ProductBase(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str | None = None
    price: Decimal = Field(gt=0)
    stock_quantity: int = Field(ge=0)


class ProductCreate(ProductBase):
    sku: str
    category_ids: list[int] | None = []


class ProductOut(ProductBase):
    id: int
    slug: str
    sku: str
    image_url: str | None
    categories: list[CategoryOut] = []
    model_config = {"from_attributes": True}
