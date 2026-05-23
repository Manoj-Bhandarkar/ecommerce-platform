from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.user import router as account_router
from src.api.auth import router as auth_router
from src.api.admin import router as admin_router
from src.api.categories import router as category_router
from src.api.product import router as product_router
from src.api.cart_item import router as cart_item_router
from src.api.shipping_address import router as shipping_address_router
from src.api.order import router as order_router
from src.api.shipping_status import router as shipping_status_router


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


app.include_router(
    account_router, prefix=f"{settings.API_PREFIX}/account", tags=["Account"]
)
app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["Auth"])
app.include_router(admin_router, prefix=f"{settings.API_PREFIX}/admin", tags=["Admin"])
app.include_router(category_router, prefix=f"{settings.API_PREFIX}/categories", tags=["Categories"])
app.include_router(product_router, prefix=f"{settings.API_PREFIX}/product", tags=["Products"])
app.include_router(cart_item_router, prefix=f"{settings.API_PREFIX}/cart", tags=["Cart"])
app.include_router(shipping_address_router, prefix=f"{settings.API_PREFIX}/shipping", tags=["Shipping"])
app.include_router(shipping_status_router, prefix=f"{settings.API_PREFIX}/shipping/status", tags=["Shipping Status"])
app.include_router(order_router, prefix=f"{settings.API_PREFIX}/order", tags=["Order"])