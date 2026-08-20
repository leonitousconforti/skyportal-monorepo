/**
 * Request and response models for `/api/user`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Streams from "./Streams.ts";

/**
 * The fields of a {@link User}.
 *
 * @since 1.0.0
 * @category Models
 */
export const UserEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    username: v.string(),
    first_name: Schemas.NullishString,
    last_name: Schemas.NullishString,
    bio: Schemas.NullishString,
    affiliations: Schemas.list(v.string()),
    contact_email: Schemas.NullishString,
    contact_phone: Schemas.NullishString,
    oauth_uid: Schemas.NullishString,
    is_bot: Schemas.NullishBoolean,
    expiration_date: Schemas.NullishTimestamp,
    permissions: Schemas.list(v.string()),
    roles: Schemas.list(v.string()),
    acls: Schemas.list(v.string()),
    gravatar_url: Schemas.NullishString,
    groups: Schemas.nullish(v.array(Groups.Group)),
    streams: Schemas.nullish(v.array(Streams.Stream)),
};

/**
 * A SkyPortal user (upstream baselayer `User`).
 *
 * SkyPortal overrides `User.to_dict` to return the table columns only, minus
 * `preferences`; `roles`/`acls`/`permissions`/`gravatar_url` and, for system
 * admins, `groups`/`streams` are injected by the handler.
 *
 * @since 1.0.0
 * @category Models
 */
export const User = Schemas.model(v.strictObject(UserEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type User = v.InferOutput<typeof User>;

/**
 * One page of results from a users query.
 *
 * @since 1.0.0
 * @category Models
 */
export const UsersPage = Schemas.model(
    v.strictObject({
        users: v.array(User),
        totalMatches: Schemas.Integer,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type UsersPage = v.InferOutput<typeof UsersPage>;

/**
 * Payload for adding a new user.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UserPost {
    readonly username: string;
    readonly first_name?: string | undefined;
    readonly last_name?: string | undefined;
    readonly affiliations?: ReadonlyArray<string> | undefined;
    readonly contact_email?: string | undefined;
    readonly contact_phone?: string | undefined;
    readonly oauth_uid?: string | undefined;
    /** If omitted, the server assigns its configured default role. */
    readonly roles?: ReadonlyArray<string> | undefined;
    /**
     * Pairs of `[groupId, admin]`. If omitted, the server adds the user to its
     * default groups.
     */
    readonly groupIDsAndAdmin?: ReadonlyArray<readonly [number, boolean]> | undefined;
}

/**
 * Result of adding a new user.
 *
 * @since 1.0.0
 * @category Models
 */
export const UserPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type UserPostResponse = v.InferOutput<typeof UserPostResponse>;
