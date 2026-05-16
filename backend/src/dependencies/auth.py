from fastapi import Depends, HTTPException, status
from src.models.user import User
from src.dependencies.current_user import get_current_user

async def require_admin(user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )
    return user
