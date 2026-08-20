"""Request and response models for ``/api/teams``."""

from __future__ import annotations

import datetime

from pydantic import BaseModel, ConfigDict, Field


class TeamGroup(BaseModel):
    """A group belonging to a team, as assembled by the team handler."""

    model_config = ConfigDict(extra="forbid")

    id: int
    name: str | None = None
    nickname: str | None = None


class TeamMember(BaseModel):
    """A user who is a member of one of a team's groups."""

    model_config = ConfigDict(extra="forbid")

    id: int
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None


class Team(BaseModel):
    """A collaboration-level grouping of groups (upstream ``Team``)."""

    # ``groups``, ``num_members`` and ``users`` are hand-built by the handler's
    # ``team_to_dict``; ``users`` is omitted from the list endpoint.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    name: str | None = None
    nickname: str | None = None
    description: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    logo_url: str | None = None
    background_url: str | None = None
    groups: list[TeamGroup] = Field(default_factory=list)
    num_members: int | None = None
    users: list[TeamMember] | None = None


class TeamPost(BaseModel):
    """Payload for creating a team."""

    model_config = ConfigDict(extra="forbid")

    name: str
    nickname: str | None = None
    description: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    logo_url: str | None = None
    background_url: str | None = None
    group_ids: list[int] | None = None


class TeamPut(BaseModel):
    """Payload for updating a team."""

    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    nickname: str | None = None
    description: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    logo_url: str | None = None
    background_url: str | None = None
    group_ids: list[int] | None = None


class TeamPostResponse(BaseModel):
    """Result of creating a team."""

    model_config = ConfigDict(extra="forbid")

    id: int


class TeamPutResponse(BaseModel):
    """Result of updating a team."""

    model_config = ConfigDict(extra="forbid")

    id: int
