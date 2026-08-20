"""Request and response models for ``/api/recurring_api``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from skyportal_py_models.users import User


class RecurringAPI(BaseModel):
    """A recurring API call scheduled by a user (upstream ``RecurringAPI``).

    ``owner`` is always loaded (``lazy="selectin"`` upstream). ``payload``
    is free-form JSON, and the single-object endpoint returns it exactly as
    stored, which may still be a JSON string.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    endpoint: str | None = None
    method: str | None = None
    payload: dict[str, Any] | str | None = None
    next_call: datetime | None = None
    call_delay: float | None = None
    number_of_retries: int | None = None
    active: bool | None = None
    owner_id: int | None = None
    owner: User | None = None


class RecurringAPIPost(BaseModel):
    """Payload for scheduling a recurring API call."""

    model_config = ConfigDict(extra="forbid")

    endpoint: str
    method: str
    next_call: str
    call_delay: float
    payload: str
    number_of_retries: int | None = None


class RecurringAPIPostResponse(BaseModel):
    """Result of scheduling a recurring API call."""

    model_config = ConfigDict(extra="forbid")

    id: int
