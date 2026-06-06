from src.celery_app import celery_app
from src.core.security import create_email_verification_token
from src.core.config import settings
import asyncio
from src.core.email import send_email


@celery_app.task
def send_welcome_email_task(user_id: str, email: str):
    print("TASK RECEIVED")
    token = create_email_verification_token(user_id)
    verification_link = (f"{settings.FRONTEND_URL}/verify-email?token={token}")

    asyncio.run(
        send_email(
            subject="Welcome to E-Commerce",
            recipients=[email],
            body=f"""
        <h1>Welcome to Our Store 🎉</h1>
        <p>Your account has been created successfully.</p>
        <p>Please verify your email address by clicking below:</p>
        <a href="{verification_link}">Verify Email</a><br><br>
        <p>Thank you for joining us.</p>
        """,
        )
    )
    
