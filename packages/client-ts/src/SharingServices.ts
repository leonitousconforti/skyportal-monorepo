/**
 * Typed endpoint functions for `/api/sharing_service`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Http from "./Http.ts";
import { SharingService, SharingServiceSubmission, SharingServiceSubmissionsPage, SharingServicePutResponse, SharingServiceCoauthorPostResponse, SharingServiceGroupPutResponse, SharingServiceAutoPublishersPostResponse } from "skyportal-js-models/SharingServices";
import type { SharingServicePost, SharingServiceSubmissionPost } from "skyportal-js-models/SharingServices";

export * from "skyportal-js-models/SharingServices";

/**
 * Retrieve all sharing services visible to the token.
 *
 * Only services shared with one of the caller's groups are returned, unless
 * the caller is a system admin. The TNS credentials (`_tns_altdata`) are never
 * included in the response.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSharingServices = async (client: Http.Client): Promise<Array<SharingService>> =>
    Http.decode(v.array(SharingService), await Http.get(client, "/api/sharing_service"));

/**
 * Retrieve a single sharing service by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 */
export const fetchSharingService = async (client: Http.Client, sharingServiceId: number): Promise<SharingService> =>
    Http.decode(SharingService, await Http.get(client, `/api/sharing_service/${sharingServiceId}`));

/**
 * Create a sharing service.
 *
 * `name` must be unique and at least one instrument must be given.
 * `owner_group_ids` lists the groups that will own the service; owner groups
 * are created with all their auto-sharing flags off. If
 * `enable_sharing_with_tns` is true, then `tns_bot_id`, `tns_source_group_id`
 * and a `_tns_altdata` containing an `api_key` are all required. `testing`
 * defaults to true server-side, meaning payloads are stored but nothing is
 * actually published.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The service to create.
 */
export const postSharingService = async (
    client: Http.Client,
    payload: SharingServicePost
): Promise<SharingServicePutResponse> =>
    Http.decode(SharingServicePutResponse, await Http.put(client, "/api/sharing_service", Http.body(payload)));

/**
 * Update an existing sharing service.
 *
 * Omitted fields are left unchanged, so `name` may simply repeat the current
 * name. `owner_group_ids` is ignored here; use
 * {@link updateSharingServiceGroup} to change ownership. Instruments are only
 * replaced when `instrument_ids` is non-empty, while `stream_ids` always
 * replaces the current streams. Disabling TNS or Hermes sharing also clears
 * the matching auto-sharing flags on every group of the service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service to update.
 * @param payload - The new values.
 */
export const updateSharingService = async (
    client: Http.Client,
    sharingServiceId: number,
    payload: SharingServicePost
): Promise<SharingServicePutResponse> =>
    Http.decode(
        SharingServicePutResponse,
        await Http.put(client, `/api/sharing_service/${sharingServiceId}`, Http.body(payload))
    );

/**
 * Delete a sharing service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service to delete. Only a member
 *   of one of its owner groups may delete it.
 */
export const deleteSharingService = async (client: Http.Client, sharingServiceId: number): Promise<void> => {
    await Http.del(client, `/api/sharing_service/${sharingServiceId}`);
};

/**
 * Request the publication of an object through a sharing service.
 *
 * Submitting the same object to the same destination twice through the same
 * service is rejected. The submission is queued and processed asynchronously;
 * poll {@link fetchSharingServiceSubmissions} for its status.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The submission to queue.
 */
export const postSharingServiceSubmission = async (
    client: Http.Client,
    payload: SharingServiceSubmissionPost
): Promise<void> => {
    await Http.post(client, "/api/sharing_service/submission", Http.body(payload));
};

/**
 * Retrieve a single sharing service submission by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceSubmissionId - ID of the submission.
 * @param sharingServiceId - ID of the sharing service the submission belongs
 *   to. Required by the endpoint even though the submission ID is unique.
 */
export const fetchSharingServiceSubmission = async (
    client: Http.Client,
    sharingServiceSubmissionId: number,
    sharingServiceId: number
): Promise<SharingServiceSubmission> =>
    Http.decode(
        SharingServiceSubmission,
        await Http.get(client, `/api/sharing_service/submission/${sharingServiceSubmissionId}`, {
            sharing_service_id: sharingServiceId,
        })
    );

/**
 * Options for querying a sharing service's submissions.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSharingServiceSubmissionsOptions {
    /** Pagination controls. Submissions are returned newest first. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /** Include the payload sent to TNS, which is deferred by default. */
    readonly includePayload?: boolean | undefined;
    /**
     * Include the raw response from the external service, which is deferred by
     * default.
     */
    readonly includeResponse?: boolean | undefined;
    /** Restrict to submissions of this object. */
    readonly objectId?: string | undefined;
}

/**
 * Query the submissions of a sharing service, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service whose submissions are
 *   queried.
 */
