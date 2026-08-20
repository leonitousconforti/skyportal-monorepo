"""Request and response models for ``/api/earthquake``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.comments import Comment
from skyportal_py_models.reminders import Reminder
from skyportal_py_models.users import User


class EarthquakeNotice(BaseModel):
    """A single notice about an earthquake (upstream ``EarthquakeNotice``).

    ``content`` is the raw QuakeML document; it is a deferred
    ``LargeBinary`` column, so it is only present on the single-event
    endpoint (which undefers it) and arrives UTF-8 decoded.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    sent_by: User | None = None
    content: Any = None
    event_id: str | None = None
    lat: float | None = None
    lon: float | None = None
    depth: float | None = None
    magnitude: float | None = None
    date: datetime | None = None
    country: str | None = None


class EarthquakePrediction(BaseModel):
    """A predicted seismic arrival (upstream ``EarthquakePrediction``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    event_id: int | None = None
    detector_id: int | None = None
    d: float | None = None
    p: datetime | None = None
    s: datetime | None = None
    r2p0: datetime | None = None
    r3p5: datetime | None = None
    r5p0: datetime | None = None
    rfamp: float | None = None
    lockloss: float | None = None


class EarthquakeMeasurement(BaseModel):
    """A measured ground velocity (upstream ``EarthquakeMeasured``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    event_id: int | None = None
    detector_id: int | None = None
    rfamp: float | None = None
    lockloss: int | None = None


class Earthquake(BaseModel):
    """An earthquake event (upstream ``EarthquakeEvent``).

    The single-event endpoint replaces ``comments`` with hand-built dicts
    that drop ``attachment_bytes`` and add ``author`` and ``resourceType``.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    sent_by: User | None = None
    event_id: str | None = None
    event_uri: str | None = None
    status: str | None = None
    notices: list[EarthquakeNotice] = Field(default_factory=list)
    predictions: list[EarthquakePrediction] = Field(default_factory=list)
    measurements: list[EarthquakeMeasurement] = Field(default_factory=list)
    comments: list[Comment] = Field(default_factory=list)
    reminders: list[Reminder] = Field(default_factory=list)


class EarthquakesPage(BaseModel):
    """One page of results from an earthquake events query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    events: list[Earthquake] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)


class EarthquakePost(BaseModel):
    """Payload for ingesting an earthquake event."""

    model_config = ConfigDict(extra="forbid")

    xml: str | None = None
    event_id: str | None = None
    date: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    depth: float | None = None
    magnitude: float | None = None


class EarthquakePostResponse(BaseModel):
    """Result of ingesting an earthquake event."""

    model_config = ConfigDict(extra="forbid")

    id: str | int | None = None
