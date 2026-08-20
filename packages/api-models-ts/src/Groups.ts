/**
 * Request and response models for `/api/groups`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Filters from "./Filters.ts";
import * as Schemas from "./Schemas.ts";
import * as Streams from "./Streams.ts";

/**
 * A group member as assembled by the `GET /api/groups/{id}` handler.
 *
 * The handler hand-builds this dict from a `GroupUser` and its `User` rather
 * than serializing either model, so it is not a 1:1 upstream model.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupMember = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        username: Schemas.NullishString,
        first_name: Schemas.NullishString,
        last_name: Schemas.NullishString,
        contact_email: Schemas.NullishString,
        contact_phone: Schemas.NullishString,
        oauth_uid: Schemas.NullishString,
        admin: Schemas.NullishBoolean,
        can_save: Schemas.NullishBoolean,
        can_share_photometry: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupMember = v.InferOutput<typeof GroupMember>;

/**
 * A SkyPortal group (upstream `Group`).
 *
 * Declared by hand rather than inferred, because `Group` and
 * {@link GroupUser} refer to each other.
 *
 * @since 1.0.0
 * @category Models
 */
export interface Group {
    readonly id: number;
    readonly created_at?: string | null | undefined;
    readonly modified?: string | null | undefined;
    readonly name: string;
    readonly nickname?: string | null | undefined;
    readonly description?: string | null | undefined;
    readonly private?: boolean | null | undefined;
    readonly auto_accept_requests?: boolean | null | undefined;
    readonly single_user_group: boolean;
    readonly streams?: Array<Streams.Stream> | null | undefined;
    readonly filters?: Array<Filters.Filter> | null | undefined;
    readonly group_users?: Array<GroupUser> | null | undefined;
    readonly users?: Array<GroupMember> | null | undefined;
}

/**
 * A user's membership of a group (upstream `GroupUser` join model).
 *
 * `user` stays a free-form object: typing it as {@link skyportal-js/Users!User}
 * would make groups -> users -> groups a circular import.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GroupUser {
    readonly id: number;
    readonly created_at?: string | null | undefined;
    readonly modified?: string | null | undefined;
    readonly group_id?: number | null | undefined;
    readonly user_id?: number | null | undefined;
    readonly admin?: boolean | null | undefined;
    readonly can_save?: boolean | null | undefined;
    readonly can_share_photometry?: boolean | null | undefined;
    readonly user?: Record<string, unknown> | null | undefined;
    readonly group?: Group | null | undefined;
}

/**
 * The fields of a {@link Group}, so that models which embed a group with extra
 * join-table columns can extend them.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    name: v.string(),
    nickname: Schemas.NullishString,
    description: Schemas.NullishString,
    private: Schemas.NullishBoolean,
    auto_accept_requests: Schemas.NullishBoolean,
    single_user_group: v.optional(v.boolean(), false),
    streams: Schemas.nullish(v.array(Streams.Stream)),
    filters: Schemas.nullish(v.array(Filters.Filter)),
    group_users: Schemas.nullish(v.array(v.lazy((): v.GenericSchema<unknown, GroupUser> => GroupUser))),
    users: Schemas.nullish(v.array(GroupMember)),
};

/**
 * @since 1.0.0
 * @category Models
 */
export const Group = Schemas.model(v.strictObject(GroupEntries));

/**
 * The fields of a {@link GroupUser}.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupUserEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    group_id: Schemas.NullishInteger,
    user_id: Schemas.NullishInteger,
    admin: Schemas.NullishBoolean,
    can_save: Schemas.NullishBoolean,
    can_share_photometry: Schemas.NullishBoolean,
    user: Schemas.nullish(Schemas.JsonObject),
    group: Schemas.nullish(v.lazy((): v.GenericSchema<unknown, Group> => Group)),
};

/**
 * @since 1.0.0
 * @category Models
 */
export const GroupUser = Schemas.model(v.strictObject(GroupUserEntries));

/**
 * The groups visible to the token, split by relationship to the user.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupsResponse = Schemas.model(
    v.strictObject({
        user_groups: Schemas.list(Group),
        user_accessible_groups: Schemas.list(Group),
        all_groups: Schemas.nullish(v.array(Group)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupsResponse = v.InferOutput<typeof GroupsResponse>;

/**
 * Payload for creating a group.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GroupPost {
    /** Must not collide with an existing group. */
    readonly name: string;
    readonly nickname?: string | undefined;
    readonly description?: string | undefined;
    readonly auto_accept_requests?: boolean | undefined;
    /**
     * User IDs to make group admins; the current user is added as an admin
     * automatically.
     */
    readonly group_admins?: ReadonlyArray<number> | undefined;
}

/**
 * Result of creating a group.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupPostResponse = v.InferOutput<typeof GroupPostResponse>;

/**
 * Result of granting a group access to a stream.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupStreamPostResponse = Schemas.model(
    v.strictObject({
        group_id: Schemas.Integer,
        stream_id: Schemas.Integer,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupStreamPostResponse = v.InferOutput<typeof GroupStreamPostResponse>;

/**
 * Result of adding a user to a group.
 *
 * @since 1.0.0
 * @category Models
 */
export const GroupUserPostResponse = Schemas.model(
    v.strictObject({
        group_id: Schemas.Integer,
        user_id: Schemas.Integer,
        admin: v.boolean(),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GroupUserPostResponse = v.InferOutput<typeof GroupUserPostResponse>;
