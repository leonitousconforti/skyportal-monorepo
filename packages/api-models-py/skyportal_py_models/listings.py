"""Request and response models for ``/api/listing``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class Listing(BaseModel):
    """An object saved by a user to a named list (upstream ``Listing``)."""

    # The handler returns bare ``Listing`` rows, so the ``user`` and ``obj``
    # relationships are never loaded and are not declared here.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    user_id: int | None = None
    obj_id: str | None = None
    list_name: str | None = None
    params: dict[str, Any] | None = None


class ListingPost(BaseModel):
    """Payload for adding an object to a user's list."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str
    list_name: str
    user_id: int | None = None
    params: dict[str, Any] | None = None


class ListingPostResponse(BaseModel):
    """Result of adding an object to a user's list."""

    model_config = ConfigDict(extra="forbid")

    id: int
