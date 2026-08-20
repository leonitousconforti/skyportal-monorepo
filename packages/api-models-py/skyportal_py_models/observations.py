"""Request and response models for ``/api/observation``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.instruments import Instrument, InstrumentField


class Observation(BaseModel):
    """A survey observation (upstream ``ExecutedObservation``/``QueuedObservation``).

    The endpoint returns either kind depending on ``observation_status``,
    so the executed-only fields (``observation_id``, ``airmass``,
    ``seeing``, ``limmag``, ``target_name``, ``processed_fraction``) and
    the queued-only ones (``queue_name``, ``validity_window_start`` and
    ``validity_window_end``) are all optional.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    instrument_id: int | None = None
    instrument_field_id: int | None = None
    observation_id: int | None = None
    obstime: datetime.datetime | None = None
    filt: str | None = None
    exposure_time: int | None = None
    airmass: float | None = None
    seeing: float | None = None
    limmag: float | None = None
    target_name: str | None = None
    processed_fraction: float | None = None
    queue_name: str | None = None
    validity_window_start: datetime.datetime | None = None
    validity_window_end: datetime.datetime | None = None
    field: InstrumentField | None = None
    instrument: Instrument | None = None


class ObservationsPage(BaseModel):
    """One page of results from an observations query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    observations: list[Observation] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)
    probability: float | None = None
    area: float | None = None
    geojson: list[dict[str, Any]] | None = None
    field_ids: list[int] | None = None
    min_observations_per_field: int | None = None


class ObservationPost(BaseModel):
    """Payload for ingesting a set of executed observations."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    telescope_name: str = Field(alias="telescopeName")
    instrument_name: str = Field(alias="instrumentName")
    observation_data: dict[str, list[Any]] = Field(alias="observationData")


class ObservationSimSurveyResponse(BaseModel):
    """Result of starting a SimSurvey efficiency calculation."""

    model_config = ConfigDict(extra="forbid")

    id: int


class ObservationQueues(BaseModel):
    """Queue names retrieved from an instrument's external API."""

    model_config = ConfigDict(extra="forbid")

    queue_names: list[str] = Field(default_factory=list)
