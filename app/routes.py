from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import EmployeeActivity
from .schemas import EmployeeActivityCreate, EmployeeActivityResponse

router = APIRouter()

def calculate_risk(activity_type):

    risk_mapping = {
        "USB File Transfer": "High",
        "Admin Privilege Change": "High",
        "Multiple Failed Login": "Medium",
        "File Download": "Medium",
        "Email Access": "Low",
        "System Login": "Low"
    }

    return risk_mapping.get(activity_type, "Low")
def generate_alert(risk_level):

    if risk_level == "High":
        return "Suspicious Activity Detected"

    elif risk_level == "Medium":
        return "Review Recommended"

    else:
        return "Normal Activity"
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

    risk_level = calculate_risk(activity.activity_type)

    new_activity = EmployeeActivity(
     employee_name=activity.employee_name,
     activity_type=activity.activity_type,
     risk_level=risk_level
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
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):

    activities = db.query(EmployeeActivity).all()

    alerts = []

    for activity in activities:

        alert_message = generate_alert(activity.risk_level)

        alerts.append({
            "employee_name": activity.employee_name,
            "activity_type": activity.activity_type,
            "risk_level": activity.risk_level,
            "alert": alert_message
        })

    return alerts

@router.get("/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):

    activities = db.query(EmployeeActivity).all()

    total_activities = len(activities)

    high_risk = len(
        [a for a in activities if a.risk_level == "High"]
    )

    medium_risk = len(
        [a for a in activities if a.risk_level == "Medium"]
    )

    low_risk = len(
        [a for a in activities if a.risk_level == "Low"]
    )

    return {
        "total_activities": total_activities,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk
    }