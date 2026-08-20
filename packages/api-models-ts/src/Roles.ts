/**
 * Request and response models for `/api/roles`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * A named collection of ACLs (upstream baselayer `Role`).
 *
 * The handler replaces the `acls` relationship with a list of ACL IDs.
 *
 * @since 1.0.0
 * @category Models
 */
export const Role = Schemas.model(
    v.strictObject({
        id: v.string(),
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        acls: Schemas.list(v.string()),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Role = v.InferOutput<typeof Role>;
