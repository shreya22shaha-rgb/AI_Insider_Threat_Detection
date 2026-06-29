from fastapi import APIRouter
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import EmployeeActivity
from app.ai_engine import (
    predict_risk,
    analyze_behavior,
    classify_threat,
    risk_trend,
    ai_recommendation,
    threat_insight,
    department_risk,
    security_score
)

router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/risk-predictions")
def risk_predictions():

    sample_data = [
        {
            "employee_name": "Rahul",
            "risk_score": 50
        },
        {
            "employee_name": "Sneha",
            "risk_score": 25
        },
        {
            "employee_name": "Amit",
            "risk_score": 5
        }
    ]

    result = []

    for employee in sample_data:

        result.append({
            "employee_name": employee["employee_name"],
            "risk_score": employee["risk_score"],
            "predicted_risk": predict_risk(
                employee["risk_score"]
            )
        })

    return result

@router.get("/behavior-analysis")
def behavior_analysis():

    sample_data = [
        {
            "employee_name": "Rahul",
            "activity_count": 15
        },
        {
            "employee_name": "Sneha",
            "activity_count": 6
        },
        {
            "employee_name": "Amit",
            "activity_count": 2
        }
    ]

    result = []

    for employee in sample_data:

        result.append({
            "employee_name": employee["employee_name"],
            "activity_count": employee["activity_count"],
            "behavior_status": analyze_behavior(
                employee["activity_count"]
            )
        })

    return result

@router.get("/threat-classification")
def threat_classification():

    sample_data = [
        {
            "employee_name": "Rahul",
            "risk_level": "High"
        },
        {
            "employee_name": "Amit",
            "risk_level": "Medium"
        },
        {
            "employee_name": "Sneha",
            "risk_level": "Low"
        }
    ]

    result = []

    for employee in sample_data:

        result.append({
            "employee_name": employee["employee_name"],
            "risk_level": employee["risk_level"],
            "threat_classification": classify_threat(
                employee["risk_level"]
            )
        })

    return result

@router.get("/risk-trend")
def risk_trend_analysis():

    sample_data = [
        {
            "employee_name": "Rahul",
            "current_score": 50,
            "previous_score": 40
        },
        {
            "employee_name": "Amit",
            "current_score": 20,
            "previous_score": 35
        },
        {
            "employee_name": "Sneha",
            "current_score": 15,
            "previous_score": 15
        }
    ]

    result = []

    for employee in sample_data:

        result.append({
            "employee_name": employee["employee_name"],
            "current_score": employee["current_score"],
            "previous_score": employee["previous_score"],
            "trend": risk_trend(
                employee["current_score"],
                employee["previous_score"]
            )
        })

    return result

@router.get("/ai-recommendations")
def get_ai_recommendations():

    sample_data = [
        {
            "employee_name": "Rahul",
            "risk_level": "High"
        },
        {
            "employee_name": "Amit",
            "risk_level": "Medium"
        },
        {
            "employee_name": "Sneha",
            "risk_level": "Low"
        }
    ]

    result = []

    for employee in sample_data:

        result.append({
            "employee_name": employee["employee_name"],
            "risk_level": employee["risk_level"],
            "recommendation": ai_recommendation(
                employee["risk_level"]
            )
        })

    return result

@router.get("/threat-insights")
def get_threat_insights():

    high = 8
    medium = 5
    low = 2

    return {
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "insight": threat_insight(
            high,
            medium,
            low
        )
    }

@router.get("/department-risk-analysis")
def get_department_risk():

    departments = [
        {
            "department": "IT",
            "risk_score": 85
        },
        {
            "department": "Finance",
            "risk_score": 60
        },
        {
            "department": "HR",
            "risk_score": 35
        },
        {
            "department": "Sales",
            "risk_score": 15
        }
    ]

    result = []

    for dept in departments:

        result.append({
            "department": dept["department"],
            "risk_score": dept["risk_score"],
            "risk_level": department_risk(
                dept["risk_score"]
            )
        })

    return result

@router.get("/security-score")
def get_security_score():

    total_users = 10
    high_risk_users = 2

    score = security_score(
        total_users,
        high_risk_users
    )

    return {
        "total_users": total_users,
        "high_risk_users": high_risk_users,
        "overall_security_score": score
    }

@router.get("/download-report")
def download_report():

    return {
        "report_name": "AI Insider Threat Report",
        "generated_by": "AI Threat Detection System",
        "total_users": 10,
        "high_risk_users": 2,
        "medium_risk_users": 3,
        "low_risk_users": 5,
        "overall_security_score": 80,
        "status": "Report Generated Successfully"
    }