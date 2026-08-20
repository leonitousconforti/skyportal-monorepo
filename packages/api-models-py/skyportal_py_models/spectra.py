"""Request and response models for spectra."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.annotations import AnnotationDetail
from skyportal_py_models.comments import CommentDetail
from skyportal_py_models.groups import Group
from skyportal_py_models.instruments import Instrument
from skyportal_py_models.users import User


class _SpectrumBase(BaseModel):
    """A spectrum of a source (upstream ``Spectrum``)."""

    # ``obj`` stays ``dict[str, Any]``: typing it as ``sources.Source`` would
    # make spectra -> sources -> spectra a circular import. ``instrument_name``,
    # ``telescope_id``, ``telescope_name``, ``comments``, ``annotations`` and
    # the ``external_*`` names are injected by the handlers rather than being
    # columns, and the ``external_*`` keys are only present when the spectrum
    # records an external PI/reducer/observer. ``original_file_string`` is
    # deferred server-side and only returned when explicitly requested.
    # ``GET /api/sources/{obj_id}/spectra`` adds a constant ``type`` key to
    # each annotation, which ``AnnotationDetail`` already models.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    obj_id: str | None = None
    obj: dict[str, Any] | None = None
    observed_at: datetime | None = None
    wavelengths: list[float] = Field(default_factory=list)
    fluxes: list[float] = Field(default_factory=list)
    errors: list[float] | None = None
    units: str | None = None
    origin: str | None = None
    type: str | None = None
    label: str | None = None
    instrument_id: int | None = None
    instrument: Instrument | None = None
    instrument_name: str | None = None
    telescope_id: int | None = None
    telescope_name: str | None = None
    followup_request_id: int | None = None
    assignment_id: int | None = None
    altdata: dict[str, Any] | None = None
    original_file_string: str | None = None
    original_file_filename: str | None = None
    owner_id: int | None = None
    owner: User | None = None
    groups: list[Group] = Field(default_factory=list)
    pis: list[User] = Field(default_factory=list)
    reducers: list[User] = Field(default_factory=list)
    observers: list[User] = Field(default_factory=list)
    external_pi: str | None = None
    external_reducer: str | None = None
    external_observer: str | None = None
    comments: list[CommentDetail] = Field(default_factory=list)
    annotations: list[AnnotationDetail] = Field(default_factory=list)


class Spectrum(_SpectrumBase):
    """A spectrum of a source (upstream ``Spectrum``)."""

    # Returned by ``GET /api/spectrum/{id}`` and by
    # ``GET /api/sources/{obj_id}/spectra``; the latter additionally injects
    # ``observed_at_mjd`` and adds a ``gravatar_url`` to each comment's
    # author.

    observed_at_mjd: float | None = None


class SpectrumDetail(_SpectrumBase):
    """A spectrum with the full payload the server can attach to it."""

    # Returned by ``GET /api/spectra`` and ``GET /api/spectra/range``. The
    # range endpoint serializes the spectrum row on its own, so only the
    # columns are present there, and ``minimalPayload`` on ``GET /api/spectra``
    # strips everything but the metadata columns.


class SpectrumPost(BaseModel):
    """Payload for posting a spectrum."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str
    instrument_id: int
    observed_at: str
    wavelengths: list[float]
    fluxes: list[float]
    errors: list[float] | None = None
    units: str | None = None
    origin: str | None = None
    type: str | None = None
    label: str | None = None
    altdata: dict[str, Any] | None = None
    followup_request_id: int | None = None
    assignment_id: int | None = None
    group_ids: list[int] | str | None = None
    pi: list[int] | None = None
    external_pi: str | None = None
    reduced_by: list[int] | None = None
    external_reducer: str | None = None
    observed_by: list[int] | None = None
    external_observer: str | None = None


class SpectrumPostResponse(BaseModel):
    """Result of posting a spectrum."""

    model_config = ConfigDict(extra="forbid")

    id: int


