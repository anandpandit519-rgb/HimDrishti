from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry

from app.core.database import Base


class LandslideEvent(Base):
    __tablename__ = "landslide_events"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    source_event_id: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    event_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    event_date_end: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    name: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    landslide_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    trigger_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    severity: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    fatalities: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    injuries: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    displaced_people: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    houses_damaged: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    roads_affected: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    source_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    source_confidence: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    geom = mapped_column(
        Geometry(
            geometry_type="GEOMETRY",
            srid=4326,
        ),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )