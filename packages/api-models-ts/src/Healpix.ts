/**
 * Request and response models for `/api/healpix`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * Counts of objects with and without a HEALPix index.
 *
 * @since 1.0.0
 * @category Models
 */
export const HealpixCounts = Schemas.model(
    v.strictObject({
        totalWithoutHealpix: v.optional(Schemas.Integer, 0),
        totalWithHealpix: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type HealpixCounts = v.InferOutput<typeof HealpixCounts>;

/**
 * Result of a HEALPix backfill batch.
 *
 * @since 1.0.0
 * @category Models
 */
export const HealpixUpdate = Schemas.model(
    v.strictObject({
        totalMatches: v.optional(Schemas.Integer, 0),
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type HealpixUpdate = v.InferOutput<typeof HealpixUpdate>;
