from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from src.core.database import SessionDep
from src.dependencies.auth import require_admin
from src.models.user import User
from src.models.product import Product
from src.models.order import Order

router = APIRouter()


@router.get("/dashboard")
async def admin_dashboard(user: User = Depends(require_admin)):
    return {"message": f"Welcome Admin {user.email}"}


@router.get("/stats")
async def get_dashboard_stats(
    session: SessionDep,
    user: User = Depends(require_admin),
):
    total_products = await session.scalar(select(func.count(Product.id)))
    total_orders = await session.scalar(select(func.count(Order.id)))
    total_users = await session.scalar(select(func.count(User.id)))
    revenue = (
        await session.execute(
            select(func.coalesce(func.sum(Order.total_price), 0)).where(
                Order.status != "cancelled"
            )
        )
    ).scalar()
    low_stock_count = await session.scalar(
        select(func.count(Product.id)).where(Product.stock_quantity <= 5)
    )
    recent_orders = (
        (
            await session.execute(
                select(Order).order_by(Order.created_at.desc()).limit(5)
            )
        )
        .scalars()
        .all()
    )
    pending_orders = (
        await session.execute(
            select(func.count(Order.id)).where(
                Order.shipping_status.has(status="pending")
            )
        )
    ).scalar()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "revenue": revenue,
        "low_stock_count": low_stock_count,
        "recent_orders": [
            {
                "id": order.id,
                "total_price": order.total_price,
                "status": order.shipping_status.status,
                "created_at": order.created_at.isoformat(),
            }
            for order in recent_orders
        ],
        "pending_orders": pending_orders,
    }
