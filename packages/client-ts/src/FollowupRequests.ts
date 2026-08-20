/**
 * Typed endpoint functions for `/api/followup_request`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Http from "./Http.ts";
import { FollowupRequest, FollowupRequestsPage, FollowupRequestPostResponse, DefaultFollowupRequest, DefaultFollowupRequestPostResponse, PhotometryRequestStatus } from "skyportal-js-models/FollowupRequests";
import type { FollowupRequestPost, DefaultFollowupRequestPost } from "skyportal-js-models/FollowupRequests";

export * from "skyportal-js-models/FollowupRequests";

/**
 * Options for retrieving a single follow-up request.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchFollowupRequestOptions {
    /**
     * Load the target object's thumbnails with the request. On by default;
     * pass false to skip them.
     */
    readonly includeObjThumbnails?: boolean | undefined;
}

/**
 * Retrieve a single follow-up request by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request.
 */
export const fetchFollowupRequest = async (
    client: Http.Client,
    followupRequestId: number,
    options: FetchFollowupRequestOptions = {}
): Promise<FollowupRequest> =>
    Http.decode(
        FollowupRequest,
        await Http.get(client, `/api/followup_request/${followupRequestId}`, {
            includeObjThumbnails: options.includeObjThumbnails ?? true,
        })
    );

/**
 * Options for querying follow-up requests.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchFollowupRequestsOptions {
    /** Pagination controls. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /** Restrict to requests whose object ID contains this string. */
    readonly sourceId?: string | undefined;
    /**
     * Restrict to requests on this instrument. Ignored if `allocationId` is
     * provided.
     */
    readonly instrumentId?: number | undefined;
    /** Restrict to requests under this allocation. */
    readonly allocationId?: number | undefined;
    /** Restrict to requests whose status matches this string. */
    readonly status?: string | undefined;
    /**
     * Restrict to requests created in this date range, as ISO-format date
     * strings, e.g. `"2020-01-01"`.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    /**
     * Restrict to requests whose payload observation window falls in this date
     * range, as ISO-format date strings.
     */
    readonly observationStartDate?: string | undefined;
    readonly observationEndDate?: string | undefined;
    /** Restrict to requests with payload priority at or above this value. */
    readonly priorityThreshold?: number | undefined;
    /** Restrict to requests made by these user IDs. */
    readonly requesters?: ReadonlyArray<number> | undefined;
    /**
     * Field to sort by; one of `"created_at"`, `"modified"`, `"status"` or
     * `"obj"`.
     */
    readonly sortBy?: string | undefined;
    /** `"asc"` or `"desc"`. */
    readonly sortOrder?: string | undefined;
}

/**
 * Query follow-up requests, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchFollowupRequests = async (
    client: Http.Client,
    options: FetchFollowupRequestsOptions = {}
): Promise<FollowupRequestsPage> =>
    Http.decode(
        FollowupRequestsPage,
        await Http.get(client, "/api/followup_request", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 100,
            sortBy: options.sortBy ?? "created_at",
            sortOrder: options.sortOrder ?? "asc",
            sourceID: options.sourceId,
            instrumentID: options.instrumentId,
            allocationID: options.allocationId,
            status: options.status,
            startDate: options.startDate,
            endDate: options.endDate,
            observationStartDate: options.observationStartDate,
            observationEndDate: options.observationEndDate,
            priorityThreshold: options.priorityThreshold,
            requesters: Http.commaSeparated(options.requesters),
        })
    );

/**
 * Submit a follow-up request.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The request to submit.
 */
export const postFollowupRequest = async (
    client: Http.Client,
    payload: FollowupRequestPost
): Promise<FollowupRequestPostResponse> =>
    Http.decode(FollowupRequestPostResponse, await Http.post(client, "/api/followup_request", Http.body(payload)));

/**
 * Delete a follow-up request.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request to delete.
 */
export const deleteFollowupRequest = async (client: Http.Client, followupRequestId: number): Promise<void> => {
    await Http.del(client, `/api/followup_request/${followupRequestId}`);
};

/**
 * Options for updating a follow-up request.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateFollowupRequestOptions {
    /** New status for the request. */
    readonly status?: string | undefined;
    /** Object ID of the target. Required when `status` is omitted. */
    readonly objId?: string | undefined;
    /** Allocation for the request. Required when `status` is omitted. */
    readonly allocationId?: number | undefined;
    /**
     * Instrument-specific request parameters; the allocation's instrument API
     * defines its schema.
     */
    readonly payload?: Record<string, unknown> | undefined;
    /**
     * Restrict the results' visibility to these groups. If omitted, the
     * visibility is left unchanged.
     */
    readonly targetGroupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Update a follow-up request.
 *
 * If `status` is given, the server updates the stored fields directly without
 * contacting the instrument. Otherwise `objId` and `allocationId` are required
 * and the request is updated (or re-submitted, if it previously failed or was
 * rejected) through the instrument's facility API.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request to update.
 */
