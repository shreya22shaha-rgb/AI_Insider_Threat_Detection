from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

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

@router.get("/high-risk-activities")

def get_high_risk_activities(db: Session = Depends(get_db)):

    high_risk_activities = (
        db.query(EmployeeActivity)
        .filter(EmployeeActivity.risk_level == "High")
        .all()
    )

    return high_risk_activities 

@router.get("/employee/{employee_name}")

def get_employee_activities(
    employee_name: str,
    db: Session = Depends(get_db)
):

    activities = (
        db.query(EmployeeActivity)
        .filter(
            EmployeeActivity.employee_name == employee_name
        )
        .all()
    )

    return activities

@router.get("/top-risky-employees")

def top_risky_employees(db: Session = Depends(get_db)):

    risky_employees = (
        db.query(
            EmployeeActivity.employee_name,
            func.count(EmployeeActivity.id).label("high_risk_count")
        )
        .filter(EmployeeActivity.risk_level == "High")
        .group_by(EmployeeActivity.employee_name)
        .order_by(
            func.count(EmployeeActivity.id).desc()
        )
        .all()
    )

    result = []

    for employee in risky_employees:
        result.append({
            "employee_name": employee.employee_name,
            "high_risk_count": employee.high_risk_count
        })

    return result

@router.get("/recent-alerts")
def recent_alerts(db: Session = Depends(get_db)):

    alerts = (
        db.query(EmployeeActivity)
        .filter(EmployeeActivity.risk_level == "High")
        .order_by(EmployeeActivity.timestamp.desc())
        .all()
    )

    return alerts


@router.get("/employee-risk-score")

def employee_risk_score(db: Session = Depends(get_db)):

    activities = db.query(EmployeeActivity).all()

    employee_scores = {}

    for activity in activities:

        if activity.risk_level == "High":
            score = 10

        elif activity.risk_level == "Medium":
            score = 5

        else:
            score = 1

        if activity.employee_name not in employee_scores:
            employee_scores[activity.employee_name] = 0

        employee_scores[activity.employee_name] += score

    result = []

    for employee, score in employee_scores.items():
        result.append({
            "employee_name": employee,
            "risk_score": score
        })

    result.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    return result

@router.get("/activities-by-date")

def activities_by_date(
    selected_date: date,
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    result = []

    for activity in activities:

        if activity.timestamp.date() == selected_date:

            result.append(activity)

    return result

@router.get("/employee-timeline/{employee_name}")
def employee_timeline(
    employee_name: str,
    db: Session = Depends(get_db)
):

    activities = (
        db.query(EmployeeActivity)
        .filter(
            EmployeeActivity.employee_name == employee_name
        )
        .order_by(EmployeeActivity.timestamp.asc())
        .all()
    )

    return activities