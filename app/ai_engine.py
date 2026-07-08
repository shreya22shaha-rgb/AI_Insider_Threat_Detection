# app/ai_engine.py

def predict_risk(score):
    if score >= 50:
        return "Critical"
    elif score >= 30:
        return "Suspicious"
    elif score >= 10:
        return "Warning"
    else:
        return "Normal"


def analyze_behavior(activity_count):
    if activity_count > 10:
        return "Abnormal"
    return "Normal"


def classify_threat(risk_level):
    mapping = {
        "High": "Insider Threat",
        "Medium": "Suspicious",
        "Low": "Normal"
    }
    return mapping.get(risk_level, "Unknown")


def risk_trend(current_score, previous_score):
    if current_score > previous_score:
        return "Increasing"
    elif current_score < previous_score:
        return "Decreasing"
    else:
        return "Stable"
    
# -------------------------------
# AI Recommendations
# -------------------------------

def ai_recommendation(risk_level):

    if risk_level == "High":
        return "Immediately disable external USB access and notify Security Team."

    elif risk_level == "Medium":
        return "Monitor user activities for the next 24 hours."

    else:
        return "No immediate action required."


# -------------------------------
# Threat Insights
# -------------------------------

def threat_insight(high, medium, low):

    if high > medium and high > low:
        return "High-risk insider activities are increasing."

    elif medium > high:
        return "Most threats are moderate. Continue monitoring."

    else:
        return "Overall security posture is stable."


# -------------------------------
# Department Risk
# -------------------------------

def department_risk(score):

    if score >= 80:
        return "Critical"

    elif score >= 50:
        return "High"

    elif score >= 25:
        return "Medium"

    return "Low"


# -------------------------------
# Overall Security Score
# -------------------------------

def security_score(total_users, high_risk):

    score = 100 - (high_risk * 10)

    if score < 0:
        score = 0

    return score

# -----------------------------------
# AI Risk Score Engine
# -----------------------------------

ACTIVITY_SCORES = {
    "Admin Privilege Change": 40,
    "USB File Transfer": 30,
    "Suspicious Script Execution": 30,
    "Database Access": 25,
    "Multiple Failed Logins": 20,
    "File Download": 15,
    "Email Access": 8,
    "VPN Login": 5,
    "File Upload": 5,
    "System Login": 2
}


def calculate_risk_score(activities):

    total_score = 0

    for activity in activities:
        total_score += ACTIVITY_SCORES.get(activity.activity_type, 0)

    return total_score