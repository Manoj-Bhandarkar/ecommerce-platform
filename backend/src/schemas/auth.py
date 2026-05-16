from pydantic import BaseModel, EmailStr, Field, field_validator


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str = Field(min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, value: str):
        if value.lower() == value:
            raise ValueError("Password must contain uppercase letter")
        if value.upper() == value:
            raise ValueError("Password must contain lowercase letter")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain a digit")
        if not any(char in "!@#$%^&*" for char in value):
            raise ValueError("Password must contain special character")

        return value


class PasswordResetEmailRequest(BaseModel):
    email: EmailStr


class PasswordResetRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, value: str):
        if value.lower() == value:
            raise ValueError("Password must contain uppercase letter")
        if value.upper() == value:
            raise ValueError("Password must contain lowercase letter")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain a digit")
        return value
