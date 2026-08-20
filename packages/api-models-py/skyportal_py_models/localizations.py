"""Request and response models for ``/api/localization``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from skyportal_py_models.users import User


class LocalizationProperty(BaseModel):
    """Properties parsed from a localization (upstream ``LocalizationProperty``).

    ``localization`` stays ``dict``: typing it would make the model recursive
    through :class:`Localization`, which owns this one.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    localization_id: int | None = None
    data: dict[str, Any] | None = None
    sent_by: User | None = None
    localization: dict[str, Any] | None = None


class LocalizationTag(BaseModel):
    """A qualitative tag on a localization (upstream ``LocalizationTag``).

    ``localization`` stays ``dict``: typing it would make the model recursive
    through :class:`Localization`, which owns this one.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    localization_id: int | None = None
    text: str | None = None
    sent_by: User | None = None
    localization: dict[str, Any] | None = None


class LocalizationCenter(BaseModel):
    """The center of a localization (upstream ``Localization.center``).

    ``ebv`` is the Schlegel-Finkbeiner-Davis reddening at that position and is
    null when the dust map lookup fails.
    """

    model_config = ConfigDict(extra="forbid")

    ra: float | None = None
    dec: float | None = None
    gal_lat: float | None = None
    gal_lon: float | None = None
    ebv: float | None = None


class Localization(BaseModel):
    """A GCN event localization (upstream ``Localization``).

    ``uniq``, ``probdensity``, ``distmu``, ``distsigma``, ``distnorm`` and
    ``contour`` are deferred server-side, so each is only present when the
    handler undefers it; the distance arrays are undeferred only by the
    single-localization endpoint. ``flat_2d`` is the rasterized 2D skymap that
    endpoint injects when ``include2DMap`` is set. ``gcnevent``,
    ``observationplan_requests`` and ``survey_efficiency_analyses`` stay
    ``dict``: those upstream models point back at ``Localization``, so typing
    them would create an import cycle. The ``_localization_path`` column is
    never serialized.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    localization_name: str | None = None
    uniq: list[int] | None = None
    probdensity: list[float] | None = None
    distmu: list[float | None] | None = None
    distsigma: list[float | None] | None = None
    distnorm: list[float | None] | None = None
    contour: dict[str, Any] | None = None
    notice_id: int | None = None
    flat_2d: list[float] | None = None
    sent_by: User | None = None
    gcnevent: dict[str, Any] | None = None
    properties: list[LocalizationProperty] | None = None
    tags: list[LocalizationTag] | None = None
    observationplan_requests: list[dict[str, Any]] | None = None
    survey_efficiency_analyses: list[dict[str, Any]] | None = None
