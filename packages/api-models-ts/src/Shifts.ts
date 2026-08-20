/**
 * Request and response models for `/api/shifts`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * A user's membership in a shift (upstream `ShiftUser`).
 *
 * `username`, `first_name` and `last_name` are copied up from the nested
 * `user` by the single-shift handler.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftUserMembership = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        shift_id: Schemas.NullishInteger,
        user_id: Schemas.NullishInteger,
        admin: Schemas.NullishBoolean,
        needs_replacement: Schemas.NullishBoolean,
        user: Schemas.nullish(Users.User),
        username: Schemas.NullishString,
        first_name: Schemas.NullishString,
        last_name: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftUserMembership = v.InferOutput<typeof ShiftUserMembership>;

/**
 * A shift comment's author, with the gravatar URL the handler adds.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftCommentAuthor = Schemas.model(
    v.strictObject({
        ...Users.UserEntries,
        gravatar_url: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftCommentAuthor = v.InferOutput<typeof ShiftCommentAuthor>;

/**
 * A comment posted about a shift (upstream `CommentOnShift`).
 *
 * The handler strips `attachment_bytes` and tags each comment with
 * `resourceType`.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftComment = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        text: Schemas.NullishString,
        attachment_name: Schemas.NullishString,
        origin: Schemas.NullishString,
        bot: Schemas.NullishBoolean,
        author_id: Schemas.NullishInteger,
        shift_id: Schemas.NullishInteger,
        author: Schemas.nullish(ShiftCommentAuthor),
        groups: Schemas.list(Groups.Group),
        resourceType: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftComment = v.InferOutput<typeof ShiftComment>;

/**
 * A member of a shift's group, as returned alongside a single shift.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftGroupMember = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        username: Schemas.NullishString,
        first_name: Schemas.NullishString,
        last_name: Schemas.NullishString,
        expiration_date: Schemas.NullishTimestamp,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftGroupMember = v.InferOutput<typeof ShiftGroupMember>;

/**
 * A shift's group, as hand-assembled by the single-shift handler.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftGroup = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        name: Schemas.NullishString,
        has_admin_access: Schemas.NullishBoolean,
        group_users: Schemas.list(ShiftGroupMember),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftGroup = v.InferOutput<typeof ShiftGroup>;

/**
 * A group scanning shift (upstream `Shift`).
 *
 * `shift_users_ids` is a column property (an aggregate of the shift's user
 * IDs), so it is present even when no relationship is loaded.
 *
 * @since 1.0.0
 * @category Models
 */
export const Shift = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        description: Schemas.NullishString,
        start_date: Schemas.NullishTimestamp,
        end_date: Schemas.NullishTimestamp,
        group_id: Schemas.NullishInteger,
        required_users_number: Schemas.NullishInteger,
        shift_users_ids: Schemas.nullish(v.array(Schemas.Integer)),
        shift_users: Schemas.list(ShiftUserMembership),
        users: Schemas.list(Users.User),
        comments: Schemas.list(ShiftComment),
        reminders: Schemas.list(Schemas.JsonObject),
        group: Schemas.nullish(ShiftGroup),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Shift = v.InferOutput<typeof Shift>;

/**
 * Payload for creating a new shift.
 *
 * `shift_admins` lists the IDs of users to make admins of the new shift.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ShiftPost {
    readonly name: string;
    readonly start_date: string;
    readonly end_date: string;
    readonly group_id: number;
    readonly description?: string | undefined;
    readonly required_users_number?: number | undefined;
    readonly shift_admins?: ReadonlyArray<number> | undefined;
}

/**
 * Result of creating a new shift.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftPostResponse = v.InferOutput<typeof ShiftPostResponse>;

/**
 * Result of adding a user to a shift.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftUserPostResponse = Schemas.model(
    v.strictObject({
        shift_id: Schemas.Integer,
        user_id: Schemas.Integer,
        admin: v.boolean(),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftUserPostResponse = v.InferOutput<typeof ShiftUserPostResponse>;

/**
 * One section (shifts or GCN events) of a shift summary report.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftSummarySection = Schemas.model(
    v.strictObject({
        total: Schemas.NullishInteger,
        data: Schemas.list(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftSummarySection = v.InferOutput<typeof ShiftSummarySection>;

/**
 * Summary of shift-user activity over a period.
 *
 * @since 1.0.0
 * @category Models
 */
export const ShiftSummaryReport = Schemas.model(
    v.strictObject({
        shifts: Schemas.nullish(ShiftSummarySection),
        gcns: Schemas.nullish(ShiftSummarySection),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ShiftSummaryReport = v.InferOutput<typeof ShiftSummaryReport>;
