"""Request and response models for ``/api/objtagoption`` and ``/api/objtag``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from skyportal_py_models.groups import Group


class ObjTagOption(BaseModel):
    """A tag that can be applied to objects (upstream ``ObjTagOption``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    name: str | None = None
    color: str | None = None


class ObjTag(BaseModel):
    """An object-tag association (upstream ``ObjTag``).

    Handlers that assemble a tag by hand add ``name`` (the tag option's
    name) and, on the internal endpoints, ``total_group_count`` (how many
    groups hold the tag, before the user's groups are filtered out).
    ``obj`` and ``author`` stay ``dict`` to avoid importing in a circle
    from the modules that import this one.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    obj_id: str | None = None
    objtagoption_id: int | None = None
    author_id: int | None = None
    objtagoption: ObjTagOption | None = None
    groups: list[Group] | None = None
    obj: dict[str, Any] | None = None
    author: dict[str, Any] | None = None
    name: str | None = None
    total_group_count: int | None = None


class ObjTagPostResponse(BaseModel):
    """Result of creating an object-tag association.

    A brand-new association comes back in full; adding groups to one that
    already exists returns only ``id`` and ``message``, and adding nothing
    returns an empty result.
    """

    model_config = ConfigDict(extra="forbid")

    id: int | None = None
    created_at: datetime | None = None
    modified: datetime | None = None
    obj_id: str | None = None
    objtagoption_id: int | None = None
    author_id: int | None = None
    message: str | None = None
