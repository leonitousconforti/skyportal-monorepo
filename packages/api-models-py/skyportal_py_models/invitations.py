"""Request and response models for ``/api/invitations``."""

from __future__ import annotations

import datetime

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group
from skyportal_py_models.roles import Role
from skyportal_py_models.streams import Stream
from skyportal_py_models.users import User


class Invitation(BaseModel):
    """An invitation for a new user to join the instance (upstream ``Invitation``)."""

    # The handler eager-loads ``groups``, ``streams`` and ``invited_by``;
    # ``role`` is only present when that relationship happens to be loaded.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    token: str | None = None
    user_email: str | None = None
    role_id: str | None = None
    role: Role | None = None
    admin_for_groups: list[bool] | None = None
    can_save_to_groups: list[bool] | None = None
    can_share_photometry_for_groups: list[bool] | None = None
    used: bool | None = None
    user_expiration_date: datetime.datetime | None = None
    groups: list[Group] | None = None
    streams: list[Stream] | None = None
    invited_by: User | None = None


class InvitationsPage(BaseModel):
    """One page of results from an invitations query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    invitations: list[Invitation] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)


class InvitationPost(BaseModel):
    """Payload for inviting a new user."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    user_email: str = Field(alias="userEmail")
    group_ids: list[int] = Field(alias="groupIDs")
    role: str | None = None
    stream_ids: list[int] | None = Field(alias="streamIDs", default=None)
    group_admin: list[bool] | None = Field(alias="groupAdmin", default=None)
    can_save: list[bool] | None = Field(alias="canSave", default=None)
    can_share_photometry: list[bool] | None = Field(
        alias="canSharePhotometry", default=None
    )
    user_expiration_date: str | None = Field(alias="userExpirationDate", default=None)


class InvitationPostResponse(BaseModel):
    """Result of creating an invitation."""

    model_config = ConfigDict(extra="forbid")

    id: int
