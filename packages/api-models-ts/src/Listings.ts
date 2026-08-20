/**
 * Request and response models for `/api/listing`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * An object saved by a user to a named list (upstream `Listing`).
 *
 * The handler returns bare `Listing` rows, so the `user` and `obj`
 * relationships are never loaded and are not declared here.
 *
 * @since 1.0.0
 * @category Models
 */
export const Listing = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        user_id: Schemas.NullishInteger,
        obj_id: Schemas.NullishString,
        list_name: Schemas.NullishString,
        params: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Listing = v.InferOutput<typeof Listing>;

/**
 * Payload for adding an object to a user's list.
 *
 * `list_name` is user-defined and must start with an alphanumeric character or
 * underscore; `"favorites"` and `"rejected_candidates"` have special meaning
 * in the web app. `user_id` defaults to the token's own user, and only admins
 * may add listings to other users' accounts. `params` is required for the
 * `"watchlist"` list and must contain numeric `arcsec` (0 to 3600) and
 * `cadence` (1 or more) keys, plus an optional boolean `end_of_night`. A given
 * user, object, and list name combination may only be saved once.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ListingPost {
    readonly obj_id: string;
    readonly list_name: string;
    readonly user_id?: number | undefined;
    readonly params?: Record<string, unknown> | undefined;
}

/**
 * Result of adding an object to a user's list.
 *
 * @since 1.0.0
 * @category Models
 */
export const ListingPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type ListingPostResponse = v.InferOutput<typeof ListingPostResponse>;
