from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.landslide_event import LandslideEvent
from app.schemas.landslide import LandslideResponse


router = APIRouter(
    prefix="/api/v1/landslides",
    tags=["Historical Landslides"],
)


@router.get(
    "",
    response_model=list[LandslideResponse],
)
def get_landslides(
    state: str | None = None,
    district: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
    db: Session = Depends(get_db),
):
    query = select(LandslideEvent)

    if state:
        query = query.where(
            LandslideEvent.state.ilike(state)
        )

    if district:
        query = query.where(
            LandslideEvent.district.ilike(district)
        )

    if start_date:
        query = query.where(
            LandslideEvent.event_date >= start_date
        )

    if end_date:
        query = query.where(
            LandslideEvent.event_date <= end_date
        )

    query = (
        query
        .order_by(LandslideEvent.event_date.desc())
        .limit(limit)
    )

    return db.scalars(query).all()


@router.get(
    "/{landslide_id}",
    response_model=LandslideResponse,
)
def get_landslide(
    landslide_id: int,
    db: Session = Depends(get_db),
):
    landslide = db.get(
        LandslideEvent,
        landslide_id,
    )

    if landslide is None:
        raise HTTPException(
            status_code=404,
            detail="Landslide event not found",
        )

    return landslide