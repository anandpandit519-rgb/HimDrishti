def get_weather_data(location):
    """
    Temporary weather provider.

    This will later be replaced by a real weather
    data provider without changing the API contract.
    """

    rainfall = location["rainfall"]

    if rainfall >= 150:
        condition = "Heavy Rain"
    elif rainfall >= 100:
        condition = "Moderate Rain"
    elif rainfall >= 50:
        condition = "Light Rain"
    else:
        condition = "Partly Cloudy"

    return {
        "location_id": location["id"],
        "location": location["name"],
        "state": location["state"],

        "temperature": 24.0,
        "feels_like": 25.0,
        "humidity": location["soil_moisture"],
        "wind_speed": 12.4,
        "pressure": 1008.2,
        "visibility": 8.5,

        "rainfall": rainfall,
        "weather_condition": condition,

        "risk_score": location.get("risk_score", 0),
        "risk_level": location.get("risk_level", "LOW"),
    }