class _SourceSpectra(BaseModel):
    """Envelope of a source's spectra response."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str | None = None
    spectra: list[Spectrum] = Field(default_factory=list)


class ParsedSpectrum(BaseModel):
    """A spectrum parsed from ASCII but not saved to the database."""

    # The parse endpoint returns an unsaved ``Spectrum``, so only the
    # attributes the parser set are present: no ``id``, ``created_at`` or
    # ``modified``, and no ``units``/``origin``/``followup_request_id``/
    # ``assignment_id``, which are only set when a spectrum is saved.

    model_config = ConfigDict(extra="forbid")

    id: int | None = None
    created_at: datetime | None = None
    modified: datetime | None = None
    obj_id: str | None = None
    observed_at: datetime | None = None
    wavelengths: list[float] = Field(default_factory=list)
    fluxes: list[float] = Field(default_factory=list)
    errors: list[float] | None = None
    units: str | None = None
    origin: str | None = None
    type: str | None = None
    label: str | None = None
    instrument_id: int | None = None
    followup_request_id: int | None = None
    assignment_id: int | None = None
    altdata: dict[str, Any] | None = None
    original_file_string: str | None = None
    original_file_filename: str | None = None
    owner_id: int | None = None


class SpectrumUpdate(BaseModel):
    """Payload for updating a spectrum; every field is optional."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str | None = None
    instrument_id: int | None = None
    observed_at: str | None = None
    wavelengths: list[float] | None = None
    fluxes: list[float] | None = None
    errors: list[float] | None = None
    units: str | None = None
    origin: str | None = None
    type: str | None = None
    label: str | None = None
    altdata: dict[str, Any] | None = None
    followup_request_id: int | None = None
    assignment_id: int | None = None
    group_ids: list[int] | str | None = None
    pi: list[int] | None = None
    external_pi: str | None = None
    reduced_by: list[int] | None = None
    external_reducer: str | None = None
    observed_by: list[int] | None = None
    external_observer: str | None = None


class SpectrumAsciiParse(BaseModel):
    """Payload for parsing an ASCII spectrum without saving it."""

    model_config = ConfigDict(extra="forbid")

    ascii: str
    wave_column: int | None = None
    flux_column: int | None = None
    fluxerr_column: int | None = None


class SpectrumAsciiPost(BaseModel):
    """Payload for uploading a spectrum from an ASCII file."""

    model_config = ConfigDict(extra="forbid")

    ascii: str
    obj_id: str
    instrument_id: int
    observed_at: str
    filename: str
    wave_column: int | None = None
    flux_column: int | None = None
    fluxerr_column: int | None = None
    type: str | None = None
    label: str | None = None
    group_ids: list[int] | str | None = None
    pi: list[int] | None = None
    external_pi: str | None = None
    reduced_by: list[int] | None = None
    external_reducer: str | None = None
    observed_by: list[int] | None = None
    external_observer: str | None = None
    followup_request_id: int | None = None
    assignment_id: int | None = None


class BulkSpectraSource(BaseModel):
    """Phase anchors for one source in a bulk spectra response."""

    model_config = ConfigDict(extra="forbid")

    id: str
    redshift: float | None = None
    first_detected_mjd: float | None = None
    peak_mjd: float | None = None
    tns_discovery_date: str | None = None


class BulkSpectrum(BaseModel):
    """A slim spectrum returned by the bulk spectra endpoint."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str | None = None
    observed_at: str | None = None
    wavelengths: list[float] = Field(default_factory=list)
    fluxes: list[float] = Field(default_factory=list)


class BulkSpectraResponse(BaseModel):
    """Result of a bulk spectra query."""

    model_config = ConfigDict(extra="forbid")

    sources: list[BulkSpectraSource] = Field(default_factory=list)
    spectra: list[BulkSpectrum] = Field(default_factory=list)
    truncated: bool = False
