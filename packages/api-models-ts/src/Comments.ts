/**
 * Request and response models for source comments.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";

/**
 * What a comment is attached to.
 *
 * @since 1.0.0
 * @category Models
 */
export type CommentResourceType =
    | "sources"
    | "spectra"
    | "gcn_event"
    | "shift"
    | "earthquake";

/**
 * The fields of a {@link Comment}.
 *
 * @since 1.0.0
 * @category Models
 */
export const CommentEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    text: Schemas.NullishString,
    attachment_name: Schemas.NullishString,
    attachment_bytes: Schemas.nullish(Schemas.Json),
    origin: Schemas.NullishString,
    bot: Schemas.NullishBoolean,
    author_id: Schemas.NullishInteger,
    author: Schemas.nullish(Schemas.JsonObject),
    groups: Schemas.nullish(v.array(Groups.Group)),
    obj_id: Schemas.NullishString,
    spectrum_id: Schemas.NullishInteger,
    gcn_id: Schemas.NullishInteger,
    earthquake_id: Schemas.NullishInteger,
    shift_id: Schemas.NullishInteger,
    obj: Schemas.nullish(Schemas.JsonObject),
    spectrum: Schemas.nullish(Schemas.JsonObject),
    gcn: Schemas.nullish(Schemas.JsonObject),
    shift: Schemas.nullish(Schemas.JsonObject),
    earthquake: Schemas.nullish(Schemas.JsonObject),
    dateobs: Schemas.NullishTimestamp,
    resourceType: Schemas.NullishString,
};

/**
 * A comment on any commentable resource (upstream `Comment`).
 *
 * Upstream splits comments across `Comment`, `CommentOnSpectrum`,
 * `CommentOnGCN`, `CommentOnShift` and `CommentOnEarthquake`; this model is
 * the union of that family, so each type-specific foreign key is optional and
 * only the ones belonging to the comment's own table are ever set. `author` is
 * the author's `User.to_dict()` (plus a `gravatar_url` key on the source
 * endpoints), and `obj`, `gcn`, `spectrum`, `shift` and `earthquake` stay
 * free-form to avoid importing in a circle from the modules that import this
 * one.
 *
 * @since 1.0.0
 * @category Models
 */
export const Comment = Schemas.model(v.strictObject(CommentEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type Comment = v.InferOutput<typeof Comment>;

/**
 * A single comment, as returned by the single-comment endpoint.
 *
 * The list and single-GET routes both return `Comment.to_dict()` plus
 * `resourceType`, so this is {@link Comment} under the name the single-comment
 * endpoint is documented with.
 *
 * @since 1.0.0
 * @category Models
 */
export const CommentDetail = Schemas.model(v.strictObject(CommentEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type CommentDetail = v.InferOutput<typeof CommentDetail>;

/**
 * Result of posting a comment.
 *
 * @since 1.0.0
 * @category Models
 */
export const CommentPostResponse = Schemas.model(
    v.strictObject({
        comment_id: Schemas.Integer,
        message: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CommentPostResponse = v.InferOutput<typeof CommentPostResponse>;

/**
 * The decoded contents of a comment attachment.
 *
 * @since 1.0.0
 * @category Models
 */
export const CommentAttachment = Schemas.model(
    v.strictObject({
        commentId: Schemas.Integer,
        attachment: Schemas.NullishString,
        attachmentName: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CommentAttachment = v.InferOutput<typeof CommentAttachment>;

/**
 * How many comments still hold their attachment in the database.
 *
 * @since 1.0.0
 * @category Models
 */
export const CommentAttachmentCounts = Schemas.model(
    v.strictObject({
        totalWithoutAttachmentBytes: v.optional(Schemas.Integer, 0),
        totalWithAttachmentBytes: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CommentAttachmentCounts = v.InferOutput<typeof CommentAttachmentCounts>;

/**
 * Result of moving one page of comment attachments to disk.
 *
 * @since 1.0.0
 * @category Models
 */
export const CommentAttachmentBatch = Schemas.model(
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
export type CommentAttachmentBatch = v.InferOutput<typeof CommentAttachmentBatch>;
