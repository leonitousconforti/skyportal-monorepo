"""Request and response models for ``/api/observing_run``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.assignments import Assignment
from skyportal_py_models.groups import Group
from skyportal_py_models.instruments import Instrument
from skyportal_py_models.telescopes import Ephemeris
from skyportal_py_models.users import User


class ObservingRun(BaseModel):
    """A classical observing run (upstream ``ObservingRun``).

    ``sources`` stays ``dict`` because typing its entries as
    :class:`skyportal_py_models.sources.Source` would create an import cycle.
    The list endpoint returns ``to_dict()`` output (columns plus the
    eager-loaded ``instrument``); the single-run endpoint returns a
    hand-built dict that swaps ``created_at``/``modified``/``run_end_utc``
    for ``ephemeris`` and the run's ``assignments``.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    instrument_id: int | None = None
    calendar_date: datetime.date | None = None
    run_end_utc: datetime.datetime | None = None
    pi: str | None = None
    observers: str | None = None
    duration: int | None = None
    group_id: int | None = None
    owner_id: int | None = None
    ephemeris: Ephemeris | None = None
    instrument: Instrument | None = None
    group: Group | None = None
    owner: User | None = None
    assignments: list[Assignment] = Field(default_factory=list)
    sources: list[dict[str, Any]] = Field(default_factory=list)


class ObservingRunPost(BaseModel):
    """Payload for creating an observing run."""

    model_config = ConfigDict(extra="forbid")

    instrument_id: int
    calendar_date: str
    pi: str | None = None
    observers: str | None = None
    duration: int | None = None
    group_id: int | None = None


class ObservingRunPostResponse(BaseModel):
    """Result of creating an observing run."""

    model_config = ConfigDict(extra="forbid")

    id: int


class ObservingRunUpdate(BaseModel):
    """Payload for updating an observing run; every field is optional."""

    model_config = ConfigDict(extra="forbid")

    instrument_id: int | None = None
    calendar_date: str | None = None
    pi: str | None = None
    observers: str | None = None
    duration: int | None = None
    group_id: int | None = None
