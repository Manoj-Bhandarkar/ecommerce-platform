"""creat cart item

Revision ID: e2e59de510ed
Revises: 0a44e5261101
Create Date: 2026-05-20 20:02:38.454245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2e59de510ed'
down_revision: Union[str, Sequence[str], None] = '0a44e5261101'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
