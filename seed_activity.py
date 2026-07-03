from app.database import SessionLocal
from app.models import EmployeeActivity
from datetime import datetime

db = SessionLocal()

activities = [
    {
        "employee_name": "Parth",
        "activity_type": "USB File Transfer",
        "risk_level": "High"
    },
    {
        "employee_name": "Shreya",
        "activity_type": "Multiple Failed Logins",
        "risk_level": "Medium"
    },
    {
        "employee_name": "Shailesh",
        "activity_type": "Database Access",
        "risk_level": "High"
    },
    {
        "employee_name": "Rahul",
        "activity_type": "Normal Login",
        "risk_level": "Low"
    },
    {
        "employee_name": "Priya",
        "activity_type": "Email Download",
        "risk_level": "Medium"
    },
    {
        "employee_name": "Amit",
        "activity_type": "Privilege Escalation",
        "risk_level": "Critical"
    },
    {
        "employee_name": "Sneha",
        "activity_type": "Login from New Device",
        "risk_level": "Medium"
    },
    {
        "employee_name": "Neha",
        "activity_type": "File Upload",
        "risk_level": "Low"
    },
    {
        "employee_name": "Rohit",
        "activity_type": "VPN Login",
        "risk_level": "Low"
    },
    {
        "employee_name": "Anjali",
        "activity_type": "Suspicious Script Execution",
        "risk_level": "High"
    }
]

for activity in activities:

    existing = db.query(EmployeeActivity).filter(
        EmployeeActivity.employee_name == activity["employee_name"],
        EmployeeActivity.activity_type == activity["activity_type"]
    ).first()

    if existing:
        print(f"{activity['employee_name']} - {activity['activity_type']} already exists")
        continue

    new_activity = EmployeeActivity(
        employee_name=activity["employee_name"],
        activity_type=activity["activity_type"],
        risk_level=activity["risk_level"],
        timestamp=datetime.utcnow()
    )

    db.add(new_activity)

db.commit()
db.close()

print("Sample employee activities inserted successfully.")