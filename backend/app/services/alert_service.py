def generate_alert(location):
    risk_score = location["risk_score"]
    risk_level = location["risk_level"]

    if risk_level == "CRITICAL":
        title = "Critical Landslide Risk"
        message = (
            f"Critical landslide risk detected in {location['name']} "
            f"due to elevated environmental risk conditions."
        )
        recommended_action = (
            "Avoid vulnerable slopes and affected roads. "
            "Follow local authority instructions."
        )

    elif risk_level == "HIGH":
        title = "High Landslide Risk"
        message = (
            f"Elevated landslide risk detected in {location['name']} "
            f"due to increased environmental risk."
        )
        recommended_action = (
            "Stay alert, avoid unstable slopes, "
            "and monitor further warnings."
        )

    elif risk_level == "MODERATE":
        title = "Moderate Landslide Risk"
        message = (
            f"Moderate landslide risk is being observed in "
            f"{location['name']}."
        )
        recommended_action = (
            "Continue monitoring weather and local conditions."
        )

    else:
        return None

    return {
        "id": f"ALT-{location['id'].upper()}",
        "location_id": location["id"],
        "location": location["name"],
        "state": location["state"],
        "risk_score": risk_score,
        "risk_level": risk_level,
        "title": title,
        "message": message,
        "recommended_action": recommended_action,
        "rainfall": location["rainfall"],
        "soil_moisture": location["soil_moisture"],
        "status": "ACTIVE",
    }


def generate_alerts(locations):
    alerts = []

    for location in locations:
        risk_score = location["risk_score"]
        risk_level = location["risk_level"]

        if risk_score >= 40:
            alert = generate_alert(location)

            if alert:
                alerts.append(alert)

    alerts.sort(
        key=lambda alert: alert["risk_score"],
        reverse=True,
    )

    return alerts