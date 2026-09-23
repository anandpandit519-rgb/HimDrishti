from app.risk_engine.calculator import calculate_risk


def get_recommended_action(risk_level: str) -> str:
    actions = {
        "CRITICAL": (
            "Immediate evacuation of vulnerable areas is recommended. "
            "Activate emergency response and issue public warnings."
        ),
        "HIGH": (
            "Increase monitoring, alert local authorities, "
            "and prepare evacuation measures for vulnerable areas."
        ),
        "MODERATE": (
            "Continue monitoring environmental conditions "
            "and keep local authorities informed."
        ),
        "LOW": (
            "No immediate action required. "
            "Continue routine monitoring."
        ),
    }

    return actions.get(
        risk_level,
        "Continue monitoring the location."
    )


def run_simulation(data):
    risk_result = calculate_risk(
        rainfall=data.rainfall,
        soil_moisture=data.soil_moisture,
        slope=data.slope,
        terrain=data.terrain,
        recent_events=data.recent_events,
    )

    return {
        "simulation_active": True,
        "scenario": data.scenario,

        "risk_score": risk_result["risk_score"],
        "risk_level": risk_result["risk_level"],
        "alert_required": risk_result["alert_required"],

        "factors": risk_result["factors"],

        "recommended_action": get_recommended_action(
            risk_result["risk_level"]
        ),
    }