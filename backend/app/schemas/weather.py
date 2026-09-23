from pydantic import BaseModel


class WeatherResponse(BaseModel):
    location_id: str
    location: str
    state: str

    temperature: float
    feels_like: float
    humidity: float
    wind_speed: float
    pressure: float
    visibility: float

    rainfall: float
    weather_condition: str

    risk_score: float
    risk_level: str