from pydantic import BaseModel, Field


class RiskInput(BaseModel):
    rainfall: float = Field(..., ge=0, le=500)
    soil_moisture: float = Field(..., ge=0, le=100)
    slope: float = Field(..., ge=0, le=100)
    terrain: float = Field(..., ge=0, le=100)
    recent_events: float = Field(..., ge=0, le=100)


class RiskResponse(BaseModel):
    risk_score: float
    risk_level: str
    alert_required: bool
    factors: dict