/**
 * Request and response models for `/api/spatial_catalog`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * An entry in a spatial catalog (upstream `SpatialCatalogEntry`).
 *
 * `uniq` and `probdensity` are deferred columns upstream, so they are absent
 * unless a query explicitly undefers them. The `catalog` back-reference is
 * never populated by a load, so it is not declared.
 *
 * @since 1.0.0
 * @category Models
 */
export const SpatialCatalogEntry = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        catalog_id: Schemas.NullishInteger,
        entry_name: Schemas.NullishString,
        /**
         * The cone (`ra`, `dec`, `radius`) or ellipse (`ra`, `dec`, `amaj`,
         * `amin`, `phi`) the entry's skymap was generated from.
         */
        data: Schemas.nullish(Schemas.JsonObject),
        uniq: Schemas.nullish(v.array(Schemas.Integer)),
        probdensity: Schemas.nullish(v.array(v.number())),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SpatialCatalogEntry = v.InferOutput<typeof SpatialCatalogEntry>;

/**
 * A spatial catalog of skymap regions (upstream `SpatialCatalog`).
 *
 * `entries` is only populated by the single-catalog endpoint, and
 * `entries_count` is injected only by the list endpoint.
 *
 * @since 1.0.0
 * @category Models
 */
export const SpatialCatalog = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        catalog_name: Schemas.NullishString,
        entries: Schemas.nullish(v.array(SpatialCatalogEntry)),
        entries_count: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SpatialCatalog = v.InferOutput<typeof SpatialCatalog>;

/**
 * Result of ingesting a spatial catalog.
 *
 * @since 1.0.0
 * @category Models
 */
export const SpatialCatalogPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type SpatialCatalogPostResponse = v.InferOutput<typeof SpatialCatalogPostResponse>;
