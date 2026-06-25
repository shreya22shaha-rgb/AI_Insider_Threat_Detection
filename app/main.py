from fastapi import FastAPI
from .database import engine, Base
from .routes import router
from .prediction_routes import router as prediction_router
from .user_models import User
from .audit_models import AuditLog

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Insider Threat Detection System")

# Include Routes
app.include_router(router)

# AI Prediction Routes
app.include_router(prediction_router)