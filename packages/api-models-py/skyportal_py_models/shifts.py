"""Request and response models for ``/api/shifts``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group
from skyportal_py_models.users import User


class ShiftUserMembership(BaseModel):
    """A user's membership in a shift (upstream ``ShiftUser``).

    ``username``, ``first_name`` and ``last_name`` are copied up from the
    nested ``user`` by the single-shift handler.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    shift_id: int | None = None
    user_id: int | None = None
    admin: bool | None = None
    needs_replacement: bool | None = None
    user: User | None = None
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None


class ShiftCommentAuthor(User):
    """A shift comment's author, with the gravatar URL the handler adds."""

    gravatar_url: str | None = None


class ShiftComment(BaseModel):
    """A comment posted about a shift (upstream ``CommentOnShift``).

    The handler strips ``attachment_bytes`` and tags each comment with
    ``resourceType``.
    """

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    text: str | None = None
    attachment_name: str | None = None
    origin: str | None = None
    bot: bool | None = None
    author_id: int | None = None
    shift_id: int | None = None
    author: ShiftCommentAuthor | None = None
    groups: list[Group] = Field(default_factory=list)
    resource_type: str | None = Field(alias="resourceType", default=None)


class ShiftGroupMember(BaseModel):
    """A member of a shift's group, as returned alongside a single shift."""

    model_config = ConfigDict(extra="forbid")

    id: int
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    expiration_date: datetime.datetime | None = None


class ShiftGroup(BaseModel):
    """A shift's group, as hand-assembled by the single-shift handler."""

    model_config = ConfigDict(extra="forbid")

    id: int
    name: str | None = None
    has_admin_access: bool | None = None
    group_users: list[ShiftGroupMember] = Field(default_factory=list)


class Shift(BaseModel):
    """A group scanning shift (upstream ``Shift``).

    ``shift_users_ids`` is a column property (an aggregate of the shift's
    user IDs), so it is present even when no relationship is loaded.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    name: str | None = None
    description: str | None = None
    start_date: datetime.datetime | None = None
    end_date: datetime.datetime | None = None
    group_id: int | None = None
    required_users_number: int | None = None
    shift_users_ids: list[int] | None = None
    shift_users: list[ShiftUserMembership] = Field(default_factory=list)
    users: list[User] = Field(default_factory=list)
    comments: list[ShiftComment] = Field(default_factory=list)
    reminders: list[dict[str, Any]] = Field(default_factory=list)
    group: ShiftGroup | None = None


class ShiftPost(BaseModel):
    """Payload for creating a new shift."""

    model_config = ConfigDict(extra="forbid")

    name: str
    start_date: str
    end_date: str
    group_id: int
    description: str | None = None
    required_users_number: int | None = None
    shift_admins: list[int] | None = None


class ShiftPostResponse(BaseModel):
    """Result of creating a new shift."""

    model_config = ConfigDict(extra="forbid")

    id: int


class ShiftUserPostResponse(BaseModel):
    """Result of adding a user to a shift."""

    model_config = ConfigDict(extra="forbid")

    shift_id: int
    user_id: int
    admin: bool


class ShiftSummarySection(BaseModel):
    """One section (shifts or GCN events) of a shift summary report."""

    model_config = ConfigDict(extra="forbid")

    total: int | None = None
    data: list[dict[str, Any]] = Field(default_factory=list)


class ShiftSummaryReport(BaseModel):
    """Summary of shift-user activity over a period."""

    model_config = ConfigDict(extra="forbid")

    shifts: ShiftSummarySection | None = None
    gcns: ShiftSummarySection | None = None
