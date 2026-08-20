/**
 * Request and response models for `/api/galaxy_catalog`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * A galaxy from a galaxy catalog (upstream `Galaxy`).
 *
 * `objects` (the objects this galaxy is the host of) stays as raw JSON:
 * {@link skyportal-js/Sources!Source} nests `Galaxy`, so typing it would be a
 * cycle.
 *
 * @since 1.0.0
 * @category Models
 */
export const Galaxy = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        catalog_id: Schemas.NullishInteger,
        name: Schemas.NullishString,
        alt_name: Schemas.NullishString,
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        healpix: Schemas.NullishInteger,
        distmpc: Schemas.NullishNumber,
        distmpc_unc: Schemas.NullishNumber,
        redshift: Schemas.NullishNumber,
        redshift_error: Schemas.NullishNumber,
        sfr_fuv: Schemas.NullishNumber,
        sfr_w4: Schemas.NullishNumber,
        mstar: Schemas.NullishNumber,
        magb: Schemas.NullishNumber,
        magk: Schemas.NullishNumber,
        mag_fuv: Schemas.NullishNumber,
        mag_nuv: Schemas.NullishNumber,
        mag_w1: Schemas.NullishNumber,
        mag_w2: Schemas.NullishNumber,
        mag_w3: Schemas.NullishNumber,
        mag_w4: Schemas.NullishNumber,
        a: Schemas.NullishNumber,
        b2a: Schemas.NullishNumber,
        pa: Schemas.NullishNumber,
        btc: Schemas.NullishNumber,
        objects: Schemas.nullish(v.array(Schemas.JsonObject)),
        /** Injected by the handler when `returnProbability` is requested. */
        probability: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Galaxy = v.InferOutput<typeof Galaxy>;

/**
 * One page of results from a galaxy catalog query.
 *
 * Hand-built by the handler, which strips keys whose value is `null`, so
 * `sortBy`/`sortOrder` are absent unless they were requested and `geojson` is
 * only present when `includeGeoJSON` was set.
 *
 * @since 1.0.0
 * @category Models
 */
export const GalaxiesPage = Schemas.model(
    v.strictObject({
        galaxies: Schemas.list(Galaxy),
        totalMatches: v.optional(Schemas.Integer, 0),
        sortBy: Schemas.NullishString,
        sortOrder: Schemas.NullishString,
        page: Schemas.NullishInteger,
        numPerPage: Schemas.NullishInteger,
        geojson: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GalaxiesPage = v.InferOutput<typeof GalaxiesPage>;

/**
 * A galaxy catalog name with its galaxy count.
 *
 * Hand-built by the handler from an upstream `GalaxyCatalog` plus a count of
 * its galaxies; the catalog's description and URL are not returned.
 *
 * @since 1.0.0
 * @category Models
 */
export const GalaxyCatalogCount = Schemas.model(
    v.strictObject({
        catalog_name: v.string(),
        catalog_count: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GalaxyCatalogCount = v.InferOutput<typeof GalaxyCatalogCount>;

/**
 * Payload for ingesting a galaxy catalog.
 *
 * The upstream OpenAPI schema documents `catalog_data` as a list of objects,
 * but the handler indexes it by column name, so it is really a map of
 * equal-length column lists. `ra`, `dec`, and `name` are required columns,
 * with `ra` in `[0, 360)` degrees and `dec` in `[-90, 90]` degrees.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GalaxyCatalogPost {
    readonly catalog_name: string;
    readonly catalog_data: Record<string, ReadonlyArray<unknown>>;
    readonly catalog_description?: string | undefined;
    readonly catalog_url?: string | undefined;
}

/**
 * Payload for uploading a galaxy catalog from an ASCII file.
 *
 * `catalogData` is the file content as a comma-separated ASCII table with
 * `ra`, `dec`, and `name` columns required.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GalaxyCatalogAsciiPost {
    readonly catalogName: string;
    readonly catalogData: string;
    readonly catalogDescription?: string | undefined;
    readonly catalogURL?: string | undefined;
}
