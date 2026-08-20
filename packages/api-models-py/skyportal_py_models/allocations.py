"""Request and response models for ``/api/allocation``."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.instruments import Instrument
from skyportal_py_models.telescopes import Ephemeris, Telescope
from skyportal_py_models.users import User


class AllocationUser(BaseModel):
    """A join row mapping a user to an allocation (upstream ``AllocationUser``).

    ``allocation`` stays untyped to avoid a recursive model.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    allocation_id: int | None = None
    user_id: int | None = None
    user: User | None = None
    allocation: dict[str, Any] | None = None


class Allocation(BaseModel):
    """An observing-time allocation on an instrument (upstream ``Allocation``).

    ``allocation_users`` is a list of plain users on the allocation endpoints
    (the handlers substitute ``allocation_user.user``) but a list of join rows
    when it arrives nested inside a telescope payload, so both are accepted.
    ``requests``, ``default_requests``, ``default_observation_plans``,
    ``catalog_queries``, ``observation_plans``, ``gcn_triggers`` and ``group``
    stay untyped: those upstream models point back at ``Allocation``, so typing
    them would risk an import cycle. ``requests``, ``ephemeris`` and
    ``telescope`` are injected by the single-allocation endpoint. The encrypted
    ``_altdata`` column is never serialized.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    pi: str | None = None
    proposal_id: str | None = None
    hours_allocated: float | None = None
    validity_ranges: list[dict[str, Any]] | None = None
    default_share_group_ids: list[int] | None = None
    types: (
        list[Literal["triggered", "forced_photometry", "observation_plan"]] | None
    ) = None
    group_id: int | None = None
    instrument_id: int | None = None
    instrument: Instrument | None = None
    allocation_users: list[User | AllocationUser] | None = None
    group: dict[str, Any] | None = None
    requests: list[dict[str, Any]] | None = None
    default_requests: list[dict[str, Any]] | None = None
    default_observation_plans: list[dict[str, Any]] | None = None
    catalog_queries: list[dict[str, Any]] | None = None
    observation_plans: list[dict[str, Any]] | None = None
    gcn_triggers: list[dict[str, Any]] | None = None
    ephemeris: Ephemeris | None = None
    telescope: Telescope | None = None


class AllocationPost(BaseModel):
    """Payload for creating an allocation."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    instrument_id: int
    group_id: int
    hours_allocated: float
    pi: str | None = None
    proposal_id: str | None = None
    types: list[str] | None = None
    validity_ranges: list[dict[str, Any]] | None = None
    default_share_group_ids: list[int] | None = None
    allocation_admin_ids: list[int] | None = None
    altdata: dict[str, Any] | None = Field(alias="_altdata", default=None)


class AllocationUpdate(BaseModel):
    """Payload for updating an allocation; every field is optional."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    instrument_id: int | None = None
    group_id: int | None = None
    hours_allocated: float | None = None
    pi: str | None = None
    proposal_id: str | None = None
    types: list[str] | None = None
    validity_ranges: list[dict[str, Any]] | None = None
    default_share_group_ids: list[int] | None = None
    allocation_admin_ids: list[int] | None = None
    altdata: dict[str, Any] | None = Field(alias="_altdata", default=None)
    replace_altdata: bool | None = None


class AllocationPostResponse(BaseModel):
    """Result of creating an allocation."""

    model_config = ConfigDict(extra="forbid")

    id: int
