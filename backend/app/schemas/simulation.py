from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    scenario: str

    rainfall: float = Field(..., ge=0, le=500)
    soil_moisture: float = Field(..., ge=0, le=100)
    slope: float = Field(..., ge=0, le=100)
    terrain: float = Field(..., ge=0, le=100)
    recent_events: float = Field(..., ge=0, le=100)


class SimulationResponse(BaseModel):
    simulation_active: bool
    scenario: str

    risk_score: float
    risk_level: str
    alert_required: bool

    factors: dict
    recommended_action: str