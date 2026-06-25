from fastapi import APIRouter
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import EmployeeActivity
from .ai_engine import (
    predict_risk,
    analyze_behavior,
    classify_threat,
    risk_trend
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