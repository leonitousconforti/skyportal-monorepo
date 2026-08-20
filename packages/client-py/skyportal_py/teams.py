"""Typed endpoint functions for ``/api/teams``."""

from __future__ import annotations

import httpx

from skyportal_py._http import unwrap
from skyportal_py_models.teams import (
    Team as Team,
)
from skyportal_py_models.teams import (
    TeamGroup as TeamGroup,
)
from skyportal_py_models.teams import (
    TeamMember as TeamMember,
)
from skyportal_py_models.teams import (
    TeamPost as TeamPost,
)
from skyportal_py_models.teams import (
    TeamPostResponse as TeamPostResponse,
)
from skyportal_py_models.teams import (
    TeamPut as TeamPut,
)
from skyportal_py_models.teams import (
    TeamPutResponse as TeamPutResponse,
)


def fetch_teams(client: httpx.Client) -> list[Team]:
    """Retrieve the teams the token's user can access, ordered by name.

    The listing omits the per-team member roster; only ``num_members`` is
    returned. Use :func:`fetch_team` for the full roster.

    Parameters
    ----------
    client : httpx.Client
        Client from :func:`skyportal_py.create_client`.
    """
    response = client.get("/api/teams")
    return [Team.model_validate(team) for team in unwrap(response)["teams"]]


def fetch_team(client: httpx.Client, team_id: int) -> Team:
    """Retrieve a single team, its groups, and its derived member roster.

    Parameters
    ----------
    client : httpx.Client
        Client from :func:`skyportal_py.create_client`.
    team_id : int
        ID of the team. Readable by members of any of the team's groups.
    """
    response = client.get(f"/api/teams/{team_id}")
    return Team.model_validate(unwrap(response))


def post_team(client: httpx.Client, payload: TeamPost) -> TeamPostResponse:
    """Create a team from a set of existing groups.

    Parameters
    ----------
    client : httpx.Client
        Client from :func:`skyportal_py.create_client`.
    payload : TeamPost
        The team to create. ``name`` must be non-empty and unique, and the
        current user must be an admin of every group in ``group_ids``.
        Membership is derived: a user belongs to the team if they belong to
        one of its groups.
    """
    response = client.post(
        "/api/teams",
        json=payload.model_dump(exclude_none=True),
    )
    return TeamPostResponse.model_validate(unwrap(response))


def update_team(
    client: httpx.Client,
    team_id: int,
    payload: TeamPut,
) -> TeamPutResponse:
    """Update a team's fields and/or its set of groups.

    Only the fields explicitly set on ``payload`` are sent, so passing
    ``None`` for a field clears it server-side while omitting it leaves it
    unchanged.

    Parameters
    ----------
    client : httpx.Client
        Client from :func:`skyportal_py.create_client`.
    team_id : int
        ID of the team to update.
    payload : TeamPut
        The fields to change. When ``group_ids`` is set it replaces the
        team's groups, and the user must be an admin of each group added or
        removed. ``name``, if set, may not be empty.
    """
    response = client.put(
        f"/api/teams/{team_id}",
        json=payload.model_dump(exclude_unset=True),
    )
    return TeamPutResponse.model_validate(unwrap(response))


def delete_team(client: httpx.Client, team_id: int) -> None:
    """Delete a team, leaving its groups and their data untouched.

    Parameters
    ----------
    client : httpx.Client
        Client from :func:`skyportal_py.create_client`.
    team_id : int
        ID of the team to delete. The user must be an admin of one of the
        team's groups.
    """
    unwrap(client.delete(f"/api/teams/{team_id}"))
