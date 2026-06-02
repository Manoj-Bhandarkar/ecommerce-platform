from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(min_length=2,max_length=50,)


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    slug: str
    products_count: int | None = 0
    model_config = {"from_attributes": True}
