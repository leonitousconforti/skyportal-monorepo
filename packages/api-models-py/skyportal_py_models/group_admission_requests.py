"""Request and response models for ``/api/group_admission_requests``."""

from __future__ import annotations

import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

from skyportal_py_models.groups import Group
from skyportal_py_models.users import User


class GroupAdmissionRequest(BaseModel):
    """A request to join a group (upstream ``GroupAdmissionRequest``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    user_id: int | None = None
    group_id: int | None = None
    status: Literal["pending", "accepted", "declined"] | None = None
    user: User | None = None
    group: Group | None = None


class GroupAdmissionRequestPostResponse(BaseModel):
    """Result of creating a group admission request."""

    model_config = ConfigDict(extra="forbid")

    id: int
