from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
)

async def send_email(subject: str, recipients: list[str], body: str):
    message = MessageSchema(
        subject=subject, recipients=recipients, body=body, subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
