"""Request and response models for ``/api/brokers``."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.streams import Stream


#: The registered ``BrokerAPI`` provider classes (upstream ``BROKERS``).
BrokerClassname = Literal[
    "GENERICBROKER",
    "LASAIRBROKER",
    "BABAMULBROKER",
    "BOOMBROKER",
    "FINKBROKER",
    "ALERCEBROKER",
    "ANTARESBROKER",
    "PITTGOOGLEBROKER",
    "AMPELBROKER",
]


#: How a provider models filters, so a client can pick an editor.
BrokerFilterKind = Literal["pipeline", "query", "tags", "none"]


class BrokerCapabilities(BaseModel):
    """What a broker's provider class implements (upstream ``implements()``)."""

    model_config = ConfigDict(extra="forbid")

    query_alerts: bool | None = None
    get_alert: bool | None = None
    get_cutouts: bool | None = None
    cone_search: bool | None = None
    get_filters: bool | None = None
    create_filter: bool | None = None
    update_filter: bool | None = None
    delete_filter: bool | None = None
    test_filter: bool | None = None
    validate_filter: bool | None = None
    filter_modules: bool | None = None
    run_ingestion: bool | None = None
    validate_config: bool | None = None
    test_connection: bool | None = None
    save_as_source: bool | None = None
    get_photometry: bool | None = None
    # Data-semantics flags rather than methods: whether ``cone_search``
    # returns reference catalogs, and the dialect ``test_filter`` expects its
    # pipeline in (``None`` when the provider takes no pipeline at all).
    cross_match_catalogs: bool | None = None
    filter_pipeline: str | None = None


class Broker(BaseModel):
    """A configured connection to an external alert broker (upstream ``Broker``).

    The endpoints hand-build this dict rather than calling ``to_dict()``, so
    ``created_at``/``modified`` are never returned even though the upstream row
    carries them. ``altdata`` is only present for system admins, with the
    provider's secret config fields stripped out.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    name: str | None = None
    broker_classname: BrokerClassname | None = None
    active: bool | None = None
    default_alert_search: bool | None = None
    default_crossmatch: bool | None = None
    capabilities: BrokerCapabilities | None = None
    surveys: list[str] = Field(default_factory=list)
    filter_kind: BrokerFilterKind | None = None
    # Free-form per-instance provider configuration (endpoints, credentials).
    altdata: dict[str, Any] | None = None


class BrokerPost(BaseModel):
    """Payload for registering a broker."""

    model_config = ConfigDict(extra="forbid")

    name: str
    broker_classname: BrokerClassname
    altdata: dict[str, Any] | None = None
    active: bool | None = None
    default_alert_search: bool | None = None
    default_crossmatch: bool | None = None


class BrokerPostResponse(BaseModel):
    """Result of registering a broker."""

    model_config = ConfigDict(extra="forbid")

    id: int


class BrokerFilterVersion(BaseModel):
    """One editable version of a broker filter, as stored on the filter row."""

    model_config = ConfigDict(extra="forbid")

    fid: str | int | None = None
    # The version tree the broker's own filter language defines; skyportal
    # stores it verbatim, so its shape is the provider's, not skyportal's.
    version: Any = None


class BrokerFilter(BaseModel):
    """A skyportal ``Filter`` as listed by the broker endpoints.

    The handlers hand-build this dict, so it carries a strict subset of the
    upstream ``Filter`` columns and never ``created_at``/``modified``.
    ``altdata`` stays free-form: it holds the broker-side ids and the compiled
    native filter, whose shape the broker defines.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    name: str | None = None
    group_id: int | None = None
    stream_id: int | None = None
    broker_id: int | None = None
    autosave: bool | None = None
    altdata: dict[str, Any] | None = None


class BrokerFilterDetail(BaseModel):
    """A broker filter enriched with its broker-side versions and state.

    ``stream`` is trimmed by the handler to the stream's ``id`` and ``name``.
    ``fv`` comes straight back from the broker, so its entries are shaped by
    the provider rather than by skyportal. The ``fv``/``active_fid``/
    ``active``/``filters`` block is dropped entirely when the broker is
    unreachable or the filter has no broker-side counterpart.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    name: str | None = None
    group_id: int | None = None
    broker_id: int | None = None
    autosave: bool | None = None
    stream: Stream | None = None
    altdata: dict[str, Any] | None = None
    fv: list[dict[str, Any]] | None = None
    active_fid: str | int | None = None
    active: bool | None = None
    filters: list[BrokerFilterVersion] | None = None


class BrokerFiltersPage(BaseModel):
    """One page of results from the broker filter catalog."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    filters: list[BrokerFilter] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)


class BrokerFilterQuery(BaseModel):
    """A saved query for a broker whose ``filter_kind`` is ``"query"``."""

    model_config = ConfigDict(extra="forbid")

    selected: str
    tables: str
    conditions: str | None = None


class BrokerFilterPostResponse(BaseModel):
    """Result of creating a broker filter version."""

    model_config = ConfigDict(extra="forbid")

    id: int
    altdata: dict[str, Any] | None = None
    autosave: bool | None = None


class BrokerFilterAttachResponse(BaseModel):
    """Result of attaching a filter to a broker."""

    model_config = ConfigDict(extra="forbid")

    id: int
    broker_id: int | None = None


class BrokerFilterValidation(BaseModel):
    """Verdict of a broker filter version validation."""

    model_config = ConfigDict(extra="forbid")

    fid: str | int | None = None
    passed: bool | None = None
    message: str | None = None


class BrokerAlertSaveResponse(BaseModel):
    """Result of saving a broker alert as a source."""

    model_config = ConfigDict(extra="forbid")

    id: str
