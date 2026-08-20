"""Request and response models for ``/api/instrument``."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.telescopes import Telescope


class InstrumentField(BaseModel):
    """One field (pointing) of an instrument (upstream ``InstrumentField``).

    ``contour`` and ``contour_summary`` are deferred server-side and only
    present when the request asked for GeoJSON. ``airmass`` is injected by the
    instrument endpoint when the fields are sliced by a localization.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    instrument_id: int | None = None
    field_id: int | None = None
    ra: float | None = None
    dec: float | None = None
    contour: dict[str, Any] | None = None
    contour_summary: dict[str, Any] | None = None
    reference_filters: list[str] | None = None
    reference_filter_mags: list[float] | None = None
    tiles: list[dict[str, Any]] | None = None
    airmass: float | None = None


class Instrument(BaseModel):
    """A SkyPortal instrument (upstream ``Instrument``).

    ``allocations`` stays untyped: ``allocations.Allocation`` points back at
    ``Instrument``, so typing it here would create an import cycle.
    ``log_exists``, ``number_of_fields`` and ``region_summary`` are injected by
    the instrument endpoints rather than being columns.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    name: str | None = None
    type: Literal["imager", "spectrograph", "imaging spectrograph"] | None = None
    band: str | None = None
    telescope_id: int | None = None
    telescope: Telescope | None = None
    filters: list[str] = Field(default_factory=list)
    sensitivity_data: dict[str, Any] | None = None
    configuration_data: dict[str, Any] | None = None
    status: dict[str, Any] | None = None
    last_status_update: datetime | None = None
    api_classname: str | None = None
    api_classname_obsplan: str | None = None
    listener_classname: str | None = None
    treasuremap_id: int | None = None
    tns_id: int | None = None
    across_id: str | None = None
    region: str | None = None
    has_fields: bool | None = None
    has_region: bool | None = None
    fields: list[InstrumentField] | None = None
    allocations: list[dict[str, Any]] | None = None
    log_exists: bool | None = None
    number_of_fields: int | None = None
    region_summary: str | None = None


class InstrumentLog(BaseModel):
    """A log uploaded for an instrument (upstream ``InstrumentLog``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    instrument_id: int | None = None
    instrument: Instrument | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    log: dict[str, Any] | None = None


class InstrumentPost(BaseModel):
    """Payload for creating an instrument."""

    model_config = ConfigDict(extra="forbid")

    name: str
    type: str
    telescope_id: int
    band: str | None = None
    filters: list[str] = Field(default_factory=list)
    sensitivity_data: dict[str, Any] | None = None
    configuration_data: dict[str, Any] | None = None
    api_classname: str | None = None
    api_classname_obsplan: str | None = None
    listener_classname: str | None = None
    treasuremap_id: int | None = None
    tns_id: int | None = None
    across_id: str | None = None
    region: str | None = None
    field_data: dict[str, list[Any]] | str | None = None
    field_region: str | None = None
    field_fov_type: str | None = None
    field_fov_attributes: list[float] | float | None = None
    references: dict[str, list[Any]] | str | None = None


class InstrumentPut(BaseModel):
    """Payload for updating an instrument."""

    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    type: str | None = None
    telescope_id: int | None = None
    band: str | None = None
    filters: list[str] | None = None
    sensitivity_data: dict[str, Any] | None = None
    configuration_data: dict[str, Any] | None = None
    api_classname: str | None = None
    api_classname_obsplan: str | None = None
    listener_classname: str | None = None
    treasuremap_id: int | None = None
    tns_id: int | None = None
    across_id: str | None = None
    region: str | None = None
    field_data: dict[str, list[Any]] | str | None = None
    field_region: str | None = None
    field_fov_type: str | None = None
    field_fov_attributes: list[float] | float | None = None
    references: dict[str, list[Any]] | str | None = None


class InstrumentPostResponse(BaseModel):
    """Result of creating an instrument."""

    model_config = ConfigDict(extra="forbid")

    id: int


class InstrumentLogPostResponse(BaseModel):
    """Result of uploading an instrument log."""

    model_config = ConfigDict(extra="forbid")

    id: int
