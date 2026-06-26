from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import router
from .prediction_routes import router as prediction_router
from .user_models import User
from .audit_models import AuditLog

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Insider Threat Detection System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing Routes
app.include_router(router)

# AI Prediction Routes
app.include_router(prediction_router)