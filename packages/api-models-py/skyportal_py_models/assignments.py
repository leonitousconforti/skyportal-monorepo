"""Request and response models for ``/api/assignment``."""

from __future__ import annotations

import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.users import User


FollowupPriority = Literal["1", "2", "3", "4", "5"]
"""Allowed follow-up priorities, lowest (``"1"``) to highest (``"5"``)."""


class Assignment(BaseModel):
    """A target assignment on an observing run (upstream ``ClassicalAssignment``).

    ``obj`` stays ``dict`` because typing it as
    :class:`skyportal_py_models.sources.Source` would create an import cycle.
    ``/api/assignment`` serializes through the auto-generated marshmallow
    schema, so relationships other than ``obj`` and ``requester`` dump as
    bare primary keys; ``/api/observing_run/<id>`` instead returns
    ``to_dict()`` output plus the last-detection and rise/set extras.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    obj_id: str | None = None
    run_id: int | None = None
    requester_id: int | None = None
    last_modified_by_id: int | None = None
    status: str | None = None
    priority: FollowupPriority | None = None
    comment: str | None = None
    obj: dict[str, Any] | None = None
    requester: User | None = None
    last_modified_by: int | None = None
    run: int | None = None
    spectra: list[int] = Field(default_factory=list)
    photometry: list[int] = Field(default_factory=list)
    photometric_series: list[int] = Field(default_factory=list)
    rise_time_utc: str | None = None
    set_time_utc: str | None = None
    accessible_group_names: list[str] = Field(default_factory=list)
    last_detected_mag: float | None = None
    last_detected_filter: str | None = None
    last_detected_mjd: float | None = None


class AssignmentPost(BaseModel):
    """Payload for assigning a target to an observing run."""

    model_config = ConfigDict(extra="forbid")

    run_id: int
    obj_id: str
    priority: FollowupPriority
    status: str | None = None
    comment: str | None = None


class AssignmentPostResponse(BaseModel):
    """Result of posting an assignment."""

    model_config = ConfigDict(extra="forbid")

    id: int
