"""Request and response models for ``/api/followup_request``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.allocations import Allocation
from skyportal_py_models.groups import Group
from skyportal_py_models.users import User


class FacilityTransaction(BaseModel):
    """A serialized exchange with a facility (upstream ``FacilityTransaction``).

    ``followup_request`` and ``observation_plan_request`` are the parent
    rows; they stay ``dict`` to avoid a circular import back into this
    module and into :mod:`skyportal_py_models.observation_plans`.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    request: dict[str, Any] | None = None
    response: dict[str, Any] | None = None
    followup_request_id: int | None = None
    observation_plan_request_id: int | None = None
    initiator_id: int | None = None
    initiator: User | None = None
    followup_request: dict[str, Any] | None = None
    observation_plan_request: dict[str, Any] | None = None


class FacilityTransactionRequest(BaseModel):
    """A queued facility call (upstream ``FacilityTransactionRequest``).

    ``followup_request`` and ``observation_plan_request`` are the parent
    rows; they stay ``dict`` to avoid a circular import back into this
    module and into :mod:`skyportal_py_models.observation_plans`.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    last_query: datetime.datetime | None = None
    method: str | None = None
    endpoint: str | None = None
    data: dict[str, Any] | None = None
    params: dict[str, Any] | None = None
    headers: dict[str, Any] | None = None
    status: str | None = None
    followup_request_id: int | None = None
    observation_plan_request_id: int | None = None
    initiator_id: int | None = None
    initiator: User | None = None
    followup_request: dict[str, Any] | None = None
    observation_plan_request: dict[str, Any] | None = None


class FollowupRequestWatcher(BaseModel):
    """A user watching a follow-up request (upstream ``FollowupRequestUser``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    followuprequest_id: int | None = None
    user_id: int | None = None


class FollowupRequest(BaseModel):
    """A follow-up observation request (upstream ``FollowupRequest``).

    ``obj`` stays ``dict`` because typing it as
    :class:`skyportal_py_models.sources.Source` would create an import cycle;
    the same applies to ``photometry``, ``photometric_series`` and
    ``spectra``, which all point back at the requesting object.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    obj_id: str | None = None
    allocation_id: int | None = None
    requester_id: int | None = None
    last_modified_by_id: int | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    status: str | None = None
    comment: str | None = None
    obj: dict[str, Any] | None = None
    allocation: Allocation | None = None
    requester: User | None = None
    last_modified_by: User | None = None
    target_groups: list[Group] = Field(default_factory=list)
    watchers: list[FollowupRequestWatcher] = Field(default_factory=list)
    transactions: list[FacilityTransaction] = Field(default_factory=list)
    transaction_requests: list[FacilityTransactionRequest] = Field(default_factory=list)
    photometry: list[dict[str, Any]] = Field(default_factory=list)
    photometric_series: list[dict[str, Any]] = Field(default_factory=list)
    spectra: list[dict[str, Any]] = Field(default_factory=list)
    rise_time_utc: str | list[str] | None = None
    set_time_utc: str | list[str] | None = None


class FollowupRequestsPage(BaseModel):
    """One page of results from a follow-up requests query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    followup_requests: list[FollowupRequest] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)
    page_number: int = Field(alias="pageNumber", default=1)
    num_per_page: int = Field(alias="numPerPage", default=100)


class FollowupRequestPost(BaseModel):
    """Payload for submitting a follow-up request."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str
    allocation_id: int
    payload: dict[str, Any]
    target_group_ids: list[int] | None = None


class FollowupRequestPostResponse(BaseModel):
    """Result of submitting a follow-up request."""

    model_config = ConfigDict(extra="forbid")

    id: int


class DefaultFollowupRequest(BaseModel):
    """A default follow-up request (upstream ``DefaultFollowupRequest``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    requester_id: int | None = None
    allocation_id: int | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    default_followup_name: str | None = None
    source_filter: dict[str, Any] | str | None = None
    constraints: dict[str, Any] | None = None
    priority_order: str | None = None
    validity_days: int | None = None
    comment: str | None = None
    implements_update: bool | None = None
    allocation: Allocation | None = None
    requester: User | None = None
    target_groups: list[Group] = Field(default_factory=list)


class DefaultFollowupRequestPost(BaseModel):
    """Payload for creating a default follow-up request."""

    model_config = ConfigDict(extra="forbid")

    allocation_id: int
    payload: dict[str, Any]
    default_followup_name: str
    source_filter: dict[str, Any]
    target_group_ids: list[int] | None = None
    comment: str | None = None
    implements_update: bool | None = None
    priority_order: str | None = None
    validity_days: int | None = None
    radius: float | None = None
    not_if_duplicates: bool | None = None
    source_group_ids: list[int] | None = None
    ignore_source_group_ids: list[int] | None = None
    not_if_classified: bool | None = None
    not_if_spectra_exist: bool | None = None
    not_if_tns_classified: bool | None = None
    not_if_tns_reported: float | None = None
    not_if_assignment_exists: bool | None = None
    ignore_allocation_ids: list[int] | None = None


class DefaultFollowupRequestPostResponse(BaseModel):
    """Result of creating a default follow-up request."""

    model_config = ConfigDict(extra="forbid")

    id: int


class PhotometryRequestStatus(BaseModel):
    """Status of a follow-up request after a photometry retrieval."""

    model_config = ConfigDict(extra="forbid")

    id: int
    request_status: str | None = None
