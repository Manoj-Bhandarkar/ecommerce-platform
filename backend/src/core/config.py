from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_USER: str
    DB_PASS: str

    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    PROJECT_NAME: str = "FastAPI E-Commerce Backend"
    API_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://store.manojbhandarkar.cloud"]

    EMAIL_VERIFICATION_TOKEN_TIME_HOUR: int
    EMAIL_PASSWORD_RESET_TOKEN_TIME_HOUR: int
    FRONTEND_URL: str

    RAZORPAY_KEY: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_CALLBACK_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
