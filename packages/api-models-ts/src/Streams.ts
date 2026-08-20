/**
 * Request and response models for `/api/streams`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * An alert stream, e.g. a survey's public alerts (upstream `Stream`).
 *
 * No handler eager-loads `Stream.groups`/`users`/`filters`/`photometry`, so
 * those relationships never appear in a serialized stream and are not
 * declared.
 *
 * @since 1.0.0
 * @category Models
 */
export const Stream = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: v.string(),
        altdata: Schemas.nullish(Schemas.JsonObject),
        auto_join: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Stream = v.InferOutput<typeof Stream>;

/**
 * Result of creating a stream.
 *
 * @since 1.0.0
 * @category Models
 */
export const StreamPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type StreamPostResponse = v.InferOutput<typeof StreamPostResponse>;

/**
 * Result of granting a user access to a stream.
 *
 * @since 1.0.0
 * @category Models
 */
export const StreamUserPostResponse = Schemas.model(
    v.strictObject({
        stream_id: Schemas.Integer,
        user_id: Schemas.Integer,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type StreamUserPostResponse = v.InferOutput<typeof StreamUserPostResponse>;
