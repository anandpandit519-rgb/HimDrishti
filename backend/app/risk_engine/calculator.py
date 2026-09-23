def calculate_risk(
    rainfall: float,
    soil_moisture: float,
    slope: float,
    terrain: float,
    recent_events: float,
):
    # Normalize rainfall to a 0-100 score.
    # 200mm or more is treated as maximum rainfall risk.
    rainfall_score = min((rainfall / 200) * 100, 100)

    # Weighted risk model
    weighted_score = (
        rainfall_score * 0.35
        + soil_moisture * 0.25
        + slope * 0.20
        + terrain * 0.10
        + recent_events * 0.10
    )

    risk_score = round(weighted_score, 2)

    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    alert_required = risk_score >= 60

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "alert_required": alert_required,
        "factors": {
            "rainfall_score": round(rainfall_score, 2),
            "soil_moisture": soil_moisture,
            "slope": slope,
            "terrain": terrain,
            "recent_events": recent_events,
        },
    }