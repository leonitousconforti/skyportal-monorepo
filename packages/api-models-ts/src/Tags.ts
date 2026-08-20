/**
 * Request and response models for `/api/objtagoption` and `/api/objtag`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";

/**
 * A tag that can be applied to objects (upstream `ObjTagOption`).
 *
 * @since 1.0.0
 * @category Models
 */
export const ObjTagOption = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        color: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObjTagOption = v.InferOutput<typeof ObjTagOption>;

/**
 * An object-tag association (upstream `ObjTag`).
 *
 * Handlers that assemble a tag by hand add `name` (the tag option's name) and,
 * on the internal endpoints, `total_group_count` (how many groups hold the
 * tag, before the user's groups are filtered out). `obj` and `author` stay
 * free-form to avoid importing in a circle from the modules that import this
 * one.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObjTag = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        objtagoption_id: Schemas.NullishInteger,
        author_id: Schemas.NullishInteger,
        objtagoption: Schemas.nullish(ObjTagOption),
        groups: Schemas.nullish(v.array(Groups.Group)),
        obj: Schemas.nullish(Schemas.JsonObject),
        author: Schemas.nullish(Schemas.JsonObject),
        name: Schemas.NullishString,
        total_group_count: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObjTag = v.InferOutput<typeof ObjTag>;

/**
 * Result of creating an object-tag association.
 *
 * A brand-new association comes back in full; adding groups to one that
 * already exists returns only `id` and `message`, and adding nothing returns
 * an empty result.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObjTagPostResponse = Schemas.model(
    v.strictObject({
        id: Schemas.NullishInteger,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        objtagoption_id: Schemas.NullishInteger,
        author_id: Schemas.NullishInteger,
        message: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObjTagPostResponse = v.InferOutput<typeof ObjTagPostResponse>;
