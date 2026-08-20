"""Typed endpoint functions for ``/api/summary_query``."""

from __future__ import annotations

import httpx

from skyportal_py._http import unwrap
from skyportal_py_models.summary_query import (
    SummaryQueryMatch as SummaryQueryMatch,
    SummaryQueryPost as SummaryQueryPost,
    SummaryQueryResults as SummaryQueryResults,
)


def post_summary_query(
    client: httpx.Client,
    payload: SummaryQueryPost,
) -> SummaryQueryResults:
    """Search for sources whose summaries match a query.

    The search runs against the vector store of source summaries, so it
    requires the server to be configured with an embeddings store and an
    OpenAI key (globally or in the requesting user's preferences).

    Parameters
    ----------
    client : httpx.Client
        Client from :func:`skyportal_py.create_client`.
    payload : SummaryQueryPost
        The query. Exactly one of ``q`` (a free-text query) and
        ``obj_id`` (find sources similar to that source's summary) must
        be given. ``k`` is the maximum number of sources to return and
        must satisfy ``1 <= k <= 100``; server default 5. ``z_min`` and
        ``z_max`` bound the redshift of the returned sources and
        ``classification_types`` restricts them to those
        classifications; omitting them applies no restriction.
    """
    response = client.post(
        "/api/summary_query",
        json=payload.model_dump(by_alias=True, exclude_none=True),
    )
    return SummaryQueryResults.model_validate(unwrap(response))
