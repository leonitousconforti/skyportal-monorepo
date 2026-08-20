"""Request and response models for ``/api/newsfeed``."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class NewsFeedAuthorInfo(BaseModel):
    """Display information about the user behind a news feed item.

    Exactly the fields upstream's ``basic_user_display_info`` (and
    ``Comment.construct_author_info_dict``) copies off the ``User``.
    """

    model_config = ConfigDict(extra="forbid")

    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    gravatar_url: str | None = None
    is_bot: bool | None = None


class NewsFeedItem(BaseModel):
    """One entry in the news feed (no upstream model; built by the handler).

    ``author`` is only set on comment items; ``author_info`` is absent on
    source items.
    """

    model_config = ConfigDict(extra="forbid")

    type: Literal[
        "source",
        "comment",
        "classification",
        "spectrum",
        "photometry",
    ]
    time: datetime | None = None
    message: str | None = None
    source_id: str | None = None
    classification: str | None = None
    author: str | None = None
    author_info: NewsFeedAuthorInfo | None = None
