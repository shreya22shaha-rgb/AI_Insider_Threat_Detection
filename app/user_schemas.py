from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

    # -----------------------------
# Forgot Password
# -----------------------------

class ForgotPasswordRequest(BaseModel):

    username_or_email: str


# -----------------------------
# Reset Password
# -----------------------------

class ResetPasswordRequest(BaseModel):

    token: str

    new_password: str