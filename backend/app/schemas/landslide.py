from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class LandslideResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    source: str
    source_event_id: str | None = None

    event_date: date | None = None
    event_date_end: date | None = None

    name: str | None = None

    state: str | None = None
    district: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    landslide_type: str | None = None
    trigger_type: str | None = None

    severity: str | None = None

    fatalities: int
    injuries: int
    displaced_people: int
    houses_damaged: int
    roads_affected: int

    description: str | None = None

    source_url: str | None = None
    source_confidence: str | None = None

    created_at: datetime
    updated_at: datetime