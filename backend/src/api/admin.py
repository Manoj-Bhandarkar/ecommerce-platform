from fastapi import APIRouter, Depends
from src.dependencies.auth import require_admin
from src.models.user import User

router = APIRouter()


@router.get("/dashboard")
async def admin_dashboard(user: User = Depends(require_admin)):
    return {"message": f"Welcome Admin {user.email}"}
