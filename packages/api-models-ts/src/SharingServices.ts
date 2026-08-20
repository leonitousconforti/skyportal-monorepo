/**
 * Request and response models for `/api/sharing_service`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Instruments from "./Instruments.ts";
import * as Schemas from "./Schemas.ts";
import * as Sources from "./Sources.ts";
import * as Streams from "./Streams.ts";

/**
 * Which photometry a sharing service publishes (upstream
 * `PHOTOMETRY_OPTIONS`).
 *
 * The server fills in every option it knows about, defaulting each to true, so
 * a stored value always carries the full set.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryOptions = Schemas.model(
    v.strictObject({
        first_and_last_detections: Schemas.NullishBoolean,
        auto_sharing_allow_archival: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryOptions = v.InferOutput<typeof PhotometryOptions>;

/**
 * A coauthor of a service's submissions (upstream `SharingServiceCoauthor`).
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceCoauthor = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sharing_service_id: Schemas.NullishInteger,
        user_id: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceCoauthor = v.InferOutput<typeof SharingServiceCoauthor>;

/**
 * An auto-publisher (upstream `SharingServiceGroupAutoPublisher`).
 *
 * `user_id` is a column property derived from `group_user_id` rather than a
 * stored column.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceGroupAutoPublisher = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sharing_service_group_id: Schemas.NullishInteger,
        group_user_id: Schemas.NullishInteger,
        user_id: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceGroupAutoPublisher = v.InferOutput<
    typeof SharingServiceGroupAutoPublisher
>;

/**
 * A group's access to a service (upstream `SharingServiceGroup`).
 *
 * The `group` and `sharing_service` relationships are never eager-loaded by
 * the endpoints, so they never appear and are not declared.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceGroup = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sharing_service_id: Schemas.NullishInteger,
        group_id: Schemas.NullishInteger,
        owner: Schemas.NullishBoolean,
        auto_share_to_tns: Schemas.NullishBoolean,
        auto_share_to_hermes: Schemas.NullishBoolean,
        auto_sharing_allow_bots: Schemas.NullishBoolean,
        auto_publishers: Schemas.list(SharingServiceGroupAutoPublisher),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceGroup = v.InferOutput<typeof SharingServiceGroup>;

/**
 * A service publishing objects externally (upstream `SharingService`).
 *
 * `owner_group_ids` is not a column: the endpoint derives it from the owning
 * entries of `groups` and injects it. The encrypted TNS credentials
 * (`_tns_altdata`) are never serialized, and the `submissions` relationship is
 * never eager-loaded, so neither is declared.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingService = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        acknowledgments: Schemas.NullishString,
        testing: Schemas.NullishBoolean,
        photometry_options: Schemas.nullish(PhotometryOptions),
        enable_sharing_with_tns: Schemas.NullishBoolean,
        enable_sharing_with_hermes: Schemas.NullishBoolean,
        tns_bot_name: Schemas.NullishString,
        tns_bot_id: Schemas.NullishInteger,
        tns_source_group_id: Schemas.NullishInteger,
        publish_existing_tns_objects: Schemas.NullishBoolean,
        owner_group_ids: Schemas.list(Schemas.Integer),
        groups: Schemas.list(SharingServiceGroup),
        coauthors: Schemas.list(SharingServiceCoauthor),
        instruments: Schemas.list(Instruments.Instrument),
        streams: Schemas.list(Streams.Stream),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingService = v.InferOutput<typeof SharingService>;

/**
 * A publication request (upstream `SharingServiceSubmission`).
 *
 * `tns_name` is not a column: the endpoint copies it off the submitted object.
 * `tns_payload`, `tns_response` and `hermes_response` are deferred upstream and
 * only appear when explicitly requested. The `user` and `sharing_service`
 * relationships are never eager-loaded, so they are not declared.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceSubmission = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sharing_service_id: Schemas.NullishInteger,
        obj_id: Schemas.NullishString,
        obj: Schemas.nullish(Sources.Source),
        tns_name: Schemas.NullishString,
        user_id: Schemas.NullishInteger,
        custom_publishing_string: Schemas.NullishString,
        custom_remarks_string: Schemas.NullishString,
        publish_to_tns: Schemas.NullishBoolean,
        tns_status: Schemas.NullishString,
        tns_submission_id: Schemas.NullishInteger,
        tns_payload: Schemas.nullish(Schemas.JsonObject),
        tns_response: Schemas.nullish(Schemas.JsonObject),
        publish_to_hermes: Schemas.NullishBoolean,
        hermes_status: Schemas.NullishString,
        hermes_response: Schemas.nullish(Schemas.JsonObject),
        archival: Schemas.NullishBoolean,
        archival_comment: Schemas.NullishString,
        auto_submission: Schemas.NullishBoolean,
        instrument_ids: Schemas.nullish(v.array(Schemas.Integer)),
        stream_ids: Schemas.nullish(v.array(Schemas.Integer)),
        photometry_options: Schemas.nullish(PhotometryOptions),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceSubmission = v.InferOutput<typeof SharingServiceSubmission>;

/**
 * One page of results from a sharing service submissions query.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceSubmissionsPage = Schemas.model(
    v.strictObject({
        sharing_service_id: Schemas.NullishInteger,
        submissions: Schemas.list(SharingServiceSubmission),
        totalMatches: v.optional(Schemas.Integer, 0),
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceSubmissionsPage = v.InferOutput<
    typeof SharingServiceSubmissionsPage
>;

/**
 * Payload for creating or updating a sharing service.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SharingServicePost {
    readonly name: string;
    readonly owner_group_ids?: ReadonlyArray<number> | undefined;
    readonly instrument_ids?: ReadonlyArray<number> | undefined;
    readonly stream_ids?: ReadonlyArray<number> | undefined;
    readonly acknowledgments?: string | undefined;
    readonly testing?: boolean | undefined;
    readonly photometry_options?: PhotometryOptions | undefined;
    readonly enable_sharing_with_tns?: boolean | undefined;
    readonly enable_sharing_with_hermes?: boolean | undefined;
    readonly tns_bot_name?: string | undefined;
    readonly tns_bot_id?: number | undefined;
    readonly tns_source_group_id?: number | undefined;
    readonly _tns_altdata?: Record<string, unknown> | undefined;
    readonly publish_existing_tns_objects?: boolean | undefined;
}

/**
 * Payload for requesting the publication of an object.
 *
 * At least one of `publish_to_tns` and `publish_to_hermes` must be true,
 * `publishers` must be a non-empty string, and `archival_comment` is required
 * when `archival` is true.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SharingServiceSubmissionPost {
    readonly obj_id: string;
    readonly sharing_service_id: number;
    readonly publishers: string;
    readonly remarks?: string | undefined;
    readonly archival?: boolean | undefined;
    readonly archival_comment?: string | undefined;
    readonly instrument_ids?: ReadonlyArray<number> | undefined;
    readonly stream_ids?: ReadonlyArray<number> | undefined;
    readonly photometry_options?: PhotometryOptions | undefined;
    readonly publish_to_tns?: boolean | undefined;
    readonly publish_to_hermes?: boolean | undefined;
}

/**
 * Result of creating or updating a sharing service.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServicePutResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServicePutResponse = v.InferOutput<typeof SharingServicePutResponse>;

/**
 * Result of adding a coauthor to a sharing service.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceCoauthorPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceCoauthorPostResponse = v.InferOutput<
    typeof SharingServiceCoauthorPostResponse
>;

/**
 * Result of granting or editing a group's access to a service.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceGroupPutResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceGroupPutResponse = v.InferOutput<
    typeof SharingServiceGroupPutResponse
>;

/**
 * Result of adding auto-publishers to a sharing service group.
 *
 * @since 1.0.0
 * @category Models
 */
export const SharingServiceAutoPublishersPostResponse = Schemas.model(
    v.strictObject({
        ids: Schemas.list(Schemas.Integer),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SharingServiceAutoPublishersPostResponse = v.InferOutput<
    typeof SharingServiceAutoPublishersPostResponse
>;
