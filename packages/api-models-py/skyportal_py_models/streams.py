"""Request and response models for ``/api/streams``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class Stream(BaseModel):
    """An alert stream, e.g. a survey's public alerts (upstream ``Stream``)."""

    # No handler eager-loads Stream.groups/users/filters/photometry, so those
    # relationships never appear in a serialized Stream and are not declared.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    name: str
    altdata: dict[str, Any] | None = None
    auto_join: bool | None = None


class StreamPostResponse(BaseModel):
    """Result of creating a stream."""

    model_config = ConfigDict(extra="forbid")

    id: int


class StreamUserPostResponse(BaseModel):
    """Result of granting a user access to a stream."""

    model_config = ConfigDict(extra="forbid")

    stream_id: int
    user_id: int
