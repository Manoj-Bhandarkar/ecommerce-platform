from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.user import router as account_router
from src.api.auth import router as auth_router

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to the E-Commerce API"}


app.include_router(account_router, prefix="/api/v1/account", tags=["Account"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
