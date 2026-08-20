/**
 * Request and response models for `/api/assignment`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * Allowed follow-up priorities, lowest (`"1"`) to highest (`"5"`).
 *
 * @since 1.0.0
 * @category Models
 */
export const FollowupPriority = v.picklist(["1", "2", "3", "4", "5"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type FollowupPriority = v.InferOutput<typeof FollowupPriority>;

/**
 * A target assignment on an observing run (upstream `ClassicalAssignment`).
 *
 * `obj` stays free-form because typing it as
 * {@link skyportal-js/Sources!Source} would create an import cycle.
 * `/api/assignment` serializes through the auto-generated marshmallow schema,
 * so relationships other than `obj` and `requester` dump as bare primary keys;
 * `/api/observing_run/<id>` instead returns `to_dict()` output plus the
 * last-detection and rise/set extras.
 *
 * @since 1.0.0
 * @category Models
 */
export const Assignment = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        run_id: Schemas.NullishInteger,
        requester_id: Schemas.NullishInteger,
        last_modified_by_id: Schemas.NullishInteger,
        status: Schemas.NullishString,
        priority: Schemas.nullish(FollowupPriority),
        comment: Schemas.NullishString,
        obj: Schemas.nullish(Schemas.JsonObject),
        requester: Schemas.nullish(Users.User),
        last_modified_by: Schemas.NullishInteger,
        run: Schemas.NullishInteger,
        spectra: Schemas.list(Schemas.Integer),
        photometry: Schemas.list(Schemas.Integer),
        photometric_series: Schemas.list(Schemas.Integer),
        rise_time_utc: Schemas.NullishString,
        set_time_utc: Schemas.NullishString,
        accessible_group_names: Schemas.list(v.string()),
        last_detected_mag: Schemas.NullishNumber,
        last_detected_filter: Schemas.NullishString,
        last_detected_mjd: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Assignment = v.InferOutput<typeof Assignment>;

/**
 * Payload for assigning a target to an observing run.
 *
 * `priority` is a string from `"1"` (lowest) to `"5"` (highest). The server
 * rejects the assignment if the object is already assigned to the run.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AssignmentPost {
    readonly run_id: number;
    readonly obj_id: string;
    readonly priority: FollowupPriority;
    readonly status?: string | undefined;
    readonly comment?: string | undefined;
}

/**
 * Result of posting an assignment.
 *
 * @since 1.0.0
 * @category Models
 */
export const AssignmentPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AssignmentPostResponse = v.InferOutput<typeof AssignmentPostResponse>;
