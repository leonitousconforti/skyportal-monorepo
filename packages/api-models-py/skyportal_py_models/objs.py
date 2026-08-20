"""Request and response models for ``/api/objs`` and related endpoints."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ObjPosition(BaseModel):
    """A photometry-derived position for an object (upstream ``Obj``)."""

    model_config = ConfigDict(extra="forbid")

    ra: float | None = None
    dec: float | None = None
    gal_lon: float | None = None
    gal_lat: float | None = None
    ebv: float | None = None
    separation: float | None = None
    discovery_ra: float | None = None
    discovery_dec: float | None = None


class SuperObjMember(BaseModel):
    """An object linked to a super-object, with its position (upstream ``Obj``)."""

    model_config = ConfigDict(extra="forbid")

    id: str
    ra: float | None = None
    dec: float | None = None


class SuperObj(BaseModel):
    """Several objects that are one astrophysical source (upstream ``SuperObj``)."""

    # The handler builds this dict by hand: ``modified`` and the full ``Obj``
    # rows behind ``objs`` exist upstream but are not returned.

    model_config = ConfigDict(extra="forbid")

    id: int
    name: str | None = None
    is_roid: bool | None = None
    created_at: datetime | None = None
    objs: list[SuperObjMember] = Field(default_factory=list)


class SuperObjPostResponse(BaseModel):
    """Result of creating a super-object."""

    model_config = ConfigDict(extra="forbid")

    id: int
