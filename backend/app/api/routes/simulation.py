from fastapi import APIRouter

from app.schemas.simulation import (
    SimulationRequest,
    SimulationResponse,
)
from app.services.simulation_service import run_simulation


router = APIRouter(
    prefix="/api/v1/simulation",
    tags=["Simulation"],
)


@router.post(
    "/scenario",
    response_model=SimulationResponse,
)
def simulate_scenario(data: SimulationRequest):
    return run_simulation(data)