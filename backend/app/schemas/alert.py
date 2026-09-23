from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: str
    location_id: str
    location: str
    state: str

    risk_score: float
    risk_level: str

    title: str
    message: str
    recommended_action: str

    rainfall: float
    soil_moisture: float

    status: str