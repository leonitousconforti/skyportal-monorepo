"""Request and response models for ``/api/sharing_service``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.instruments import Instrument
from skyportal_py_models.sources import Source
from skyportal_py_models.streams import Stream


class PhotometryOptions(BaseModel):
    """Which photometry a sharing service publishes (upstream ``PHOTOMETRY_OPTIONS``).

    The server fills in every option it knows about, defaulting each to true,
    so a stored value always carries the full set.
    """

    model_config = ConfigDict(extra="forbid")

    first_and_last_detections: bool | None = None
    auto_sharing_allow_archival: bool | None = None


class SharingServiceCoauthor(BaseModel):
    """A coauthor of a service's submissions (upstream ``SharingServiceCoauthor``)."""

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sharing_service_id: int | None = None
    user_id: int | None = None


class SharingServiceGroupAutoPublisher(BaseModel):
    """An auto-publisher (upstream ``SharingServiceGroupAutoPublisher``).

    ``user_id`` is a column property derived from ``group_user_id`` rather
    than a stored column.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sharing_service_group_id: int | None = None
    group_user_id: int | None = None
    user_id: int | None = None


class SharingServiceGroup(BaseModel):
    """A group's access to a service (upstream ``SharingServiceGroup``).

    The ``group`` and ``sharing_service`` relationships are never eager-loaded
    by the endpoints, so they never appear and are not declared.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sharing_service_id: int | None = None
    group_id: int | None = None
    owner: bool | None = None
    auto_share_to_tns: bool | None = None
    auto_share_to_hermes: bool | None = None
    auto_sharing_allow_bots: bool | None = None
    auto_publishers: list[SharingServiceGroupAutoPublisher] = Field(
        default_factory=list
    )


class SharingService(BaseModel):
    """A service publishing objects externally (upstream ``SharingService``).

    ``owner_group_ids`` is not a column: the endpoint derives it from the
    owning entries of ``groups`` and injects it. The encrypted TNS credentials
    (``_tns_altdata``) are never serialized, and the ``submissions``
    relationship is never eager-loaded, so neither is declared.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    name: str | None = None
    acknowledgments: str | None = None
    testing: bool | None = None
    photometry_options: PhotometryOptions | None = None
    enable_sharing_with_tns: bool | None = None
    enable_sharing_with_hermes: bool | None = None
    tns_bot_name: str | None = None
    tns_bot_id: int | None = None
    tns_source_group_id: int | None = None
    publish_existing_tns_objects: bool | None = None
    owner_group_ids: list[int] = Field(default_factory=list)
    groups: list[SharingServiceGroup] = Field(default_factory=list)
    coauthors: list[SharingServiceCoauthor] = Field(default_factory=list)
    instruments: list[Instrument] = Field(default_factory=list)
    streams: list[Stream] = Field(default_factory=list)


class SharingServiceSubmission(BaseModel):
    """A publication request (upstream ``SharingServiceSubmission``).

    ``tns_name`` is not a column: the endpoint copies it off the submitted
    object. ``tns_payload``, ``tns_response`` and ``hermes_response`` are
    deferred upstream and only appear when explicitly requested. The ``user``
    and ``sharing_service`` relationships are never eager-loaded, so they are
    not declared.
    """

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    sharing_service_id: int | None = None
    obj_id: str | None = None
    obj: Source | None = None
    tns_name: str | None = None
    user_id: int | None = None
    custom_publishing_string: str | None = None
    custom_remarks_string: str | None = None
    publish_to_tns: bool | None = None
    tns_status: str | None = None
    tns_submission_id: int | None = None
    tns_payload: dict[str, Any] | None = None
    tns_response: dict[str, Any] | None = None
    publish_to_hermes: bool | None = None
    hermes_status: str | None = None
    hermes_response: dict[str, Any] | None = None
    archival: bool | None = None
    archival_comment: str | None = None
    auto_submission: bool | None = None
    instrument_ids: list[int] | None = None
    stream_ids: list[int] | None = None
    photometry_options: PhotometryOptions | None = None


class SharingServiceSubmissionsPage(BaseModel):
    """One page of results from a sharing service submissions query."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    sharing_service_id: int | None = None
    submissions: list[SharingServiceSubmission] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)
    page_number: int = Field(alias="pageNumber", default=1)
    num_per_page: int = Field(alias="numPerPage", default=100)


class SharingServicePost(BaseModel):
    """Payload for creating or updating a sharing service."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    name: str
    owner_group_ids: list[int] | None = None
    instrument_ids: list[int] | None = None
    stream_ids: list[int] | None = None
    acknowledgments: str | None = None
    testing: bool | None = None
    photometry_options: PhotometryOptions | None = None
    enable_sharing_with_tns: bool | None = None
    enable_sharing_with_hermes: bool | None = None
    tns_bot_name: str | None = None
    tns_bot_id: int | None = None
    tns_source_group_id: int | None = None
    tns_altdata: dict[str, Any] | None = Field(default=None, alias="_tns_altdata")
    publish_existing_tns_objects: bool | None = None


class SharingServiceSubmissionPost(BaseModel):
    """Payload for requesting the publication of an object."""

    model_config = ConfigDict(extra="forbid")

    obj_id: str
    sharing_service_id: int
    publishers: str
    remarks: str | None = None
    archival: bool | None = None
    archival_comment: str | None = None
    instrument_ids: list[int] | None = None
    stream_ids: list[int] | None = None
    photometry_options: PhotometryOptions | None = None
    publish_to_tns: bool | None = None
    publish_to_hermes: bool | None = None


class SharingServicePutResponse(BaseModel):
    """Result of creating or updating a sharing service."""

    model_config = ConfigDict(extra="forbid")

    id: int


class SharingServiceCoauthorPostResponse(BaseModel):
    """Result of adding a coauthor to a sharing service."""

    model_config = ConfigDict(extra="forbid")

    id: int


class SharingServiceGroupPutResponse(BaseModel):
    """Result of granting or editing a group's access to a service."""

    model_config = ConfigDict(extra="forbid")

    id: int


class SharingServiceAutoPublishersPostResponse(BaseModel):
    """Result of adding auto-publishers to a sharing service group."""

    model_config = ConfigDict(extra="forbid")

    ids: list[int] = Field(default_factory=list)
