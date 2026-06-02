from decimal import Decimal
from sqlalchemy import String, Numeric, Text
import re
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db.base import Base
from src.models.common import TimestampMixin
from src.models.product_category import product_category_table
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.category import Category
    from src.models.cart_item import CartItem
    from src.models.order_item import OrderItem


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    sku: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    stock_quantity: Mapped[int] = mapped_column(default=0)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)

    categories: Mapped[list["Category"]] = relationship(
        "Category",
        secondary=product_category_table,
        back_populates="products",
    )
    cart_items: Mapped[list["CartItem"]] = relationship(
        "CartItem", back_populates="product"
    )
    order_items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="product",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.slug and self.title:
            self.slug = (
                re.sub(r"[^a-z0-9\s-]", "", self.title.lower())
                .strip()
                .replace(" ", "-")
            )
