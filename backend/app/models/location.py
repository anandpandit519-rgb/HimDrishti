from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from geoalchemy2 import Geometry

from app.core.database import Base


class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    rainfall: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    soil_moisture: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    slope: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    terrain: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    recent_events: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    risk_score: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    risk_level: Mapped[str] = mapped_column(
        String(20),
        default="LOW",
    )

    alert_required: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    geom = mapped_column(
        Geometry(
            geometry_type="POINT",
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