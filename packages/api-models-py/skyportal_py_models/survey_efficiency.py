"""Request and response models for ``/api/survey_efficiency``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group
from skyportal_py_models.instruments import Instrument
from skyportal_py_models.localizations import Localization
from skyportal_py_models.users import User


class SurveyEfficiencyForObservations(BaseModel):
    """An efficiency analysis (upstream ``SurveyEfficiencyForObservations``).

    ``gcnevent`` stays ``dict`` because :mod:`skyportal_py_models.gcn_events`
    already imports :mod:`skyportal_py_models.observation_plans`, which this
    module imports, so typing it would risk an import cycle.
    """

    # ``number_of_transients``, ``number_in_covered``, ``number_detected`` and
    # ``efficiency`` are Python properties derived from ``lightcurves``, not
    # columns: the ``/api/survey_efficiency`` handlers omit them, while the GCN
    # event and observation plan handlers add them to the serialized row.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    status: str | None = None
    lightcurves: str | None = None
    requester_id: int | None = None
    gcnevent_id: int | None = None
    localization_id: int | None = None
    instrument_id: int | None = None
    number_of_transients: int | None = None
    number_in_covered: int | None = None
    number_detected: int | None = None
    efficiency: float | None = None
    requester: User | None = None
    groups: list[Group] = Field(default_factory=list)
    gcnevent: dict[str, Any] | None = None
    localization: Localization | None = None
    instrument: Instrument | None = None


class SurveyEfficiencyForObservationPlan(BaseModel):
    """An efficiency analysis (upstream ``SurveyEfficiencyForObservationPlan``)."""

    # As above, the four count/efficiency keys are properties injected by the
    # observation plan handler rather than mapper columns.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    status: str | None = None
    lightcurves: str | None = None
    requester_id: int | None = None
    observation_plan_id: int | None = None
    number_of_transients: int | None = None
    number_in_covered: int | None = None
    number_detected: int | None = None
    efficiency: float | None = None
    requester: User | None = None
    groups: list[Group] = Field(default_factory=list)
    # ``observation_plan`` stays a dict: this module is the canonical home of
    # the survey-efficiency models, and ``observation_plans`` imports it.
    observation_plan: dict[str, Any] | None = None


class DefaultSurveyEfficiencyRequest(BaseModel):
    """A default efficiency request (upstream ``DefaultSurveyEfficiencyRequest``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    default_observationplan_request_id: int | None = None
    default_observationplan_request: dict[str, Any] | None = None


class DefaultSurveyEfficiencyPostResponse(BaseModel):
    """Result of creating a default survey efficiency request."""

    model_config = ConfigDict(extra="forbid")

    id: int
