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