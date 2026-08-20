"""Request and response models for ``/api/taxonomy``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group


class Taxonomy(BaseModel):
    """A classification taxonomy (upstream ``Taxonomy``).

    ``classifications`` stays untyped: ``classifications.Classification``
    already points at ``Taxonomy``, so typing it would create an import cycle.
    """

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    name: str | None = None
    version: str | None = None
    provenance: str | None = None
    is_latest: bool | None = Field(alias="isLatest", default=None)
    hierarchy: dict[str, Any] | None = None
    groups: list[Group] | None = None
    classifications: list[dict[str, Any]] | None = None


class TaxonomyPost(BaseModel):
    """Payload for creating a taxonomy."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    name: str
    version: str
    hierarchy: dict[str, Any] | None = None
    hierarchy_file: str | None = None
    group_ids: list[int] | None = None
    provenance: str | None = None
    is_latest: bool = Field(alias="isLatest", default=True)


class TaxonomyPut(BaseModel):
    """Payload for updating a taxonomy."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    name: str | None = None
    version: str | None = None
    provenance: str | None = None
    is_latest: bool | None = Field(alias="isLatest", default=None)
    group_ids: list[int] | None = None


class TaxonomyPostResponse(BaseModel):
    """Result of creating a taxonomy."""

    model_config = ConfigDict(extra="forbid")

    taxonomy_id: int
