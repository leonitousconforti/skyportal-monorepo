"""Request and response models for ``/api/gcn_event``."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.allocations import Allocation
from skyportal_py_models.comments import Comment
from skyportal_py_models.filters import Filter
from skyportal_py_models.groups import Group
from skyportal_py_models.localizations import Localization, LocalizationCenter, LocalizationProperty, LocalizationTag
from skyportal_py_models.mmadetectors import MMADetector
from skyportal_py_models.observation_plans import ObservationPlanRequest
from skyportal_py_models.reminders import Reminder
from skyportal_py_models.sources import Source
from skyportal_py_models.survey_efficiency import SurveyEfficiencyForObservations
from skyportal_py_models.users import User


# Every model below whose upstream row hangs off a ``GcnEvent`` keeps its
# ``gcnevent`` back-reference as ``dict[str, Any]``: :class:`GcnEvent` already
# types the forward direction, so typing the reverse one too would make the
# models mutually recursive.


class GcnNotice(BaseModel):
    """A GCN notice attached to an event (upstream ``GcnNotice``).

    ``content`` is the raw notice body (XML, JSON or plain text): a
    ``LargeBinary`` column the server decodes to a string. It is deferred, so
    it is absent unless the handler undefers it, and the single-event endpoint
    drops it when ``excludeNoticeContent`` is set.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    ivorn: str | None = None
    notice_type: str | None = None
    notice_format: str | None = None
    stream: str | None = None
    date: datetime | None = None
    content: Any = None
    has_localization: bool | None = None
    localization_ingested: bool | None = None
    sent_by: User | None = None
    gcnevent: dict[str, Any] | None = None


