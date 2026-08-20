/**
 * Typed endpoint functions for `/api/teams`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "skyportal-js-models/Schemas";
import {
    Team,
    TeamPostResponse,
    TeamPutResponse,
    type TeamPost,
    type TeamPut,
} from "skyportal-js-models/Teams";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Teams";

/** @internal */
const TeamsResponse = v.strictObject({ teams: Schemas.list(Team) });

/**
 * Retrieve the teams the token's user can access, ordered by name.
 *
 * The listing omits the per-team member roster; only `num_members` is
 * returned. Use {@link fetchTeam} for the full roster.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchTeams = async (client: Http.Client): Promise<Array<Team>> =>
    Http.decode(TeamsResponse, await Http.get(client, "/api/teams")).teams;

/**
 * Retrieve a single team, its groups, and its derived member roster.
 *
 * @since 1.0.0
 * @category Requests
 * @param teamId - ID of the team. Readable by members of any of the team's
 *   groups.
 */
export const fetchTeam = async (client: Http.Client, teamId: number): Promise<Team> =>
    Http.decode(Team, await Http.get(client, `/api/teams/${teamId}`));

/**
 * Create a team from a set of existing groups.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The team to create.
 */
export const postTeam = async (
    client: Http.Client,
    payload: TeamPost
): Promise<TeamPostResponse> =>
    Http.decode(
        TeamPostResponse,
        await Http.post(client, "/api/teams", Http.body(payload))
    );

/**
 * Update a team's fields and/or its set of groups.
 *
 * Only the fields explicitly set on `payload` are sent.
 *
 * @since 1.0.0
 * @category Requests
 * @param teamId - ID of the team to update.
 * @param payload - The fields to change.
 */
export const updateTeam = async (
    client: Http.Client,
    teamId: number,
    payload: TeamPut
): Promise<TeamPutResponse> =>
    Http.decode(
        TeamPutResponse,
        await Http.put(client, `/api/teams/${teamId}`, Http.body(payload))
    );

/**
 * Delete a team, leaving its groups and their data untouched.
 *
 * @since 1.0.0
 * @category Requests
 * @param teamId - ID of the team to delete. The user must be an admin of one of
 *   the team's groups.
 */
export const deleteTeam = async (
    client: Http.Client,
    teamId: number
): Promise<void> => {
    await Http.del(client, `/api/teams/${teamId}`);
};
