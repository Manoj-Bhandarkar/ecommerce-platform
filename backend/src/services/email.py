from src.core.email import send_email
from src.core.security import create_email_verification_token
from src.core.config import settings
from src.models.user import User


async def send_welcome_verification_email(user: User):
    token = create_email_verification_token(user.id)
    verification_link = f"{settings.FRONTEND_URL}" f"/verify-email?token={token}"

    await send_email(
        subject="Welcome to E-Commerce",
        recipients=[user.email],
        body=f"""
        <h1>Welcome to Our Store 🎉</h1>
        <p>Your account has been created successfully.</p>
        <p>Please verify your email address by clicking below:</p>
        <a href="{verification_link}">Verify Email</a><br><br>
        <p>Thank you for joining us.</p>
        """,
    )
