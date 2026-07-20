from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import date, datetime, timedelta
from .user_models import User
from app.logger import logger
from .user_schemas import (
    UserCreate,
    UserResponse,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from fastapi.security import OAuth2PasswordRequestForm

from .database import SessionLocal
from .models import EmployeeActivity
from .audit_models import AuditLog
from .schemas import EmployeeActivityCreate, EmployeeActivityResponse
import secrets

from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_role
)

from .ai_engine import (
    calculate_risk_score,
    calculate_activity_breakdown,
    generate_recommendations,
    detect_behavior_anomaly,
    predict_future_threat,
    calculate_security_health,
    generate_executive_summary,
    group_activities_by_employee,
    get_risk_level
)

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
    logger.info("Backend started successfully.")
    return {
        "message": "AI Insider Threat Detection API Running"
    }

# Add Employee Activity
@router.post("/add-activity", response_model=EmployeeActivityResponse)
def add_activity(
    activity: EmployeeActivityCreate,
    db: Session = Depends(get_db)
):

    risk_level = calculate_risk(activity.activity_type)

    new_activity = EmployeeActivity(
        employee_name=activity.employee_name,
        activity_type=activity.activity_type,
        risk_level=risk_level
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    # Log activity
    logger.info(
        f"Activity '{activity.activity_type}' added for employee '{activity.employee_name}'."
    )

    audit_log = AuditLog(
        username=activity.employee_name,
        action=f"Activity created: {activity.activity_type}"
    )

    db.add(audit_log)

    # Log High Risk Activities
    if risk_level == "High":

        logger.warning(
            f"High-risk activity detected for employee '{activity.employee_name}' "
            f"({activity.activity_type})."
        )

        high_risk_audit = AuditLog(
            username=activity.employee_name,
            action=f"High-risk activity detected: {activity.activity_type}"
        )

        db.add(high_risk_audit)

    db.commit()

    return new_activity

# Get All Activities
@router.get("/activities")
def get_activities(
    page: int = 1,
    limit: int = 10,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    require_role(
        current_user,
        ["Admin", "Analyst"]
    )

    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page number must be greater than 0."
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100."
        )

    total_records = db.query(EmployeeActivity).count()

    total_pages = (
        total_records + limit - 1
    ) // limit

    activities = (
        db.query(EmployeeActivity)
        .order_by(EmployeeActivity.timestamp.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": total_pages,
        "data": activities
    }

@router.get("/activities/search")
def search_activities(
    employee_name: str = None,
    activity_type: str = None,
    risk_level: str = None,
    page: int = 1,
    limit: int = 10,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    require_role(
        current_user,
        ["Admin", "Analyst"]
    )

    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page number must be greater than 0."
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100."
        )

    query = db.query(EmployeeActivity)

    if employee_name:
        query = query.filter(
            EmployeeActivity.employee_name.ilike(f"%{employee_name}%")
        )

    if activity_type:
        query = query.filter(
            EmployeeActivity.activity_type.ilike(f"%{activity_type}%")
        )

    if risk_level:
        query = query.filter(
            EmployeeActivity.risk_level.ilike(f"%{risk_level}%")
        )

    total_records = query.count()

    total_pages = (
        total_records + limit - 1
    ) // limit

    activities = (
        query.order_by(EmployeeActivity.timestamp.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": total_pages,
        "data": activities
    }

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

from sqlalchemy import func


@router.get("/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):

    total_activities = db.query(EmployeeActivity).count()

    high_risk = (
        db.query(EmployeeActivity)
        .filter(EmployeeActivity.risk_level == "High")
        .count()
    )

    medium_risk = (
        db.query(EmployeeActivity)
        .filter(EmployeeActivity.risk_level == "Medium")
        .count()
    )

    low_risk = (
        db.query(EmployeeActivity)
        .filter(EmployeeActivity.risk_level == "Low")
        .count()
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

    risk_scores = (
        db.query(
            EmployeeActivity.employee_name,
            func.sum(
                case(
                    (EmployeeActivity.risk_level == "High", 10),
                    (EmployeeActivity.risk_level == "Medium", 5),
                    else_=1
                )
            ).label("risk_score")
        )
        .group_by(EmployeeActivity.employee_name)
        .order_by(
            func.sum(
                case(
                    (EmployeeActivity.risk_level == "High", 10),
                    (EmployeeActivity.risk_level == "Medium", 5),
                    else_=1
                )
            ).desc()
        )
        .all()
    )

    return [
        {
            "employee_name": employee.employee_name,
            "risk_score": employee.risk_score
        }
        for employee in risk_scores
    ]

@router.get("/dynamic-risk-score")
def dynamic_risk_score(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    employee_activities = group_activities_by_employee(
        activities
    )

    result = []

    for employee, activity_list in employee_activities.items():

        score = calculate_risk_score(
            activity_list
        )

        level = get_risk_level(
            score
        )

        breakdown = calculate_activity_breakdown(
            activity_list
        )

        recommendations = generate_recommendations(
            level,
            activity_list
        )

        anomaly = detect_behavior_anomaly(
            score,
            breakdown
        )

        prediction = predict_future_threat(
            score
        )

        result.append({

            "employee_name": employee,

            "risk_score": score,

            "risk_level": level,

            "contributing_activities": breakdown,

            "recommendations": recommendations,

            "behavior_analysis": anomaly,

            "future_prediction": prediction

        })

    result.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    return result


@router.get("/security-health-score")
def security_health_score(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    employee_activities = group_activities_by_employee(
        activities
    )

    employee_results = []

    for employee, activity_list in employee_activities.items():

        score = calculate_risk_score(
            activity_list
        )

        level = get_risk_level(
            score
        )

        employee_results.append({
            "employee_name": employee,
            "risk_level": level
        })

    health = calculate_security_health(
        employee_results
    )

    return health

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
    logger.info(
        f"Admin '{current_user['username']}' registered new user '{new_user.username}' with role '{new_user.role}'."
    )

    audit_log = AuditLog(
      username=current_user["username"],
      action=f"Registered user '{new_user.username}' with role '{new_user.role}'"
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

    # User not found
    if not db_user:

        logger.warning(
            f"Login failed - user '{form_data.username}' does not exist."
        )

        audit_log = AuditLog(
            username=form_data.username,
            action="LOGIN_FAILED"
        )

        db.add(audit_log)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Wrong password
    if not verify_password(
        form_data.password,
        db_user.password
    ):

        logger.warning(
            f"Login failed - invalid password for user '{db_user.username}'."
        )

        audit_log = AuditLog(
            username=db_user.username,
            action="LOGIN_FAILED"
        )

        db.add(audit_log)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    # Generate JWT token
    access_token = create_access_token(
        {
            "sub": db_user.username,
            "role": db_user.role
        }
    )

    # Log successful login
    logger.info(
        f"User '{db_user.username}' logged in successfully."
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


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            (User.username == request.username_or_email) |
            (User.email == request.username_or_email)
        )
        .first()
    )

    # User not found
    if not user:

        logger.warning(
            f"Password reset requested for unknown user '{request.username_or_email}'."
        )

        audit_log = AuditLog(
            username=request.username_or_email,
            action="FORGOT_PASSWORD_FAILED"
        )

        db.add(audit_log)
        db.commit()

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)

    expiry = datetime.utcnow() + timedelta(minutes=15)

    user.reset_token = reset_token
    user.reset_token_expiry = expiry

    db.commit()

    # Log successful password reset request
    logger.info(
        f"Password reset token generated for user '{user.username}'."
    )

    audit_log = AuditLog(
        username=user.username,
        action="Password reset token generated"
    )

    db.add(audit_log)
    db.commit()

    return {
        "message": "Password reset token generated successfully.",
        "reset_token": reset_token,
        "expires_at": expiry
    }

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.reset_token == request.token)
        .first()
    )

    # Invalid token
    if not user:

        logger.warning(
            f"Password reset failed - invalid reset token used."
        )

        audit_log = AuditLog(
            username="UNKNOWN",
            action="PASSWORD_RESET_FAILED"
        )

        db.add(audit_log)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid reset token"
        )

    # Expired token
    if (
        user.reset_token_expiry is None
        or user.reset_token_expiry < datetime.utcnow()
    ):

        logger.warning(
            f"Password reset failed - expired token for user '{user.username}'."
        )

        audit_log = AuditLog(
            username=user.username,
            action="PASSWORD_RESET_EXPIRED"
        )

        db.add(audit_log)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Reset token has expired"
        )

    # Update password
    user.password = hash_password(
        request.new_password
    )

    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    # Log successful password reset
    logger.info(
        f"User '{user.username}' successfully completed a password reset."
    )

    audit_log = AuditLog(
        username=user.username,
        action="PASSWORD_RESET_SUCCESS"
    )

    db.add(audit_log)
    db.commit()

    return {
        "message": "Password reset successfully."
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

@router.get("/users/me")
def get_logged_in_user(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.username == current_user["username"])
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

@router.get("/users")
def get_users(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    require_role(
        current_user,
        ["Admin"]
    )

    users = db.query(User).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

    return result

@router.get("/executive-summary")
def executive_summary(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    employee_activities = group_activities_by_employee(
        activities
    )

    employee_results = []

    for employee, activity_list in employee_activities.items():

        score = calculate_risk_score(
            activity_list
        )

        level = get_risk_level(
            score
        )

        employee_results.append({
            "employee_name": employee,
            "risk_level": level
        })

    health = calculate_security_health(
        employee_results
    )

    summary = generate_executive_summary(
        health
    )

    return {

        "organization_health": health,

        "executive_summary": summary

    }

@router.get("/ai-dashboard")
def ai_dashboard(
    db: Session = Depends(get_db)
):

    activities = db.query(EmployeeActivity).all()

    employee_activities = group_activities_by_employee(
        activities
    )

    employee_results = []

    for employee, activity_list in employee_activities.items():

        score = calculate_risk_score(
            activity_list
        )

        level = get_risk_level(
            score
        )

        breakdown = calculate_activity_breakdown(
            activity_list
        )

        recommendations = generate_recommendations(
            level,
            activity_list
        )

        anomaly = detect_behavior_anomaly(
            score,
            breakdown
        )

        prediction = predict_future_threat(
            score
        )

        employee_results.append({

            "employee_name": employee,

            "risk_score": score,

            "risk_level": level,

            "future_prediction": prediction,

            "behavior_analysis": anomaly,

            "recommendations": recommendations

        })

    employee_results.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    health = calculate_security_health(
        employee_results
    )

    summary = generate_executive_summary(
        health
    )

    return {

        "organization_health": health,

        "executive_summary": summary,

        "top_risky_employees": employee_results[:5]

    }