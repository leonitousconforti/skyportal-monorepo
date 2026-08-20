"""Request and response models for ``/api/groups``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.filters import Filter
from skyportal_py_models.streams import Stream


class GroupMember(BaseModel):
    """A group member as assembled by the ``GET /api/groups/{id}`` handler."""

    # The handler hand-builds this dict from a ``GroupUser`` and its ``User``
    # rather than serializing either model, so it is not a 1:1 upstream model.

    model_config = ConfigDict(extra="forbid")

    id: int
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    oauth_uid: str | None = None
    admin: bool | None = None
    can_save: bool | None = None
    can_share_photometry: bool | None = None


class Group(BaseModel):
    """A SkyPortal group (upstream ``Group``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    name: str
    nickname: str | None = None
    description: str | None = None
    private: bool | None = None
    auto_accept_requests: bool | None = None
    single_user_group: bool = False
    streams: list[Stream] | None = None
    filters: list[Filter] | None = None
    group_users: list[GroupUser] | None = None
    users: list[GroupMember] | None = None


class GroupUser(BaseModel):
    """A user's membership of a group (upstream ``GroupUser`` join model)."""

    # ``user`` stays ``dict[str, Any]``: typing it as ``users.User`` would make
    # groups -> users -> groups a circular import.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    group_id: int | None = None
    user_id: int | None = None
    admin: bool | None = None
    can_save: bool | None = None
    can_share_photometry: bool | None = None
    user: dict[str, Any] | None = None
    group: Group | None = None


Group.model_rebuild()


class GroupsResponse(BaseModel):
    """The groups visible to the token, split by relationship to the user."""

    model_config = ConfigDict(extra="forbid")

    user_groups: list[Group] = Field(default_factory=list)
    user_accessible_groups: list[Group] = Field(default_factory=list)
    all_groups: list[Group] | None = None


class GroupPost(BaseModel):
    """Payload for creating a group."""

    model_config = ConfigDict(extra="forbid")

    name: str
    nickname: str | None = None
    description: str | None = None
    auto_accept_requests: bool | None = None
    group_admins: list[int] | None = None


class GroupPostResponse(BaseModel):
    """Result of creating a group."""

    model_config = ConfigDict(extra="forbid")

    id: int


class GroupStreamPostResponse(BaseModel):
    """Result of granting a group access to a stream."""

    model_config = ConfigDict(extra="forbid")

    group_id: int
    stream_id: int


class GroupUserPostResponse(BaseModel):
    """Result of adding a user to a group."""

    model_config = ConfigDict(extra="forbid")

    group_id: int
    user_id: int
    admin: bool
