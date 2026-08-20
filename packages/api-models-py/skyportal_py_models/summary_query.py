"""Request and response models for ``/api/summary_query``."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class SummaryQueryPost(BaseModel):
    """Payload for a source summary similarity search."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    q: str | None = None
    obj_id: str | None = Field(alias="objID", default=None)
    k: int | None = None
    z_min: float | None = None
    z_max: float | None = None
    classification_types: list[str] | None = Field(
        alias="classificationTypes", default=None
    )


class SummaryQueryMatch(BaseModel):
    """One vector-store hit for a summary query (not a SkyPortal model).

    The shape is defined by the Pinecone client, not by SkyPortal: when
    ``q`` is used the handler rebuilds each hit as exactly ``id``,
    ``score`` and ``metadata``, but when ``obj_id`` is used it passes the
    raw ``matches`` of the Pinecone query response straight through, so
    the remaining fields are Pinecone's ``ScoredVector`` attributes
    (``values``, ``sparse_values``, serialized as ``sparseValues``) and
    may change with the Pinecone SDK version rather than with SkyPortal.
    ``metadata`` holds whatever SkyPortal indexed alongside the summary
    (``redshift``, ``class``, ...), so it stays free-form.
    """

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    id: str
    score: float | None = None
    values: list[float] | None = None
    sparse_values: dict[str, Any] | None = Field(alias="sparseValues", default=None)
    metadata: dict[str, Any] | None = None


class SummaryQueryResults(BaseModel):
    """Results of a source summary similarity search."""

    model_config = ConfigDict(extra="forbid")

    query_results: list[SummaryQueryMatch] = Field(default_factory=list)
