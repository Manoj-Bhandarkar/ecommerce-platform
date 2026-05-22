import enum
from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models.common import TimestampMixin
from src.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.order import Order


class ShippingStatusEnum(str, enum.Enum):
    pending = "pending"
    packed = "packed"
    shipped = "shipped"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    cancelled = "cancelled"


class ShippingStatus(TimestampMixin, Base):
    __tablename__ = "shipping_statuses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    status: Mapped[ShippingStatusEnum] = mapped_column(
        Enum(ShippingStatusEnum),
        default=ShippingStatusEnum.pending,
        nullable=False,
    )

    order: Mapped["Order"] = relationship(back_populates="shipping_status")
