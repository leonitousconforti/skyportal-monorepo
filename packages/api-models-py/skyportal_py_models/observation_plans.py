"""Request and response models for ``/api/observation_plan``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.allocations import Allocation
from skyportal_py_models.followup_requests import (
    FacilityTransaction,
    FacilityTransactionRequest,
)
from skyportal_py_models.groups import Group
from skyportal_py_models.instruments import Instrument, InstrumentField
from skyportal_py_models.localizations import Localization
from skyportal_py_models.survey_efficiency import SurveyEfficiencyForObservationPlan
from skyportal_py_models.users import User


class EventObservationPlanStatistics(BaseModel):
    """Statistics for one plan (upstream ``EventObservationPlanStatistics``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    observation_plan_id: int | None = None
    localization_id: int | None = None
    statistics: dict[str, Any] = Field(default_factory=dict)
    observation_plan: dict[str, Any] | None = None


class PlannedObservation(BaseModel):
    """A planned exposure (upstream ``PlannedObservation``).

    The single-plan handler renames the ``field_id`` foreign key to
    ``field_db_id`` and puts the instrument's own field number in
    ``field_id``, then adds ``rise_time``/``set_time`` (empty strings when
    the field never rises or sets that night).
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    observation_plan_id: int | None = None
    instrument_id: int | None = None
    dateobs: datetime.datetime | None = None
    field_id: int | None = None
    field_db_id: int | None = None
    exposure_time: int | None = None
    weight: float | None = None
    filt: str | None = None
    obstime: datetime.datetime | None = None
    overhead_per_exposure: int | None = None
    planned_observation_id: int | None = None
    rise_time: str | None = None
    set_time: str | None = None
    field: InstrumentField | None = None
    instrument: Instrument | None = None
    observation_plan: dict[str, Any] | None = None


class EventObservationPlan(BaseModel):
    """A generated observation plan (upstream ``EventObservationPlan``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    observation_plan_request_id: int | None = None
    instrument_id: int | None = None
    dateobs: datetime.datetime | None = None
    plan_name: str | None = None
    validity_window_start: datetime.datetime | None = None
    validity_window_end: datetime.datetime | None = None
    status: str | None = None
    statistics: list[EventObservationPlanStatistics] = Field(default_factory=list)
    planned_observations: list[PlannedObservation] = Field(default_factory=list)
    survey_efficiency_analyses: list[SurveyEfficiencyForObservationPlan] = Field(
        default_factory=list
    )
    instrument: Instrument | None = None
    observation_plan_request: dict[str, Any] | None = None


class ObservationPlanRequest(BaseModel):
    """A request for an observation plan (upstream ``ObservationPlanRequest``).

    ``gcnevent`` stays ``dict`` because
    :mod:`skyportal_py_models.gcn_events` already imports this module, so typing
    it would create an import cycle.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    requester_id: int | None = None
    last_modified_by_id: int | None = None
    gcnevent_id: int | None = None
    localization_id: int | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    status: str | None = None
    allocation_id: int | None = None
    combined_id: str | None = None
    default_plan: bool | None = None
    observation_plans: list[EventObservationPlan] = Field(default_factory=list)
    allocation: Allocation | None = None
    gcnevent: dict[str, Any] | None = None
    localization: Localization | None = None
    requester: User | None = None
    last_modified_by: User | None = None
    target_groups: list[Group] = Field(default_factory=list)
    transactions: list[FacilityTransaction] = Field(default_factory=list)
    transaction_requests: list[FacilityTransactionRequest] = Field(default_factory=list)


class ObservationPlanRequestsPage(BaseModel):
    """One page of results from an observation plan requests query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    requests: list[ObservationPlanRequest] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)


class AllocationObservationPlansPage(BaseModel):
    """One page of observation plan requests under an allocation."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    observation_plan_requests: list[ObservationPlanRequest] = Field(
        default_factory=list
    )
    total_matches: int = Field(alias="totalMatches", default=0)
    page_number: int = Field(alias="pageNumber", default=1)
    num_per_page: int = Field(alias="numPerPage", default=50)


class ObservationPlanPost(BaseModel):
    """Payload for submitting an observation plan request."""

    model_config = ConfigDict(extra="forbid")

    gcnevent_id: int
    allocation_id: int
    localization_id: int
    payload: dict[str, Any]
    status: str | None = None
    target_group_ids: list[int] | None = None
    requester_id: int | None = None


class ObservationPlanIdsResponse(BaseModel):
    """Result of submitting observation plan requests."""

    model_config = ConfigDict(extra="forbid")

    ids: list[int] = Field(default_factory=list)


class ObservationPlanManualPost(BaseModel):
    """Payload for submitting a manually-built observation plan."""

    model_config = ConfigDict(extra="forbid")

    allocation_id: int
    plan_name: str
    status: str
    payload: dict[str, Any]
    observation_plans: list[dict[str, Any]]
    gcnevent_id: int | None = None
    dateobs: str | None = None
    localization_id: int | None = None
    localization_name: str | None = None


class ObservationPlanManualPostResponse(BaseModel):
    """Result of submitting a manual observation plan."""

    model_config = ConfigDict(extra="forbid")

    id: int


class ObservationPlanGeoJSON(BaseModel):
    """GeoJSON summary of an observation plan's fields."""

    model_config = ConfigDict(extra="forbid")

    geojson: list[dict[str, Any]] = Field(default_factory=list)


class ObservationPlanSimSurveyResponse(BaseModel):
    """Result of starting a simsurvey efficiency analysis."""

    model_config = ConfigDict(extra="forbid")

    id: int


class DefaultObservationPlanPost(BaseModel):
    """Payload for creating a default observation plan request."""

    model_config = ConfigDict(extra="forbid")

    allocation_id: int
    default_plan_name: str
    payload: dict[str, Any]
    auto_send: bool | None = None
    filters: dict[str, Any] | None = None
    target_group_ids: list[int] | None = None
    requester_id: int | None = None


class DefaultObservationPlanPostResponse(BaseModel):
    """Result of creating a default observation plan request."""

    model_config = ConfigDict(extra="forbid")

    id: int


class DefaultSurveyEfficiencyRequest(BaseModel):
    """A default efficiency request (upstream ``DefaultSurveyEfficiencyRequest``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    default_observationplan_request_id: int | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    default_observationplan_request: dict[str, Any] | None = None


class DefaultObservationPlanRequest(BaseModel):
    """A default observation plan (upstream ``DefaultObservationPlanRequest``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    requester_id: int | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    filters: dict[str, Any] | None = None
    allocation_id: int | None = None
    default_plan_name: str | None = None
    auto_send: bool | None = None
    allocation: Allocation | None = None
    requester: User | None = None
    target_groups: list[Group] = Field(default_factory=list)
    default_survey_efficiencies: list[DefaultSurveyEfficiencyRequest] = Field(
        default_factory=list
    )
