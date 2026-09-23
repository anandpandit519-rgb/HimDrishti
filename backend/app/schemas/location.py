from pydantic import BaseModel


class LocationResponse(BaseModel):
    id: str
    name: str
    state: str
    latitude: float
    longitude: float

    rainfall: float
    soil_moisture: float
    slope: float
    terrain: float
    recent_events: float

    risk_score: float
    risk_level: str
    alert_required: bool