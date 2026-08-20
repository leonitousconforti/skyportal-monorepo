/**
 * Request and response models for `/api/taxonomy`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";

/**
 * A classification taxonomy (upstream `Taxonomy`).
 *
 * `classifications` stays untyped:
 * {@link skyportal-js/Classifications!Classification} already points at
 * `Taxonomy`, so typing it would create an import cycle.
 *
 * @since 1.0.0
 * @category Models
 */
export const Taxonomy = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        version: Schemas.NullishString,
        provenance: Schemas.NullishString,
        isLatest: Schemas.NullishBoolean,
        hierarchy: Schemas.nullish(Schemas.JsonObject),
        groups: Schemas.nullish(v.array(Groups.Group)),
        classifications: Schemas.nullish(v.array(Schemas.JsonObject)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Taxonomy = v.InferOutput<typeof Taxonomy>;

/**
 * Payload for creating a taxonomy.
 *
 * Exactly one of `hierarchy` (nested JSON) or `hierarchy_file` (the same
 * structure as a YAML string) must be given, and the hierarchy is validated
 * against the `tdtax` schema. The name/version combination must not already
 * exist. `group_ids` defaults to the public group, and any group the token
 * cannot access is dropped. When `isLatest` is true every other taxonomy with
 * the same name is marked not-latest.
 *
 * @since 1.0.0
 * @category Models
 */
export interface TaxonomyPost {
    readonly name: string;
    readonly version: string;
    readonly hierarchy?: Record<string, unknown> | undefined;
    readonly hierarchy_file?: string | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
    readonly provenance?: string | undefined;
    /** Defaults to true. */
    readonly isLatest?: boolean | undefined;
}

/**
 * Payload for updating a taxonomy.
 *
 * @since 1.0.0
 * @category Models
 */
export interface TaxonomyPut {
    readonly name?: string | undefined;
    readonly version?: string | undefined;
    readonly provenance?: string | undefined;
    readonly isLatest?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of creating a taxonomy.
 *
 * @since 1.0.0
 * @category Models
 */
export const TaxonomyPostResponse = Schemas.model(
    v.strictObject({ taxonomy_id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type TaxonomyPostResponse = v.InferOutput<typeof TaxonomyPostResponse>;
