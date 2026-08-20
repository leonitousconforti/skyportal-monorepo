"""Request and response models for ``/api/user``."""

from __future__ import annotations

import datetime

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group
from skyportal_py_models.streams import Stream


class User(BaseModel):
    """A SkyPortal user (upstream baselayer ``User``)."""

    # SkyPortal overrides ``User.to_dict`` to return the table columns only,
    # minus ``preferences``; ``roles``/``acls``/``permissions``/``gravatar_url``
    # and, for system admins, ``groups``/``streams`` are injected by the
    # handler.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    username: str
    first_name: str | None = None
    last_name: str | None = None
    bio: str | None = None
    affiliations: list[str] = Field(default_factory=list)
    contact_email: str | None = None
    contact_phone: str | None = None
    oauth_uid: str | None = None
    is_bot: bool | None = None
    expiration_date: datetime.datetime | None = None
    permissions: list[str] = Field(default_factory=list)
    roles: list[str] = Field(default_factory=list)
    acls: list[str] = Field(default_factory=list)
    gravatar_url: str | None = None
    groups: list[Group] | None = None
    streams: list[Stream] | None = None


class UsersPage(BaseModel):
    """One page of results from a users query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    users: list[User]
    total_matches: int = Field(alias="totalMatches")


class UserPost(BaseModel):
    """Payload for adding a new user."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    username: str
    first_name: str | None = None
    last_name: str | None = None
    affiliations: list[str] | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    oauth_uid: str | None = None
    roles: list[str] | None = None
    group_ids_and_admin: list[list[int | bool]] | None = Field(
        alias="groupIDsAndAdmin", default=None
    )


class UserPostResponse(BaseModel):
    """Result of adding a new user."""

    model_config = ConfigDict(extra="forbid")

    id: int
