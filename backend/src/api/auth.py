from fastapi import APIRouter
from fastapi.responses import JSONResponse
from src.core.database import SessionDep
from src.schemas.auth import UserLogin
from src.services.auth import login_user

router = APIRouter()


@router.post("/login")
async def login(session: SessionDep, user_login: UserLogin):
    tokens = await login_user(session=session, user_login=user_login)
    response = JSONResponse(content={"message": "Login successful"})

    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 30,
    )

    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    return response
