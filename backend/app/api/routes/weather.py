from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.location import Location
from app.api.routes.locations import build_location_response
from app.schemas.weather import WeatherResponse
from app.services.weather_service import get_weather_data


router = APIRouter(
    prefix="/api/v1/weather",
    tags=["Weather"],
)


@router.get(
    "",
    response_model=list[WeatherResponse],
)
def get_weather(
    db: Session = Depends(get_db),
):
    locations = db.scalars(
        select(Location).order_by(Location.id)
    ).all()

    location_data = [
        build_location_response(location)
        for location in locations
    ]

    return [
        get_weather_data(location)
        for location in location_data
    ]


@router.get(
    "/{location_id}",
    response_model=WeatherResponse,
)
def get_location_weather(
    location_id: str,
    db: Session = Depends(get_db),
):
    location = None

    # First try database ID
    try:
        location_id_int = int(location_id)
        location = db.get(Location, location_id_int)
    except ValueError:
        pass

    # If not found, try location name/slug
    if location is None:
        location = db.scalar(
            select(Location).where(
                Location.name.ilike(location_id)
            )
        )

    if location is None:
        raise HTTPException(
            status_code=404,
            detail="Location not found",
        )

    location_data = build_location_response(location)

    return get_weather_data(location_data)