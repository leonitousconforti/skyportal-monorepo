/**
 * Request and response models for classifications.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Taxonomies from "./Taxonomies.ts";

/**
 * A vote on a classification (upstream `ClassificationVote`).
 *
 * @since 1.0.0
 * @category Models
 */
export const ClassificationVote = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        classification_id: Schemas.NullishInteger,
        voter_id: Schemas.NullishInteger,
        vote: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ClassificationVote = v.InferOutput<typeof ClassificationVote>;

/**
 * An edit of a classification's probability (upstream `ClassificationEdit`).
 *
 * @since 1.0.0
 * @category Models
 */
export const ClassificationEdit = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        classification_id: Schemas.NullishInteger,
        editor_id: Schemas.NullishInteger,
        editor_name: Schemas.NullishString,
        old_probability: Schemas.NullishNumber,
        new_probability: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ClassificationEdit = v.InferOutput<typeof ClassificationEdit>;

/**
 * A classification of a source (upstream `Classification`).
 *
 * `obj` stays free-form because typing it as
 * {@link skyportal-js/Sources!Source} would import in a circle: `Sources`
 * already imports this module.
 *
 * @since 1.0.0
 * @category Models
 */
export const Classification = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: v.string(),
        classification: v.string(),
        taxonomy_id: Schemas.Integer,
        probability: Schemas.NullishNumber,
        author_name: Schemas.NullishString,
        author_id: Schemas.NullishInteger,
        origin: Schemas.NullishString,
        ml: Schemas.NullishBoolean,
        taxonomy: Schemas.nullish(Taxonomies.Taxonomy),
        votes: Schemas.nullish(v.array(ClassificationVote)),
        edits: Schemas.nullish(v.array(ClassificationEdit)),
        groups: Schemas.nullish(v.array(Groups.Group)),
        author: Schemas.nullish(Schemas.JsonObject),
        obj: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Classification = v.InferOutput<typeof Classification>;

/**
 * Payload for posting a classification.
 *
 * `classification` must be a class in the taxonomy identified by
 * `taxonomy_id`. If `group_ids` is omitted, the server applies its default
 * visibility.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ClassificationPost {
    readonly obj_id: string;
    readonly classification: string;
    readonly taxonomy_id: number;
    readonly origin?: string | undefined;
    readonly probability?: number | undefined;
    readonly ml?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
    readonly vote?: boolean | undefined;
    readonly label?: boolean | undefined;
}

/**
 * Result of posting a classification.
 *
 * @since 1.0.0
 * @category Models
 */
export const ClassificationPostResponse = Schemas.model(
    v.strictObject({
        classification_id: Schemas.Integer,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ClassificationPostResponse = v.InferOutput<typeof ClassificationPostResponse>;

/**
 * Result of posting a batch of classifications.
 *
 * @since 1.0.0
 * @category Models
 */
export const ClassificationsPostResponse = Schemas.model(
    v.strictObject({
        classification_ids: Schemas.list(Schemas.Integer),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ClassificationsPostResponse = v.InferOutput<typeof ClassificationsPostResponse>;

/**
 * One page of results from a classifications query.
 *
 * @since 1.0.0
 * @category Models
 */
export const ClassificationsPage = Schemas.model(
    v.strictObject({
        classifications: Schemas.list(Classification),
        totalMatches: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ClassificationsPage = v.InferOutput<typeof ClassificationsPage>;

/**
 * Payload for updating a classification.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ClassificationUpdate {
    readonly classification?: string | undefined;
    readonly taxonomy_id?: number | undefined;
    readonly probability?: number | undefined;
    readonly origin?: string | undefined;
    readonly ml?: boolean | undefined;
    /** If provided, replaces the set of groups that can view the classification. */
    readonly group_ids?: ReadonlyArray<number> | undefined;
}