class GcnProperty(BaseModel):
    """Properties parsed from an event notice (upstream ``GcnProperty``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    data: dict[str, Any] | None = None
    sent_by: User | None = None
    gcnevent: dict[str, Any] | None = None


class GcnTag(BaseModel):
    """A qualitative tag on a GCN event (upstream ``GcnTag``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    text: str | None = None
    sent_by: User | None = None
    gcnevent: dict[str, Any] | None = None


class GcnSummary(BaseModel):
    """A human-readable summary of a GCN event (upstream ``GcnSummary``).

    ``text`` is deferred server-side and is undeferred by the single-summary
    endpoint; it reads ``"pending"`` until the background writer fills it in.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    group_id: int | None = None
    title: str | None = None
    text: str | None = None
    sent_by: User | None = None
    group: Group | None = None
    gcnevent: dict[str, Any] | None = None


class GcnReport(BaseModel):
    """A structured (publishable) report on a GCN event (upstream ``GcnReport``).

    ``data`` is a deferred JSONB column, undeferred by the single-report
    endpoint. It holds ``{"status": "pending"}`` (a mapping) while the report
    is being assembled and a JSON *string* once the background writer has
    stored the rendered report, so both forms are accepted.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    group_id: int | None = None
    report_name: str | None = None
    data: dict[str, Any] | str | None = None
    published: bool | None = None
    sent_by: User | None = None
    group: Group | None = None
    gcnevent: dict[str, Any] | None = None


class GcnTrigger(BaseModel):
    """Whether a GCN event triggered an allocation (upstream ``GcnTrigger``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    dateobs: datetime | None = None
    allocation_id: int | None = None
    triggered: bool | None = None
    allocation: Allocation | None = None
    gcnevent: dict[str, Any] | None = None


class GcnEventUser(BaseModel):
    """A user advocating for a GCN event (upstream ``GcnEventUser``).

    ``username``, ``first_name`` and ``last_name`` are copied off the joined
    user by the single-event endpoint, which returns these rows as
    ``event_users``.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    gcnevent_id: int | None = None
    user_id: int | None = None
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    user: User | None = None
    gcnevent: dict[str, Any] | None = None


class GcnEventLocalization(Localization):
    """A localization as returned inside a GCN event payload.

    The single-event endpoint replaces the localization's ``tags`` and
    ``properties`` with explicitly serialized lists and adds ``center``; the
    paginated endpoint returns ``tags`` only.
    """

    tags: list[LocalizationTag] | None = None
    properties: list[LocalizationProperty] | None = None
    center: LocalizationCenter | None = None


class GcnEventCrossmatchState(BaseModel):
    """Alert-crossmatch progress for one event, filter and localization.

    Upstream ``GcnEventCrossmatchState``. ``status`` is one of ``"pending"``,
    ``"processing"``, ``"done"`` or ``"failed"``, but the column is a plain
    string, so it is not narrowed here.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    gcnevent_id: int | None = None
    filter_id: int | None = None
    localization_id: int | None = None
    last_queried: datetime | None = None
    last_alert_jd: float | None = None
    status: str | None = None
    error: str | None = None
    archival_done: bool | None = None
    n_matches: int | None = None
    gcnevent: dict[str, Any] | None = None
    filter: Filter | None = None
    localization: Localization | None = None


class GcnCatalogQuery(BaseModel):
    """A catalog query submitted for a GCN event (upstream ``CatalogQuery``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    requester_id: int | None = None
    allocation_id: int | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    status: str | None = None
    requester: User | None = None
    allocation: Allocation | None = None
    target_groups: list[Group] | None = None


class GcnEvent(BaseModel):
    """A GCN event, keyed by its UTC observation time (upstream ``GcnEvent``).

    ``tags`` (the distinct texts of the event's ``GcnTag`` rows) and
    ``lightcurve`` (a URL parsed out of the first notice) are properties the
    handlers inject rather than columns; the underlying ``_tags`` relationship
    is never serialized. ``circulars``, ``gracedb_log`` and ``gracedb_labels``
    are deferred, so they only appear when a handler undefers them.
    ``event_users_ids`` is a column property aggregating ``gcnevent_users``,
    and ``event_users`` is the same join rows with the user's name copied in.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sent_by_id: int | None = None
    dateobs: datetime | None = None
    trigger_id: str | None = None
    aliases: list[str] | None = None
    tach_id: str | None = None
    circulars: dict[str, str] | None = None
    gracedb_log: dict[str, Any] | None = None
    gracedb_labels: dict[str, Any] | None = None
    lightcurve: str | None = None
    event_users_ids: list[int] | None = None
    tags: list[str] | None = None
    localizations: list[GcnEventLocalization] | None = None
    gcn_notices: list[GcnNotice] | None = None
    properties: list[GcnProperty] | None = None
    summaries: list[GcnSummary] | None = None
    reports: list[GcnReport] | None = None
    comments: list[Comment] | None = None
    reminders: list[Reminder] | None = None
    detectors: list[MMADetector] | None = None
    gcn_triggers: list[GcnTrigger] | None = None
    event_users: list[GcnEventUser] | None = None
    gcnevent_users: list[GcnEventUser] | None = None
    users: list[User] | None = None
    groups: list[Group] | None = None
    sent_by: User | None = None
    observationplan_requests: list[ObservationPlanRequest] | None = None
    survey_efficiency_analyses: list[SurveyEfficiencyForObservations] | None = None
    crossmatch_states: list[GcnEventCrossmatchState] | None = None


class GcnEventsPage(BaseModel):
    """One page of results from a GCN events query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    events: list[GcnEvent] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)


class GcnEventPost(BaseModel):
    """Payload for ingesting a GCN event."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    xml: str | None = None
    json_notice: dict[str, Any] | None = Field(default=None, alias="json")
    dateobs: str | None = None
    trigger_id: str | None = None
    aliases: list[str] | None = None
    group_ids: list[int] | None = None
    properties: dict[str, Any] | None = None
    tags: list[str] | None = None
    skymap: Any = None


class GcnEventPostResponse(BaseModel):
    """Result of ingesting a GCN event."""

    model_config = ConfigDict(extra="forbid")

    gcnevent_id: int | None = None
    dateobs: str | None = None
    notice_id: int | None = None


class GcnEventIdResponse(BaseModel):
    """A response carrying only the ID of the affected GCN event."""

    model_config = ConfigDict(extra="forbid")

    id: int


class GcnEventTagPostResponse(BaseModel):
    """Result of tagging a GCN event."""

    model_config = ConfigDict(extra="forbid")

    gcntag_id: int


class GcnEventTachInfo(BaseModel):
    """The TACH identifiers, aliases and circulars of a GCN event.

    ``circulars`` maps GCN circular ID to that circular's subject line.
    """

    model_config = ConfigDict(extra="forbid")

    tach_id: str | None = None
    aliases: list[str] | None = None
    circulars: dict[str, str] | None = None


class GcnEventCrossmatchRequeue(BaseModel):
    """Result of requeueing the alert crossmatch of a GCN event."""

    model_config = ConfigDict(extra="forbid")

    filters_requeued: int


class GcnEventInstrumentFields(BaseModel):
    """Instrument field probabilities for a GCN event localization."""

    model_config = ConfigDict(extra="forbid")

    field_ids: list[int] = Field(default_factory=list)
    probabilities: list[float] = Field(default_factory=list)


class GcnSummaryPost(BaseModel):
    """Payload for generating a GCN event summary."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    title: str
    group_id: int = Field(alias="groupId")
    number: int | None = None
    subject: str | None = None
    user_ids: list[int] | None = Field(default=None, alias="userIds")
    start_date: str | None = Field(default=None, alias="startDate")
    end_date: str | None = Field(default=None, alias="endDate")
    localization_name: str | None = Field(default=None, alias="localizationName")
    localization_cumprob: float | None = Field(
        default=None, alias="localizationCumprob"
    )
    number_detections: int | None = Field(default=None, alias="numberDetections")
    number_observations: int | None = Field(default=None, alias="numberObservations")
    show_sources: bool | None = Field(default=None, alias="showSources")
    show_galaxies: bool | None = Field(default=None, alias="showGalaxies")
    show_observations: bool | None = Field(default=None, alias="showObservations")
    no_text: bool | None = Field(default=None, alias="noText")
    photometry_in_window: bool | None = Field(default=None, alias="photometryInWindow")
    stats_method: str | None = Field(default=None, alias="statsMethod")
    instrument_ids: list[int] | None = Field(default=None, alias="instrumentIds")
    acknowledgements: str | None = None


class GcnReportPost(BaseModel):
    """Payload for generating a GCN event report."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    report_name: str = Field(alias="reportName")
    group_id: int = Field(alias="groupId")
    start_date: str | None = Field(default=None, alias="startDate")
    end_date: str | None = Field(default=None, alias="endDate")
    localization_name: str | None = Field(default=None, alias="localizationName")
    localization_cumprob: float | None = Field(
        default=None, alias="localizationCumprob"
    )
    number_detections: int | None = Field(default=None, alias="numberDetections")
    show_sources: bool | None = Field(default=None, alias="showSources")
    show_observations: bool | None = Field(default=None, alias="showObservations")
    show_survey_efficiencies: bool | None = Field(
        default=None, alias="showSurveyEfficiencies"
    )
    photometry_in_window: bool | None = Field(default=None, alias="photometryInWindow")
    stats_method: str | None = Field(default=None, alias="statsMethod")
    instrument_ids: list[int] | None = Field(default=None, alias="instrumentIds")


class DefaultGcnTag(BaseModel):
    """A rule that automatically tags matching GCN events.

    Upstream ``DefaultGcnTag``. ``filters`` is free-form JSON; the ingester
    reads the keys ``gcn_tags``, ``notice_types`` and ``localization_tags``.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    requester_id: int | None = None
    default_tag_name: str | None = None
    filters: dict[str, Any] | None = None
    requester: User | None = None


class DefaultGcnTagPost(BaseModel):
    """Payload for creating a default GCN tag."""

    model_config = ConfigDict(extra="forbid")

    default_tag_name: str
    filters: dict[str, Any] | None = None


class GcnEventObj(BaseModel):
    """An object's standing against a GCN event (upstream ``GcnEventObj``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    obj_id: str | None = None
    dateobs: datetime | None = None
    status: Literal["pending", "confirmed", "ambiguous", "rejected"] | None = None
    confirmer_id: int | None = None
    explanation: str | None = None
    notes: str | None = None
    obj: Source | None = None
    confirmer: User | None = None
    gcnevent: dict[str, Any] | None = None


class GcnEventObjPost(BaseModel):
    """Payload for recording an object's standing against a GCN event."""

    model_config = ConfigDict(extra="forbid")

    source_id: str
    status: Literal["pending", "confirmed", "ambiguous", "rejected"]
    localization_name: str
    localization_cumprob: float
    start_date: str
    end_date: str
    explanation: str | None = None
    notes: str | None = None


class GcnEventObjIdResponse(BaseModel):
    """Result of creating, updating or deleting a source-in-GCN record."""

    model_config = ConfigDict(extra="forbid")

    id: int


class GcnEventObjCrossmatchPost(BaseModel):
    """Payload for crossmatching an object against GCN events."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    start_date: str = Field(alias="startDate")
    end_date: str = Field(alias="endDate")
    probability: float | None = None
    before_first_detection: bool | None = Field(
        default=None, alias="beforeFirstDetection"
    )
    gcn_tag_keep: list[str] | None = Field(default=None, alias="gcnTagKeep")
    gcn_tag_remove: list[str] | None = Field(default=None, alias="gcnTagRemove")
    localization_tag_keep: list[str] | None = Field(
        default=None, alias="localizationTagKeep"
    )
    localization_tag_remove: list[str] | None = Field(
        default=None, alias="localizationTagRemove"
    )
    gcn_properties_filter: list[str] | None = Field(
        default=None, alias="gcnPropertiesFilter"
    )
    localization_properties_filter: list[str] | None = Field(
        default=None, alias="localizationPropertiesFilter"
    )
