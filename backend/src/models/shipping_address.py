from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models.common import TimestampMixin
from src.db.base import Base
from uuid import UUID
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.user import User
    from src.models.order import Order


class ShippingAddress(TimestampMixin, Base):
    __tablename__ = "shipping_addresses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[str | None] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pin_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="shipping_addresses")
    orders: Mapped[list["Order"]] = relationship(
        "Order",
        back_populates="shipping_address",
    )
