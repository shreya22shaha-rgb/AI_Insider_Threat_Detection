from fastapi import FastAPI
from .database import engine, Base
from .routes import router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Insider Threat Detection System")

# Include Routes
app.include_router(router)