from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.location import Location
from app.api.routes.locations import build_location_response
from app.schemas.alert import AlertResponse
from app.services.alert_service import generate_alerts


router = APIRouter(
    prefix="/api/v1/alerts",
    tags=["Alerts"],
)


@router.get(
    "",
    response_model=list[AlertResponse],
)
def get_alerts(
    db: Session = Depends(get_db),
):
    locations = db.scalars(
        select(Location).order_by(Location.id)
    ).all()

    location_data = [
        build_location_response(location)
        for location in locations
    ]

    return generate_alerts(location_data)