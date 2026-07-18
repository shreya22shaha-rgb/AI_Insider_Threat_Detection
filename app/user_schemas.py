from pydantic import BaseModel, Field, EmailStr, field_validator


# ---------------------------------
# User Registration
# ---------------------------------

class UserCreate(BaseModel):

    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(..., min_length=3, max_length=30)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Username cannot be empty.")

        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Role cannot be empty.")

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        value = value.strip()

        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        return value


# ---------------------------------
# User Response
# ---------------------------------

class UserResponse(BaseModel):

    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


# ---------------------------------
# Login
# ---------------------------------

class UserLogin(BaseModel):

    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Username cannot be empty.")

        return value


# ---------------------------------
# Forgot Password
# ---------------------------------

class ForgotPasswordRequest(BaseModel):

    username_or_email: str = Field(..., min_length=3, max_length=100)

    @field_validator("username_or_email")
    @classmethod
    def validate_username_or_email(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Username or Email cannot be empty.")

        return value


# ---------------------------------
# Reset Password
# ---------------------------------

class ResetPasswordRequest(BaseModel):

    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=8, max_length=100)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value):

        value = value.strip()

        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        return value