export const updateFollowupRequest = async (
    client: Http.Client,
    followupRequestId: number,
    options: UpdateFollowupRequestOptions = {}
): Promise<void> => {
    await Http.put(
        client,
        `/api/followup_request/${followupRequestId}`,
        Http.body({
            status: options.status,
            obj_id: options.objId,
            allocation_id: options.allocationId,
            payload: options.payload,
            target_group_ids: options.targetGroupIds,
        })
    );
};

/**
 * Set the comment on a follow-up request.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request.
 * @param comment - The comment text. Pass `null` (or an empty string) to clear
 *   the request's comment.
 */
export const postFollowupRequestComment = async (
    client: Http.Client,
    followupRequestId: number,
    comment: string | null
): Promise<void> => {
    await Http.put(client, `/api/followup_request/${followupRequestId}/comment`, {
        comment,
    });
};

/**
 * Add a follow-up request to the token user's watch list.
 *
 * The server rejects the call if the user is already watching the request.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request to watch.
 */
export const postFollowupRequestWatcher = async (client: Http.Client, followupRequestId: number): Promise<void> => {
    await Http.post(client, `/api/followup_request/watch/${followupRequestId}`, {});
};

/**
 * Remove a follow-up request from the token user's watch list.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request to stop watching.
 */
export const deleteFollowupRequestWatcher = async (client: Http.Client, followupRequestId: number): Promise<void> => {
    await Http.del(client, `/api/followup_request/watch/${followupRequestId}`);
};

/**
 * Options for building a follow-up schedule.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchFollowupRequestScheduleOptions {
    /**
     * File format of the schedule: `"csv"` (default), `"png"`, or `"pdf"`.
     */
    readonly outputFormat?: string | undefined;
    /** Restrict to requests whose object ID contains this string. */
    readonly sourceId?: string | undefined;
    /**
     * Restrict to requests created in this date range, as ISO-format date
     * strings, e.g. `"2020-01-01"`.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    /** Restrict to requests whose status matches this string. */
    readonly status?: string | undefined;
    /** Restrict to requests with payload priority at or above this value. */
    readonly priorityThreshold?: number | undefined;
    /** Scheduler time resolution in seconds. Server default is 20. */
    readonly timeResolution?: number | undefined;
    /**
     * Observation window, as ISO-format date strings. Server defaults are now
     * and 12 hours from now.
     */
    readonly observationStartDate?: string | undefined;
    readonly observationEndDate?: string | undefined;
    /** Include standard stars in the schedule. */
    readonly includeStandards?: boolean | undefined;
    /** Schedule only standard stars, no follow-up requests. */
    readonly standardsOnly?: boolean | undefined;
    /**
     * Origin of the standard stars, as defined in the server config. Server
     * default is `"ESO"`.
     */
    readonly standardType?: string | undefined;
    /**
     * Highest and lowest standard-star magnitude to include, e.g. `"(12,9)"`.
     */
    readonly magnitudeRange?: string | undefined;
}

/**
 * Build an observation schedule for an instrument's follow-up requests.
 *
 * Returns the schedule file contents as bytes; the server needs at least one
 * request (or standard) to schedule.
 *
 * @since 1.0.0
 * @category Requests
 * @param instrumentId - ID of the instrument to schedule.
 */
export const fetchFollowupRequestSchedule = (
    client: Http.Client,
    instrumentId: number,
    options: FetchFollowupRequestScheduleOptions = {}
): Promise<Uint8Array> =>
    Http.getContent(client, `/api/followup_request/schedule/${instrumentId}`, {
        output_format: options.outputFormat ?? "csv",
        sourceID: options.sourceId,
        startDate: options.startDate,
        endDate: options.endDate,
        status: options.status,
        priorityThreshold: options.priorityThreshold,
        timeResolution: options.timeResolution,
        observationStartDate: options.observationStartDate,
        observationEndDate: options.observationEndDate,
        includeStandards: options.includeStandards === true ? "true" : undefined,
        standardsOnly: options.standardsOnly === true ? "true" : undefined,
        standardType: options.standardType,
        magnitudeRange: options.magnitudeRange,
    });

