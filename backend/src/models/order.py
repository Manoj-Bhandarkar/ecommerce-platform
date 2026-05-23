from decimal import Decimal
from uuid import UUID
from sqlalchemy import Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum
from src.models.common import TimestampMixin
from src.db.base import Base
import enum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.shipping_address import ShippingAddress, ShippingStatus
    from src.models.payment import Payment
    from src.models.user import User
    from src.models.order_item import OrderItem


class OrderStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class Order(TimestampMixin, Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    total_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[OrderStatusEnum] = mapped_column(
        Enum(OrderStatusEnum), default=OrderStatusEnum.pending, nullable=False
    )
    shipping_address_id: Mapped[int] = mapped_column(
        ForeignKey("shipping_addresses.id"), nullable=False
    )

    order_items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    shipping_address: Mapped["ShippingAddress"] = relationship(
        "ShippingAddress", back_populates="orders", lazy="selectin"
    )
    shipping_status: Mapped["ShippingStatus"] = relationship(
        "ShippingStatus",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    user: Mapped["User"] = relationship("User", back_populates="orders")
    payment: Mapped["Payment | None"] = relationship(
        "Payment",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="selectin",
    )
