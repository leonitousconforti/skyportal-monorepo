"""Request and response models for ``/api/{resource_type}/{id}/reminders``."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group

ReminderResourceType = Literal[
    "source",
    "spectra",
    "gcn_event",
    "shift",
    "earthquake",
]


class Reminder(BaseModel):
    """A reminder on any remindable resource (upstream ``Reminder``).

    Upstream splits reminders across ``Reminder``, ``ReminderOnSpectrum``,
    ``ReminderOnGCN``, ``ReminderOnShift`` and ``ReminderOnEarthquake``;
    this model is the union of that family, so each type-specific foreign
    key is optional and only the ones belonging to the reminder's own
    table are ever set. ``user`` is the owner's ``User.to_dict()``, and
    ``obj``, ``spectrum``, ``gcn``, ``shift`` and ``earthquake`` stay
    ``dict`` to avoid importing in a circle from the modules that import
    this one.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    text: str | None = None
    origin: str | None = None
    bot: bool | None = None
    next_reminder: datetime | None = None
    reminder_delay: float | None = None
    number_of_reminders: int | None = None
    user_id: int | None = None
    user: dict[str, Any] | None = None
    groups: list[Group] | None = None
    obj_id: str | None = None
    spectrum_id: int | None = None
    gcn_id: int | None = None
    earthquake_id: int | None = None
    shift_id: int | None = None
    obj: dict[str, Any] | None = None
    spectrum: dict[str, Any] | None = None
    gcn: dict[str, Any] | None = None
    shift: dict[str, Any] | None = None
    earthquake: dict[str, Any] | None = None


class RemindersResponse(BaseModel):
    """All reminders attached to one resource."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    resource_id: str = Field(alias="resourceId")
    resource_type: str = Field(alias="resourceType")
    reminders: list[Reminder] = Field(default_factory=list)


class ReminderPost(BaseModel):
    """Payload for creating reminders on a resource."""

    model_config = ConfigDict(extra="forbid")

    text: str
    next_reminder: str
    reminder_delay: float | None = None
    number_of_reminders: int | None = None
    group_ids: list[int] | None = None
    user_ids: list[int] | None = None


class ReminderPostResponse(BaseModel):
    """IDs of the reminders created by a post."""

    model_config = ConfigDict(extra="forbid")

    reminder_ids: list[int] = Field(default_factory=list)


class ReminderUpdate(BaseModel):
    """Payload for updating an existing reminder."""

    model_config = ConfigDict(extra="forbid")

    text: str | None = None
    origin: str | None = None
    bot: bool | None = None
    next_reminder: str | None = None
    reminder_delay: float | None = None
    number_of_reminders: int | None = None
    group_ids: list[int] | None = None
    user_ids: list[int] | None = None
