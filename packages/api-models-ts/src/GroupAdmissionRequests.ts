/**
 * Request and response models for `/api/group_admission_requests`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * The state of a group admission request.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupAdmissionRequestStatus = v.picklist(["pending", "accepted", "declined"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupAdmissionRequestStatus = v.InferOutput<typeof GroupAdmissionRequestStatus>;

/**
 * A request to join a group (upstream `GroupAdmissionRequest`).
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupAdmissionRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        user_id: Schemas.NullishInteger,
        group_id: Schemas.NullishInteger,
        status: Schemas.nullish(GroupAdmissionRequestStatus),
        user: Schemas.nullish(Users.User),
        group: Schemas.nullish(Groups.Group),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupAdmissionRequest = v.InferOutput<typeof GroupAdmissionRequest>;

/**
 * Result of creating a group admission request.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupAdmissionRequestPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupAdmissionRequestPostResponse = v.InferOutput<typeof GroupAdmissionRequestPostResponse>;
