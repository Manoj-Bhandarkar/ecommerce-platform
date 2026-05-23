from typing import TYPE_CHECKING

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models.common import TimestampMixin
from src.db.base import Base
from src.models.product_category import product_category_table

if TYPE_CHECKING:
    from src.models.product import Product


class Category(TimestampMixin, Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    products: Mapped[list["Product"]] = relationship(
        "Product",
        secondary=product_category_table,
        back_populates="categories",
    )
