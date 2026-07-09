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

# -----------------------------------
# Explainable AI - Activity Breakdown
# -----------------------------------

def calculate_activity_breakdown(activities):

    breakdown = {}

    for activity in activities:

        activity_name = activity.activity_type
        score = ACTIVITY_SCORES.get(activity_name, 0)

        if activity_name not in breakdown:

            breakdown[activity_name] = {
                "activity": activity_name,
                "count": 0,
                "score": 0
            }

        breakdown[activity_name]["count"] += 1
        breakdown[activity_name]["score"] += score

    return list(breakdown.values())

# -----------------------------------
# AI Recommendation Engine
# -----------------------------------

def generate_recommendations(risk_level, activities):

    recommendations = []

    if risk_level == "Critical":

        recommendations.extend([
            "Disable USB access immediately",
            "Lock user account temporarily",
            "Notify Security Team",
            "Force password reset",
            "Review all recent activities"
        ])

    elif risk_level == "High":

        recommendations.extend([
            "Monitor employee closely",
            "Enable Multi-Factor Authentication",
            "Review recent downloads"
        ])

    elif risk_level == "Medium":

        recommendations.extend([
            "Increase activity monitoring",
            "Review login history"
        ])

    else:

        recommendations.append(
            "No immediate action required"
        )

    # Activity-specific recommendations

    activity_names = [
        activity.activity_type
        for activity in activities
    ]

    if "USB File Transfer" in activity_names:

        recommendations.append(
            "Review USB device usage"
        )

    if "Admin Privilege Change" in activity_names:

        recommendations.append(
            "Verify privilege changes with administrator"
        )

    if "File Download" in activity_names:

        recommendations.append(
            "Check downloaded files for sensitive data"
        )

    return recommendations

# -----------------------------------
# Behavioral Anomaly Detection
# -----------------------------------

def detect_behavior_anomaly(risk_score, breakdown):

    anomaly_points = 0
    reasons = []

    if risk_score >= 120:
        anomaly_points += 1
        reasons.append("Very high risk score")

    for item in breakdown:

        if item["activity"] == "USB File Transfer" and item["count"] >= 5:
            anomaly_points += 1
            reasons.append("Excessive USB activity")

        if item["activity"] == "Admin Privilege Change" and item["count"] >= 2:
            anomaly_points += 1
            reasons.append("Multiple privilege changes")

        if item["activity"] == "Suspicious Script Execution":
            anomaly_points += 1
            reasons.append("Suspicious script executed")

        if item["activity"] == "Database Access" and item["count"] >= 2:
            anomaly_points += 1
            reasons.append("Repeated database access")

    if anomaly_points >= 3:
        status = "Behavioral Anomaly"

    elif anomaly_points >= 1:
        status = "Suspicious"

    else:
        status = "Normal"

    return {
        "status": status,
        "score": anomaly_points,
        "reasons": reasons
    }

# -----------------------------------
# Threat Prediction Engine
# -----------------------------------

def predict_future_threat(risk_score):

    if risk_score >= 120:

        probability = 98

    elif risk_score >= 80:

        probability = 90

    elif risk_score >= 50:

        probability = 70

    elif risk_score >= 20:

        probability = 45

    else:

        probability = 20

    if probability >= 85:

        future_risk = "Critical"

    elif probability >= 60:

        future_risk = "High"

    elif probability >= 30:

        future_risk = "Medium"

    else:

        future_risk = "Low"

    if probability >= 90:

        confidence = "Very High"

    elif probability >= 70:

        confidence = "High"

    elif probability >= 45:

        confidence = "Medium"

    else:

        confidence = "Low"

    return {

        "prediction_probability": probability,

        "predicted_risk": future_risk,

        "confidence": confidence

    }

# -----------------------------------
# Organization Security Health Score
# -----------------------------------

def calculate_security_health(employee_results):

    total_employees = len(employee_results)

    critical = 0
    high = 0
    medium = 0
    low = 0

    for employee in employee_results:

        level = employee["risk_level"]

        if level == "Critical":
            critical += 1

        elif level == "High":
            high += 1

        elif level == "Medium":
            medium += 1

        else:
            low += 1

    score = 100

    score -= critical * 15
    score -= high * 10
    score -= medium * 5

    if score < 0:
        score = 0

    if score >= 90:
        status = "Excellent"

    elif score >= 75:
        status = "Good"

    elif score >= 50:
        status = "Warning"

    else:
        status = "Critical"

    if critical > 0:
        recommendation = (
            "Immediately investigate critical employees."
        )

    elif high > 0:
        recommendation = (
            "Monitor high-risk employees closely."
        )

    else:
        recommendation = (
            "Security posture is stable."
        )

    return {

        "security_score": score,

        "security_status": status,

        "total_employees": total_employees,

        "critical_employees": critical,

        "high_risk_employees": high,

        "medium_risk_employees": medium,

        "low_risk_employees": low,

        "recommendation": recommendation

    }