export const fetchSharingServiceSubmissions = async (
    client: Http.Client,
    sharingServiceId: number,
    options: FetchSharingServiceSubmissionsOptions = {}
): Promise<SharingServiceSubmissionsPage> =>
    Http.decode(
        SharingServiceSubmissionsPage,
        await Http.get(client, "/api/sharing_service/submission", {
            sharing_service_id: sharingServiceId,
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 100,
            include_payload: options.includePayload ?? false,
            include_response: options.includeResponse ?? false,
            objectID: options.objectId,
        })
    );

/**
 * Add a coauthor to a sharing service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 * @param userId - ID of the user to credit as a coauthor. The user must have at
 *   least one affiliation set in their profile and must not be a bot.
 */
export const postSharingServiceCoauthor = async (
    client: Http.Client,
    sharingServiceId: number,
    userId: number
): Promise<SharingServiceCoauthorPostResponse> =>
    Http.decode(
        SharingServiceCoauthorPostResponse,
        await Http.post(client, `/api/sharing_service/${sharingServiceId}/coauthor/${userId}`)
    );

/**
 * Remove a coauthor from a sharing service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 * @param userId - ID of the user to remove as a coauthor.
 */
export const deleteSharingServiceCoauthor = async (
    client: Http.Client,
    sharingServiceId: number,
    userId: number
): Promise<void> => {
    await Http.del(client, `/api/sharing_service/${sharingServiceId}/coauthor/${userId}`);
};

/**
 * Options for a group's access to a sharing service.
 *
 * When the group already has access, at least one of the options must be
 * given; otherwise omitted options default to false on the new access.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateSharingServiceGroupOptions {
    /**
     * Whether the group owns the sharing service. Ownership cannot be removed
     * from the only owning group.
     */
    readonly owner?: boolean | undefined;
    /**
     * Whether new sources saved to the group are published automatically.
     */
    readonly autoShareToTns?: boolean | undefined;
    readonly autoShareToHermes?: boolean | undefined;
    /**
     * Whether bot users may act as auto-publishers. It cannot be turned off
     * while a bot is still listed as an auto-publisher.
     */
    readonly autoSharingAllowBots?: boolean | undefined;
}

/**
 * Give a group access to a sharing service, or edit its settings.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 * @param groupId - ID of the group to add or edit.
 */
export const updateSharingServiceGroup = async (
    client: Http.Client,
    sharingServiceId: number,
    groupId: number,
    options: UpdateSharingServiceGroupOptions = {}
): Promise<SharingServiceGroupPutResponse> =>
    Http.decode(
        SharingServiceGroupPutResponse,
        await Http.put(
            client,
            `/api/sharing_service/${sharingServiceId}/group/${groupId}`,
            Http.body({
                owner: options.owner,
                auto_share_to_tns: options.autoShareToTns,
                auto_share_to_hermes: options.autoShareToHermes,
                auto_sharing_allow_bots: options.autoSharingAllowBots,
            })
        )
    );

/**
 * Remove a group's access to a sharing service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 * @param groupId - ID of the group to remove. The only group owning the service
 *   cannot be removed; add another owner group first.
 */
export const deleteSharingServiceGroup = async (
    client: Http.Client,
    sharingServiceId: number,
    groupId: number
): Promise<void> => {
    await Http.del(client, `/api/sharing_service/${sharingServiceId}/group/${groupId}`);
};

/**
 * Add auto-publishers to a group of a sharing service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 * @param groupId - ID of the group, which must already have access to the
 *   service.
 * @param userIds - IDs of the users to add. Each must be a member of the group
 *   and have at least one affiliation set in their profile. Bot users are only
 *   accepted when the group has `auto_sharing_allow_bots` set. The request
 *   fails as a whole if any user is rejected.
 */
export const postSharingServiceAutoPublishers = async (
    client: Http.Client,
    sharingServiceId: number,
    groupId: number,
    userIds: ReadonlyArray<number>
): Promise<SharingServiceAutoPublishersPostResponse> =>
    Http.decode(
        SharingServiceAutoPublishersPostResponse,
        await Http.post(client, `/api/sharing_service/${sharingServiceId}/group/${groupId}/auto_publisher`, {
            user_ids: userIds,
        })
    );

/**
 * Remove auto-publishers from a group of a sharing service.
 *
 * @since 1.0.0
 * @category Requests
 * @param sharingServiceId - ID of the sharing service.
 * @param groupId - ID of the group.
 * @param userIds - IDs of the users to remove. Each must currently be an
 *   auto-publisher of the group; the request fails as a whole otherwise.
 */
export const deleteSharingServiceAutoPublishers = async (
    client: Http.Client,
    sharingServiceId: number,
    groupId: number,
    userIds: ReadonlyArray<number>
): Promise<void> => {
    await Http.del(client, `/api/sharing_service/${sharingServiceId}/group/${groupId}/auto_publisher`, {
        user_ids: userIds,
    });
};
