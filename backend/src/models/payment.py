from decimal import Decimal
from enum import Enum as PyEnum
from uuid import UUID
from sqlalchemy import Boolean, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db.base import Base
from src.models.common import TimestampMixin
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.order import Order
    from src.models.user import User


class PaymentStatusEnum(str, PyEnum):
    pending = "pending"
    success = "success"
    failed = "failed"
    cancelled = "cancelled"


class PaymentGatewayEnum(str, PyEnum):
    mock = "mock"
    razorpay = "razorpay"


class Payment(TimestampMixin, Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        unique=True,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[PaymentStatusEnum] = mapped_column(
        Enum(PaymentStatusEnum),
        default=PaymentStatusEnum.pending,
        nullable=False,
        index=True,
    )
    payment_gateway: Mapped[PaymentGatewayEnum] = mapped_column(
        Enum(PaymentGatewayEnum),
        default=PaymentGatewayEnum.mock,
        nullable=False,
    )
    is_paid: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )
    # payment gateway specific fields
    pg_order_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pg_payment_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    pg_signature: Mapped[str | None] = mapped_column(String(255), nullable=True)

    order: Mapped["Order"] = relationship(
        "Order", back_populates="payment", lazy="selectin"
    )
    user: Mapped["User"] = relationship("User", back_populates="payments")
