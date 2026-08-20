"""Request and response models for source annotations."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group


class Annotation(BaseModel):
    """An annotation on any annotatable resource (upstream ``Annotation``).

    Upstream splits annotations across ``Annotation``,
    ``AnnotationOnSpectrum`` and ``AnnotationOnPhotometry``; this model is
    the union of that family, so each type-specific foreign key is
    optional and only the ones belonging to the annotation's own table are
    ever set. ``data`` is a free-form JSONB column. ``author`` is the
    author's ``User.to_dict()``, and ``obj``, ``spectrum`` and
    ``photometry`` stay ``dict`` to avoid importing in a circle from the
    modules that import this one.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    data: dict[str, Any] = Field(default_factory=dict)
    origin: str | None = None
    author_id: int | None = None
    author: dict[str, Any] | None = None
    groups: list[Group] = Field(default_factory=list)
    obj_id: str | None = None
    spectrum_id: int | None = None
    photometry_id: int | None = None
    obj: dict[str, Any] | None = None
    spectrum: dict[str, Any] | None = None
    photometry: dict[str, Any] | None = None
    type: str | None = None


class AnnotationPostResponse(BaseModel):
    """Result of posting an annotation."""

    model_config = ConfigDict(extra="forbid")

    annotation_id: int


class AnnotationDetail(Annotation):
    """A single annotation, as returned by the single-annotation endpoint.

    The list and single-GET routes both return ``Annotation.to_dict()``
    with the groups eager-loaded, so this is :class:`Annotation` under the
    name the single-annotation endpoint is documented with.
    """
