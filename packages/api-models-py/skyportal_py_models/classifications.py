"""Request and response models for classifications."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group
from skyportal_py_models.taxonomies import Taxonomy


class ClassificationVote(BaseModel):
    """A vote on a classification (upstream ``ClassificationVote``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    classification_id: int | None = None
    voter_id: int | None = None
    vote: int | None = None


class ClassificationEdit(BaseModel):
    """An edit of a classification's probability (upstream ``ClassificationEdit``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    classification_id: int | None = None
    editor_id: int | None = None
    editor_name: str | None = None
    old_probability: float | None = None
    new_probability: float | None = None


class Classification(BaseModel):
    """A classification of a source (upstream ``Classification``).

    ``obj`` stays a ``dict`` because typing it as
    :class:`skyportal_py_models.sources.Source` would import in a circle:
    ``sources`` already imports this module.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    obj_id: str
    classification: str
    taxonomy_id: int
    probability: float | None = None
    author_name: str | None = None
    author_id: int | None = None
    origin: str | None = None
    ml: bool | None = None
    taxonomy: Taxonomy | None = None
    votes: list[ClassificationVote] | None = None
    edits: list[ClassificationEdit] | None = None
    groups: list[Group] | None = None
    author: dict[str, Any] | None = None
    obj: dict[str, Any] | None = None


class ClassificationPost(BaseModel):
    """Payload for posting a classification."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str
    classification: str
    taxonomy_id: int
    origin: str | None = None
    probability: float | None = None
    ml: bool | None = None
    group_ids: list[int] | None = None
    vote: bool | None = None
    label: bool | None = None


class ClassificationPostResponse(BaseModel):
    """Result of posting a classification."""

    model_config = ConfigDict(extra="forbid")

    classification_id: int


class ClassificationsPostResponse(BaseModel):
    """Result of posting a batch of classifications."""

    model_config = ConfigDict(extra="forbid")

    classification_ids: list[int] = Field(default_factory=list)


class ClassificationsPage(BaseModel):
    """One page of results from a classifications query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    classifications: list[Classification] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)


class ClassificationUpdate(BaseModel):
    """Payload for updating a classification."""

    model_config = ConfigDict(extra="forbid")

    classification: str | None = None
    taxonomy_id: int | None = None
    probability: float | None = None
    origin: str | None = None
    ml: bool | None = None
    group_ids: list[int] | None = None
