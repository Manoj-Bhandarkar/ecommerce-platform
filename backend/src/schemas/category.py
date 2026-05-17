from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(min_length=2,max_length=50,)


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    slug: str
    model_config = {"from_attributes": True}
