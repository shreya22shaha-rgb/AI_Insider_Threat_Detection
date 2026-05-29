from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import EmployeeActivity
from .schemas import EmployeeActivityCreate, EmployeeActivityResponse

router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Home Route
@router.get("/")
def home():
    return {"message": "AI Insider Threat Detection API Running"}

# Add Employee Activity
@router.post("/add-activity", response_model=EmployeeActivityResponse)
def add_activity(activity: EmployeeActivityCreate, db: Session = Depends(get_db)):

    new_activity = EmployeeActivity(
        employee_name=activity.employee_name,
        activity_type=activity.activity_type,
        risk_level=activity.risk_level
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity

# Get All Activities
@router.get("/activities")
def get_activities(db: Session = Depends(get_db)):

    activities = db.query(EmployeeActivity).all()

    return activities