/**
 * Options for reprioritizing follow-up requests.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateFollowupRequestPrioritizationOptions {
    /** Priority source: `"magnitude"` (server default) or `"localization"`. */
    readonly priorityType?: string | undefined;
    /**
     * Ordering for brightness-based prioritization: `"ascending"` (brightest
     * first, server default) or `"descending"`.
     */
    readonly magnitudeOrdering?: string | undefined;
    /**
     * Localization to weight by. Required when `priorityType` is
     * `"localization"`.
     */
    readonly localizationId?: number | undefined;
    /** Priority bounds for the instrument. Server defaults are 1 and 5. */
    readonly minimumPriority?: number | undefined;
    readonly maximumPriority?: number | undefined;
}

/**
 * Automatically reprioritize a set of follow-up requests.
 *
 * @since 1.0.0
 * @category Requests
 * @param requestIds - IDs of the follow-up requests to reprioritize.
 */
export const updateFollowupRequestPrioritization = async (
    client: Http.Client,
    requestIds: ReadonlyArray<number>,
    options: UpdateFollowupRequestPrioritizationOptions = {}
): Promise<void> => {
    await Http.put(
        client,
        "/api/followup_request/prioritization",
        Http.body({
            requestIds,
            priorityType: options.priorityType,
            magnitudeOrdering: options.magnitudeOrdering,
            localizationId: options.localizationId,
            minimumPriority: options.minimumPriority,
            maximumPriority: options.maximumPriority,
        })
    );
};

/**
 * Retrieve a single default follow-up request by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultFollowupRequestId - ID of the default follow-up request.
 */
export const fetchDefaultFollowupRequest = async (
    client: Http.Client,
    defaultFollowupRequestId: number
): Promise<DefaultFollowupRequest> =>
    Http.decode(
        DefaultFollowupRequest,
        await Http.get(client, `/api/default_followup_request/${defaultFollowupRequestId}`)
    );

/**
 * Retrieve all default follow-up requests visible to the token.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchDefaultFollowupRequests = async (client: Http.Client): Promise<Array<DefaultFollowupRequest>> =>
    Http.decode(v.array(DefaultFollowupRequest), await Http.get(client, "/api/default_followup_request"));

/**
 * Create a default follow-up request.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The default request to create.
 */
export const postDefaultFollowupRequest = async (
    client: Http.Client,
    payload: DefaultFollowupRequestPost
): Promise<DefaultFollowupRequestPostResponse> =>
    Http.decode(
        DefaultFollowupRequestPostResponse,
        await Http.post(client, "/api/default_followup_request", Http.body(payload))
    );

/**
 * Delete a default follow-up request.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultFollowupRequestId - ID of the default follow-up request to
 *   delete.
 */
export const deleteDefaultFollowupRequest = async (
    client: Http.Client,
    defaultFollowupRequestId: number
): Promise<void> => {
    await Http.del(client, `/api/default_followup_request/${defaultFollowupRequestId}`);
};

/**
 * Options for a follow-up photometry retrieval.
 *
 * @since 1.0.0
 * @category Models
 */
export interface RequestFollowupPhotometryOptions {
    /**
     * Have the facility API push a source refresh to the frontend after
     * retrieval. On by default.
     */
    readonly refreshSource?: boolean | undefined;
    /** Also push a refresh of the source's follow-up requests. */
    readonly refreshRequests?: boolean | undefined;
}

/**
 * Retrieve photometry for a follow-up request from its facility.
 *
 * Asks the instrument's facility API to fetch the photometry produced by the
 * request; the instrument must implement retrieval.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request.
 */
export const requestFollowupPhotometry = async (
    client: Http.Client,
    followupRequestId: number,
    options: RequestFollowupPhotometryOptions = {}
): Promise<PhotometryRequestStatus> =>
    Http.decode(
        PhotometryRequestStatus,
        await Http.get(client, `/api/photometry_request/${followupRequestId}`, {
            refreshSource: options.refreshSource ?? true,
            refreshRequests: options.refreshRequests ?? false,
        })
    );

/**
 * Post a message from a remote facility about a follow-up request.
 *
 * The request's instrument must have a Listener API; `message` must match that
 * listener's schema, and the token needs the listener's ACL.
 *
 * @since 1.0.0
 * @category Requests
 * @param followupRequestId - ID of the follow-up request the message refers to.
 * @param message - Listener-specific message content, merged into the request
 *   body alongside `followup_request_id`.
 */
export const postFacilityMessage = async (
    client: Http.Client,
    followupRequestId: number,
    message: Record<string, unknown>
): Promise<void> => {
    await Http.post(client, "/api/facility", {
        followup_request_id: followupRequestId,
        ...message,
    });
};
