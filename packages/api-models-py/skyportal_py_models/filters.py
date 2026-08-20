"""Request and response models for ``/api/filters``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class Filter(BaseModel):
    """An alert-stream filter belonging to a group (upstream ``Filter``).

    ``stream``, ``group``, ``broker`` and ``candidates`` stay untyped: each of
    those upstream models owns a ``filters`` (or ``filter``) relationship, so
    typing them here would risk an import cycle.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    name: str | None = None
    stream_id: int | None = None
    group_id: int | None = None
    broker_id: int | None = None
    altdata: dict[str, Any] | None = None
    autosave: bool | None = None
    stream: dict[str, Any] | None = None
    group: dict[str, Any] | None = None
    broker: dict[str, Any] | None = None
    candidates: list[dict[str, Any]] | None = None


class FilterPost(BaseModel):
    """Payload for creating a filter."""

    model_config = ConfigDict(extra="forbid")

    name: str
    stream_id: int
    group_id: int
    broker_id: int | None = None
    altdata: dict[str, Any] | None = None


class FilterPatch(BaseModel):
    """Payload for updating a filter."""

    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    altdata: dict[str, Any] | None = None
    group_id: int | None = None
    stream_id: int | None = None
    autosave: bool | None = None


class FilterPostResponse(BaseModel):
    """Result of creating a filter."""

    model_config = ConfigDict(extra="forbid")

    id: int
