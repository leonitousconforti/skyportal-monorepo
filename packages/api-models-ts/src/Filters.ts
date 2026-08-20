/**
 * Request and response models for `/api/filters`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * An alert-stream filter belonging to a group (upstream `Filter`).
 *
 * `stream`, `group`, `broker` and `candidates` stay untyped: each of those
 * upstream models owns a `filters` (or `filter`) relationship, so typing them
 * here would risk an import cycle.
 *
 * @since 1.0.0
 * @category Models
 */
export const Filter = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        stream_id: Schemas.NullishInteger,
        group_id: Schemas.NullishInteger,
        broker_id: Schemas.NullishInteger,
        altdata: Schemas.nullish(Schemas.JsonObject),
        autosave: Schemas.NullishBoolean,
        stream: Schemas.nullish(Schemas.JsonObject),
        group: Schemas.nullish(Schemas.JsonObject),
        broker: Schemas.nullish(Schemas.JsonObject),
        candidates: Schemas.nullish(v.array(Schemas.JsonObject)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Filter = v.InferOutput<typeof Filter>;

/**
 * Payload for creating a filter.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FilterPost {
    readonly name: string;
    readonly stream_id: number;
    readonly group_id: number;
    /** The broker the filter runs on, if any. */
    readonly broker_id?: number | undefined;
    /** Arbitrary extra JSON. */
    readonly altdata?: Record<string, unknown> | undefined;
}

/**
 * Payload for updating a filter.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FilterPatch {
    readonly name?: string | undefined;
    readonly altdata?: Record<string, unknown> | undefined;
    readonly group_id?: number | undefined;
    readonly stream_id?: number | undefined;
    readonly autosave?: boolean | undefined;
}

/**
 * Result of creating a filter.
 *
 * @since 1.0.0
 * @category Models
 */
export const FilterPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type FilterPostResponse = v.InferOutput<typeof FilterPostResponse>;
