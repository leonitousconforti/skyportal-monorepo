/**
 * Request and response models for `/api/followup_request`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Allocations from "./Allocations.ts";
import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * A serialized exchange with a facility (upstream `FacilityTransaction`).
 *
 * `followup_request` and `observation_plan_request` are the parent rows; they
 * stay free-form to avoid a circular import back into this module and into
 * {@link skyportal-js/ObservationPlans}.
 *
 * @since 1.0.0
 * @category Models
 */
export const FacilityTransaction = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        request: Schemas.nullish(Schemas.JsonObject),
        response: Schemas.nullish(Schemas.JsonObject),
        followup_request_id: Schemas.NullishInteger,
        observation_plan_request_id: Schemas.NullishInteger,
        initiator_id: Schemas.NullishInteger,
        initiator: Schemas.nullish(Users.User),
        followup_request: Schemas.nullish(Schemas.JsonObject),
        observation_plan_request: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type FacilityTransaction = v.InferOutput<typeof FacilityTransaction>;

/**
 * A queued facility call (upstream `FacilityTransactionRequest`).
 *
 * @since 1.0.0
 * @category Models
 */
export const FacilityTransactionRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        last_query: Schemas.NullishTimestamp,
        method: Schemas.NullishString,
        endpoint: Schemas.NullishString,
        data: Schemas.nullish(Schemas.JsonObject),
        params: Schemas.nullish(Schemas.JsonObject),
        headers: Schemas.nullish(Schemas.JsonObject),
        status: Schemas.NullishString,
        followup_request_id: Schemas.NullishInteger,
        observation_plan_request_id: Schemas.NullishInteger,
        initiator_id: Schemas.NullishInteger,
        initiator: Schemas.nullish(Users.User),
        followup_request: Schemas.nullish(Schemas.JsonObject),
        observation_plan_request: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type FacilityTransactionRequest = v.InferOutput<typeof FacilityTransactionRequest>;

/**
 * A user watching a follow-up request (upstream `FollowupRequestUser`).
 *
 * @since 1.0.0
 * @category Models
 */
export const FollowupRequestWatcher = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        followuprequest_id: Schemas.NullishInteger,
        user_id: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type FollowupRequestWatcher = v.InferOutput<typeof FollowupRequestWatcher>;

/**
 * The fields of a {@link FollowupRequest}.
 *
 * @since 1.0.0
 * @category Models
 */
export const FollowupRequestEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    obj_id: Schemas.NullishString,
    allocation_id: Schemas.NullishInteger,
    requester_id: Schemas.NullishInteger,
    last_modified_by_id: Schemas.NullishInteger,
    payload: v.optional(Schemas.JsonObject, () => ({})),
    status: Schemas.NullishString,
    comment: Schemas.NullishString,
    obj: Schemas.nullish(Schemas.JsonObject),
    allocation: Schemas.nullish(Allocations.Allocation),
    requester: Schemas.nullish(Users.User),
    last_modified_by: Schemas.nullish(Users.User),
    target_groups: Schemas.list(Groups.Group),
    watchers: Schemas.list(FollowupRequestWatcher),
    transactions: Schemas.list(FacilityTransaction),
    transaction_requests: Schemas.list(FacilityTransactionRequest),
    photometry: Schemas.list(Schemas.JsonObject),
    photometric_series: Schemas.list(Schemas.JsonObject),
    spectra: Schemas.list(Schemas.JsonObject),
    rise_time_utc: Schemas.nullish(v.union([v.string(), v.array(v.string())])),
    set_time_utc: Schemas.nullish(v.union([v.string(), v.array(v.string())])),
};

/**
 * A follow-up observation request (upstream `FollowupRequest`).
 *
 * `obj` stays free-form because typing it as
 * {@link skyportal-js/Sources!Source} would create an import cycle; the same
 * applies to `photometry`, `photometric_series` and `spectra`, which all point
 * back at the requesting object.
 *
 * @since 1.0.0
 * @category Models
 */
export const FollowupRequest = Schemas.model(v.strictObject(FollowupRequestEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type FollowupRequest = v.InferOutput<typeof FollowupRequest>;

/**
 * One page of results from a follow-up requests query.
 *
 * @since 1.0.0
 * @category Models
 */
export const FollowupRequestsPage = Schemas.model(
    v.strictObject({
        followup_requests: Schemas.list(FollowupRequest),
        totalMatches: v.optional(Schemas.Integer, 0),
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type FollowupRequestsPage = v.InferOutput<typeof FollowupRequestsPage>;

/**
 * Payload for submitting a follow-up request.
 *
 * `payload` holds the instrument-specific request parameters; the allocation's
 * instrument API defines its schema. If `target_group_ids` is omitted, the
 * server applies its default visibility to the results.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FollowupRequestPost {
    readonly obj_id: string;
    readonly allocation_id: number;
    readonly payload: Record<string, unknown>;
    readonly target_group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of submitting a follow-up request.
 *
 * @since 1.0.0
 * @category Models
 */
export const FollowupRequestPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type FollowupRequestPostResponse = v.InferOutput<typeof FollowupRequestPostResponse>;

/**
 * A default follow-up request (upstream `DefaultFollowupRequest`).
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultFollowupRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        requester_id: Schemas.NullishInteger,
        allocation_id: Schemas.NullishInteger,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        default_followup_name: Schemas.NullishString,
        source_filter: Schemas.nullish(v.union([Schemas.JsonObject, v.string()])),
        constraints: Schemas.nullish(Schemas.JsonObject),
        priority_order: Schemas.NullishString,
        validity_days: Schemas.NullishInteger,
        comment: Schemas.NullishString,
        implements_update: Schemas.NullishBoolean,
        allocation: Schemas.nullish(Allocations.Allocation),
        requester: Schemas.nullish(Users.User),
        target_groups: Schemas.list(Groups.Group),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultFollowupRequest = v.InferOutput<typeof DefaultFollowupRequest>;

/**
 * Payload for creating a default follow-up request.
 *
 * `payload` holds the instrument-specific request parameters and must not
 * contain `start_date` or `end_date` (the server fills the real window when
 * the request fires on source save). `source_filter` decides which saved
 * sources trigger the request and is required.
 *
 * @since 1.0.0
 * @category Models
 */
export interface DefaultFollowupRequestPost {
    readonly allocation_id: number;
    readonly payload: Record<string, unknown>;
    readonly default_followup_name: string;
    readonly source_filter: Record<string, unknown>;
    readonly target_group_ids?: ReadonlyArray<number> | undefined;
    readonly comment?: string | undefined;
    readonly implements_update?: boolean | undefined;
    readonly priority_order?: string | undefined;
    readonly validity_days?: number | undefined;
    readonly radius?: number | undefined;
    readonly not_if_duplicates?: boolean | undefined;
    readonly source_group_ids?: ReadonlyArray<number> | undefined;
    readonly ignore_source_group_ids?: ReadonlyArray<number> | undefined;
    readonly not_if_classified?: boolean | undefined;
    readonly not_if_spectra_exist?: boolean | undefined;
    readonly not_if_tns_classified?: boolean | undefined;
    readonly not_if_tns_reported?: number | undefined;
    readonly not_if_assignment_exists?: boolean | undefined;
    readonly ignore_allocation_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of creating a default follow-up request.
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultFollowupRequestPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultFollowupRequestPostResponse = v.InferOutput<typeof DefaultFollowupRequestPostResponse>;

/**
 * Status of a follow-up request after a photometry retrieval.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryRequestStatus = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        request_status: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryRequestStatus = v.InferOutput<typeof PhotometryRequestStatus>;
