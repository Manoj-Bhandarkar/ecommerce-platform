from fastapi import FastAPI
from src.api.user import router as account_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FastAPI E-Commerce Backend")

@app.get("/")
async def root():
    return {"message": "Welcome to the E-Commerce API"}

