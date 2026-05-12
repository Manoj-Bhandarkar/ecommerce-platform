from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from src.db.base import Base
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from src.models.common import TimestampMixin

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from src.models.user import User
    
class RefreshToken(TimestampMixin, Base):
    __tablename__ = "refresh_token"

    id: Mapped[int] = mapped_column(UUID(as_uuid=True),primary_key=True, default=uuid4)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    token: Mapped[str] = mapped_column(String(500), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="refresh_tokens")
