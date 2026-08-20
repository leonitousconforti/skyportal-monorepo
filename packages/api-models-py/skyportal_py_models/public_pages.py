"""Request and response models for ``/api/public_pages``."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group


class PublicSourcePageOptions(BaseModel):
    """Visibility state of each data section of a public source page."""

    model_config = ConfigDict(extra="forbid")

    photometry: Literal["public", "private", "no data"] | None = None
    classifications: Literal["public", "private", "no data"] | None = None
    spectroscopy: Literal["public", "private", "no data"] | None = None
    summary: Literal["public", "private", "no data"] | None = None


class PublicSourcePage(BaseModel):
    """A published snapshot of a source (upstream ``PublicSourcePage``).

    Upstream overrides ``to_dict`` to return exactly these keys, so the
    ``data``, ``is_auto_published`` and ``release_id`` columns and the
    ``release`` relationship never reach the client; ``release_link_name``
    is derived from the release instead.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    source_id: str | None = None
    release_link_name: str | None = None
    is_visible: bool | None = None
    created_at: datetime | None = None
    hash: str | None = None
    options: PublicSourcePageOptions | None = None


class PublicSourcePagePostResponse(BaseModel):
    """Result of publishing a public source page."""

    model_config = ConfigDict(extra="forbid")

    id: int


class PublicRelease(BaseModel):
    """A public release of source pages (upstream ``PublicRelease``).

    ``group_ids`` is injected by the handler and lists only the owning
    groups the calling user can access; ``groups`` and ``source_pages`` are
    relationships that only appear when a handler eager-loads them.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    name: str | None = None
    link_name: str | None = None
    description: str | None = None
    is_visible: bool | None = None
    auto_publish_enabled: bool | None = None
    options: dict[str, Any] | None = None
    group_ids: list[int] = Field(default_factory=list)
    groups: list[Group] | None = None
    source_pages: list[PublicSourcePage] | None = None


class PublicReleasePost(BaseModel):
    """Payload for creating a public release."""

    model_config = ConfigDict(extra="forbid")

    name: str
    link_name: str
    group_ids: list[int]
    description: str | None = None
    options: dict[str, Any] | None = None
    is_visible: bool | None = None
    auto_publish_enabled: bool | None = None


class PublicReleasePostResponse(BaseModel):
    """Result of creating a public release."""

    model_config = ConfigDict(extra="forbid")

    id: int


class PublicReleaseUpdate(BaseModel):
    """Payload for updating a public release."""

    model_config = ConfigDict(extra="forbid")

    name: str
    group_ids: list[int]
    description: str | None = None
    options: dict[str, Any] | None = None
    is_visible: bool | None = None
    auto_publish_enabled: bool | None = None
