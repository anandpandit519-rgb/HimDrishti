from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.location import Location
from app.schemas.location import LocationResponse
from app.risk_engine.calculator import calculate_risk


router = APIRouter(
    prefix="/api/v1/locations",
    tags=["Locations"],
)


def build_location_response(location: Location):
    risk = calculate_risk(
        rainfall=location.rainfall,
        soil_moisture=location.soil_moisture,
        slope=location.slope,
        terrain=location.terrain,
        recent_events=location.recent_events,
    )

    return {
        "id": str(location.id),
        "name": location.name,
        "state": location.state,
        "latitude": location.latitude,
        "longitude": location.longitude,
        "rainfall": location.rainfall,
        "soil_moisture": location.soil_moisture,
        "slope": location.slope,
        "terrain": location.terrain,
        "recent_events": location.recent_events,
        "risk_score": risk["risk_score"],
        "risk_level": risk["risk_level"],
        "alert_required": risk["alert_required"],
    }


@router.get(
    "",
    response_model=list[LocationResponse],
)
def get_locations(
    db: Session = Depends(get_db),
):
    locations = db.scalars(
        select(Location).order_by(Location.id)
    ).all()

    return [
        build_location_response(location)
        for location in locations
    ]


@router.get(
    "/{location_id}",
    response_model=LocationResponse,
)
def get_location(
    location_id: str,
    db: Session = Depends(get_db),
):
    try:
        location_id_int = int(location_id)
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail="Location not found",
        )

    location = db.get(Location, location_id_int)

    if location is None:
        raise HTTPException(
            status_code=404,
            detail="Location not found",
        )

    return build_location_response(location)