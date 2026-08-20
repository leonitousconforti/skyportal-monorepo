/**
 * Request and response models for `/api/invitations`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Roles from "./Roles.ts";
import * as Schemas from "./Schemas.ts";
import * as Streams from "./Streams.ts";
import * as Users from "./Users.ts";

/**
 * An invitation for a new user to join the instance (upstream `Invitation`).
 *
 * The handler eager-loads `groups`, `streams` and `invited_by`; `role` is only
 * present when that relationship happens to be loaded.
 *
 * @since 1.0.0
 * @category Models
 */
export const Invitation = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        token: Schemas.NullishString,
        user_email: Schemas.NullishString,
        role_id: Schemas.NullishString,
        role: Schemas.nullish(Roles.Role),
        admin_for_groups: Schemas.nullish(v.array(v.boolean())),
        can_save_to_groups: Schemas.nullish(v.array(v.boolean())),
        can_share_photometry_for_groups: Schemas.nullish(v.array(v.boolean())),
        used: Schemas.NullishBoolean,
        user_expiration_date: Schemas.NullishTimestamp,
        groups: Schemas.nullish(v.array(Groups.Group)),
        streams: Schemas.nullish(v.array(Streams.Stream)),
        invited_by: Schemas.nullish(Users.User),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Invitation = v.InferOutput<typeof Invitation>;

/**
 * One page of results from an invitations query.
 *
 * @since 1.0.0
 * @category Models
 */
export const InvitationsPage = Schemas.model(
    v.strictObject({
        invitations: Schemas.list(Invitation),
        totalMatches: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type InvitationsPage = v.InferOutput<typeof InvitationsPage>;

/**
 * Payload for inviting a new user.
 *
 * `role` must be either `"Full user"` or `"View only"` and defaults to `"Full
 * user"`. If `streamIDs` is omitted the user is granted access to every stream
 * associated with the invited groups; if given, it must cover those streams.
 * `groupAdmin`, `canSave` and `canSharePhotometry` are per-group flags and
 * must be the same length as `groupIDs`; they default to all false, all true,
 * and all false respectively.
 *
 * @since 1.0.0
 * @category Models
 */
export interface InvitationPost {
    readonly userEmail: string;
    readonly groupIDs: ReadonlyArray<number>;
    readonly role?: string | undefined;
    readonly streamIDs?: ReadonlyArray<number> | undefined;
    readonly groupAdmin?: ReadonlyArray<boolean> | undefined;
    readonly canSave?: ReadonlyArray<boolean> | undefined;
    readonly canSharePhotometry?: ReadonlyArray<boolean> | undefined;
    readonly userExpirationDate?: string | undefined;
}

/**
 * Result of creating an invitation.
 *
 * @since 1.0.0
 * @category Models
 */
export const InvitationPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type InvitationPostResponse = v.InferOutput<typeof InvitationPostResponse>;
