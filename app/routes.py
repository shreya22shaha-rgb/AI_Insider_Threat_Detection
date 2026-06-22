from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from .user_models import User
from .user_schemas import UserCreate, UserResponse, UserLogin
from fastapi.security import OAuth2PasswordRequestForm
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_role
)

from .database import SessionLocal
from .models import EmployeeActivity
from .audit_models import AuditLog
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

def get_activities(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
   ):
    
    require_role(
    current_user,
    ["Admin", "Analyst"]
    )

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

@router.get("/dynamic-risk-score")
def dynamic_risk_score(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    risk_weights = {
        "USB File Transfer": 15,
        "Admin Privilege Change": 20,
        "Multiple Failed Login": 10,
        "File Download": 5,
        "Email Access": 2,
        "System Login": 1
    }

    employee_scores = {}

    for activity in activities:

        score = risk_weights.get(
            activity.activity_type,
            1
        )

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

@router.get("/threat-alerts")
def threat_alerts(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    risk_weights = {
        "USB File Transfer": 15,
        "Admin Privilege Change": 20,
        "Multiple Failed Login": 10,
        "File Download": 5,
        "Email Access": 2,
        "System Login": 1
    }

    employee_scores = {}

    for activity in activities:

        score = risk_weights.get(
            activity.activity_type,
            1
        )

        if activity.employee_name not in employee_scores:
            employee_scores[activity.employee_name] = 0

        employee_scores[activity.employee_name] += score

    result = []

    for employee, score in employee_scores.items():

        if score > 50:
            threat_level = "Critical"

        elif score >= 31:
            threat_level = "High"

        elif score >= 10:
            threat_level = "Medium"

        else:
            threat_level = "Low"

        result.append({
            "employee_name": employee,
            "risk_score": score,
            "threat_level": threat_level
        })

    result.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    return result

@router.get("/security-summary")
def security_summary(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    risk_weights = {
        "USB File Transfer": 15,
        "Admin Privilege Change": 20,
        "Multiple Failed Login": 10,
        "File Download": 5,
        "Email Access": 2,
        "System Login": 1
    }

    employee_scores = {}

    for activity in activities:

        score = risk_weights.get(
            activity.activity_type,
            1
        )

        if activity.employee_name not in employee_scores:
            employee_scores[activity.employee_name] = 0

        employee_scores[activity.employee_name] += score

    high_risk_users = 0
    critical_users = 0

    for score in employee_scores.values():

        if score > 50:
            critical_users += 1

        elif score >= 31:
            high_risk_users += 1

    return {
        "total_users": len(employee_scores),
        "high_risk_users": high_risk_users,
        "critical_users": critical_users,
        "alerts_generated": len(
            [
                a for a in activities
                if a.risk_level == "High"
            ]
        )
    }

@router.get("/failed-login-alerts")
def failed_login_alerts(
    db: Session = Depends(get_db)
):

    failed_logins = (
        db.query(
            AuditLog.username,
            func.count(AuditLog.id).label("failed_attempts")
        )
        .filter(
            AuditLog.action == "LOGIN_FAILED"
        )
        .group_by(
            AuditLog.username
        )
        .all()
    )

    alerts = []

    for user in failed_logins:

        if user.failed_attempts >= 3:

            alerts.append({
                "username": user.username,
                "failed_attempts": user.failed_attempts,
                "alert": "Suspicious Login Activity"
            })

    return alerts

@router.get("/insider-threat-rules")
def insider_threat_rules(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    employee_activity_count = {}

    alerts = []

    for activity in activities:

        employee = activity.employee_name
        activity_type = activity.activity_type

        if employee not in employee_activity_count:

            employee_activity_count[employee] = {
                "USB File Transfer": 0,
                "File Download": 0,
                "Admin Privilege Change": 0
            }

        if activity_type in employee_activity_count[employee]:

            employee_activity_count[employee][activity_type] += 1

    for employee, counts in employee_activity_count.items():

        if counts["USB File Transfer"] >= 3:

            alerts.append({
                "employee_name": employee,
                "rule_triggered": "Excessive USB Activity"
            })

        if counts["File Download"] >= 5:

            alerts.append({
                "employee_name": employee,
                "rule_triggered": "Mass File Download Detected"
            })

        if counts["Admin Privilege Change"] >= 2:

            alerts.append({
                "employee_name": employee,
                "rule_triggered": "Privilege Escalation Abuse"
            })

    return alerts

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

@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    require_role(
    current_user,
    ["Admin"]
    )
    
    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    audit_log = AuditLog(
      username=current_user["username"],
      action="USER_REGISTERED"
   )

    db.add(audit_log)
    db.commit()

    return new_user

@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.username == form_data.username)
        .first()
    )

    if not db_user:

        audit_log = AuditLog(
            username=form_data.username,
            action="LOGIN_FAILED"
        )

        db.add(audit_log)
        db.commit()

        return {
            "message": "User not found"
        }

    if not verify_password(
        form_data.password,
        db_user.password
    ):

        audit_log = AuditLog(
            username=db_user.username,
            action="LOGIN_FAILED"
        )

        db.add(audit_log)
        db.commit()

        return {
            "message": "Invalid password"
        }

    access_token = create_access_token(
        {
            "sub": db_user.username,
            "role": db_user.role
        }
    )

    audit_log = AuditLog(
        username=db_user.username,
        action="LOGIN_SUCCESS"
    )

    db.add(audit_log)
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/test-token")
def test_token(
    current_user = Depends(get_current_user)
):
    return {
        "logged_in_user": current_user
    }

@router.get("/audit-logs")
def get_audit_logs(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    require_role(
    current_user,
    ["Admin"]
    )

    logs = (
        db.query(AuditLog)
        .order_by(AuditLog.id.desc())
        .all()
    )

    return logs