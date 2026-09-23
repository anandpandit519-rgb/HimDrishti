from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.risk import RiskInput, RiskResponse
from app.risk_engine.calculator import calculate_risk
from app.api.routes.locations import router as locations_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.weather import router as weather_router
from app.api.routes.simulation import router as simulation_router
from app.api.routes.landslides import router as landslides_router


app = FastAPI(
    title="HimDrishti API",
    description="Landslide Early Warning & Risk Monitoring System",
    version="1.0.0",
)


# Frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(locations_router)
app.include_router(alerts_router)
app.include_router(weather_router)
app.include_router(simulation_router)
app.include_router(landslides_router)


@app.get("/")
def root():
    return {
        "name": "HimDrishti",
        "status": "online",
        "message": "HimDrishti backend is running",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "himdrishti-backend",
    }


@app.post("/api/v1/risk/calculate", response_model=RiskResponse)
def calculate_location_risk(data: RiskInput):
    return calculate_risk(
        rainfall=data.rainfall,
        soil_moisture=data.soil_moisture,
        slope=data.slope,
        terrain=data.terrain,
        recent_events=data.recent_events,
    )