"""Request and response models for ``/api/internal/tokens``."""

from __future__ import annotations

import datetime

from pydantic import BaseModel, ConfigDict


class ApiToken(BaseModel):
    """An API token (upstream baselayer ``Token``).

    The token's ACLs are not serialized; they appear only on the profile's
    token listing (``UserProfile.tokens``).
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    created_by_id: int | None = None
    name: str | None = None


class TokenPostResponse(BaseModel):
    """Result of creating a token."""

    model_config = ConfigDict(extra="forbid")

    token_id: str
