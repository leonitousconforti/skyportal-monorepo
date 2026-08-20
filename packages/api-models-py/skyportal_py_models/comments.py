"""Request and response models for source comments."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from skyportal_py_models.groups import Group


class Comment(BaseModel):
    """A comment on any commentable resource (upstream ``Comment``).

    Upstream splits comments across ``Comment``, ``CommentOnSpectrum``,
    ``CommentOnGCN``, ``CommentOnShift`` and ``CommentOnEarthquake``; this
    model is the union of that family, so each type-specific foreign key
    is optional and only the ones belonging to the comment's own table are
    ever set. ``author`` is the author's ``User.to_dict()`` (plus a
    ``gravatar_url`` key on the source endpoints), and ``obj``, ``gcn``,
    ``spectrum``, ``shift`` and ``earthquake`` stay ``dict`` to avoid
    importing in a circle from the modules that import this one.
    """

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    id: int
    created_at: datetime | None = None
    modified: datetime | None = None
    text: str | None = None
    attachment_name: str | None = None
    attachment_bytes: Any = None
    origin: str | None = None
    bot: bool | None = None
    author_id: int | None = None
    author: dict[str, Any] | None = None
    groups: list[Group] | None = None
    obj_id: str | None = None
    spectrum_id: int | None = None
    gcn_id: int | None = None
    earthquake_id: int | None = None
    shift_id: int | None = None
    obj: dict[str, Any] | None = None
    spectrum: dict[str, Any] | None = None
    gcn: dict[str, Any] | None = None
    shift: dict[str, Any] | None = None
    earthquake: dict[str, Any] | None = None
    dateobs: datetime | None = None
    resource_type: str | None = Field(alias="resourceType", default=None)


class CommentPostResponse(BaseModel):
    """Result of posting a comment."""

    model_config = ConfigDict(extra="forbid")

    comment_id: int
    message: str | None = None


class CommentDetail(Comment):
    """A single comment, as returned by the single-comment endpoint.

    The list and single-GET routes both return ``Comment.to_dict()`` plus
    ``resourceType``, so this is :class:`Comment` under the name the
    single-comment endpoint is documented with.
    """


class CommentAttachment(BaseModel):
    """The decoded contents of a comment attachment."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    comment_id: int = Field(alias="commentId")
    attachment: str | None = None
    attachment_name: str | None = Field(alias="attachmentName", default=None)


class CommentAttachmentCounts(BaseModel):
    """How many comments still hold their attachment in the database."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    total_without_attachment_bytes: int = Field(
        alias="totalWithoutAttachmentBytes", default=0
    )
    total_with_attachment_bytes: int = Field(
        alias="totalWithAttachmentBytes", default=0
    )


class CommentAttachmentBatch(BaseModel):
    """Result of moving one page of comment attachments to disk."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    total_matches: int = Field(alias="totalMatches", default=0)
    page_number: int = Field(alias="pageNumber", default=1)
    num_per_page: int = Field(alias="numPerPage", default=100)
