"""Request and response models for ``/api/roles``."""

from __future__ import annotations

import datetime

from pydantic import BaseModel, ConfigDict, Field


class Role(BaseModel):
    """A named collection of ACLs (upstream baselayer ``Role``)."""

    # The handler replaces the ``acls`` relationship with a list of ACL IDs.

    model_config = ConfigDict(extra="forbid")

    id: str
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    acls: list[str] = Field(default_factory=list)
