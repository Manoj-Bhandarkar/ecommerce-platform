from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserOut(UserBase):
    id: UUID
    is_active: bool
    is_admin: bool
    is_verified: bool

    model_config = {"from_attributes": True}
