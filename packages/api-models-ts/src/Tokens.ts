/**
 * Request and response models for `/api/internal/tokens`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * An API token (upstream baselayer `Token`).
 *
 * The token's ACLs are not serialized; they appear only on the profile's token
 * listing ({@link skyportal-js/Profile!UserProfile}`.tokens`).
 *
 * @since 1.0.0
 * @category Models
 */
export const ApiToken = Schemas.model(
    v.strictObject({
        id: v.string(),
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        created_by_id: Schemas.NullishInteger,
        name: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ApiToken = v.InferOutput<typeof ApiToken>;

/**
 * Result of creating a token.
 *
 * @since 1.0.0
 * @category Models
 */
export const TokenPostResponse = Schemas.model(
    v.strictObject({ token_id: v.string() })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type TokenPostResponse = v.InferOutput<typeof TokenPostResponse>;
