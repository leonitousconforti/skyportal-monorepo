/**
 * Typed endpoint functions for `/api/invitations`.
 *
 * @since 1.0.0
 */

import * as Http from "./Http.ts";
import { InvitationsPage, InvitationPostResponse } from "skyportal-js-models/Invitations";
import type { InvitationPost } from "skyportal-js-models/Invitations";

export * from "skyportal-js-models/Invitations";

/**
 * Options for querying invitations.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchInvitationsOptions {
    /** Pagination controls; the server defaults to 25 per page. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /**
     * Also return invitations that have already been accepted. Defaults to
     * false server-side, i.e. only pending invitations are returned.
     */
    readonly includeUsed?: boolean | undefined;
    /** Substring match on the invited email address. */
    readonly email?: string | undefined;
    /** Only invitations to the group with this exact name. */
    readonly group?: string | undefined;
    /** Only invitations granting access to the stream with this exact name. */
    readonly stream?: string | undefined;
    /** Substring match on the username of the inviting user. */
    readonly invitedBy?: string | undefined;
}

/**
 * Query invitations, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchInvitations = async (
    client: Http.Client,
    options: FetchInvitationsOptions = {}
): Promise<InvitationsPage> =>
    Http.decode(
        InvitationsPage,
        await Http.get(client, "/api/invitations", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 25,
            includeUsed: options.includeUsed,
            email: options.email,
            group: options.group,
            stream: options.stream,
            invitedBy: options.invitedBy,
        })
    );

/**
 * Invite a new user by email.
 *
 * The endpoint errors unless invitations are enabled in the deployment's
 * configuration.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The invitation to create.
 */
export const postInvitation = async (client: Http.Client, payload: InvitationPost): Promise<InvitationPostResponse> =>
    Http.decode(InvitationPostResponse, await Http.post(client, "/api/invitations", Http.body(payload)));

/**
 * Options for updating an invitation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateInvitationOptions {
    /** Replacement list of groups the invited user will join. */
    readonly groupIds?: ReadonlyArray<number> | undefined;
    /**
     * Replacement list of streams the invited user will access. The resulting
     * streams must cover every stream of the invited groups.
     */
    readonly streamIds?: ReadonlyArray<number> | undefined;
    /** New role, either `"Full user"` or `"View only"`. */
    readonly role?: string | undefined;
    /** Arrow-parseable date after which the new account is deactivated. */
    readonly userExpirationDate?: string | undefined;
}

/**
 * Update a pending invitation.
 *
 * @since 1.0.0
 * @category Requests
 * @param invitationId - ID of the invitation to update. Only the inviting user
 *   may update it.
 */
export const updateInvitation = async (
    client: Http.Client,
    invitationId: number,
    options: UpdateInvitationOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        `/api/invitations/${invitationId}`,
        Http.body({
            groupIDs: options.groupIds,
            streamIDs: options.streamIds,
            role: options.role,
            userExpirationDate: options.userExpirationDate,
        })
    );
};

/**
 * Delete an invitation.
 *
 * @since 1.0.0
 * @category Requests
 * @param invitationId - ID of the invitation to delete. Only the inviting user
 *   may delete it.
 */
export const deleteInvitation = async (client: Http.Client, invitationId: number): Promise<void> => {
    await Http.del(client, `/api/invitations/${invitationId}`);
};
