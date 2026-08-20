"""Request and response models for ``/api/skymap_trigger``."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class SkymapTriggerQueue(BaseModel):
    """The skymap-based triggers currently queued on a remote facility.

    There is no upstream SQLAlchemy model: the names come straight back
    from the instrument's remote observation plan API.
    """

    model_config = ConfigDict(extra="forbid")

    trigger_names: list[str] = Field(default_factory=list)
