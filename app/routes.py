from fastapi import APIRouter
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import EmployeeActivity

router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def home():
    return {"message": "AI Insider Threat Detection API Running"}