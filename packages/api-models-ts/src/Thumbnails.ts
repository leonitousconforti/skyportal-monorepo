/**
 * Request and response models for `/api/thumbnail`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * Thumbnail types SkyPortal accepts (upstream `THUMBNAIL_TYPES`).
 *
 * @since 1.0.0
 * @category Models
 */
export const ThumbnailType = v.picklist([
    "new",
    "ref",
    "sub",
    "sdss",
    "dr8",
    "ls",
    "ps1",
    "sm",
    "hst",
    "chandra",
    "jwst",
    "new_gz",
    "ref_gz",
    "sub_gz",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type ThumbnailType = v.InferOutput<typeof ThumbnailType>;

/**
 * A thumbnail image centered on an object (upstream `Thumbnail`).
 *
 * @since 1.0.0
 * @category Models
 */
export const Thumbnail = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        type: Schemas.nullish(ThumbnailType),
        file_uri: Schemas.NullishString,
        public_url: Schemas.NullishString,
        origin: Schemas.NullishString,
        survey: Schemas.NullishString,
        is_grayscale: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Thumbnail = v.InferOutput<typeof Thumbnail>;

/**
 * Payload for uploading a thumbnail.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ThumbnailPost {
    readonly obj_id: string;
    /** Base64-encoded PNG contents. */
    readonly data: string;
    readonly ttype: ThumbnailType;
    /** The survey the cutout came from; omit for all-sky archival thumbnails. */
    readonly survey?: string | undefined;
}

/**
 * Result of uploading a thumbnail.
 *
 * @since 1.0.0
 * @category Models
 */
export const ThumbnailPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ThumbnailPostResponse = v.InferOutput<typeof ThumbnailPostResponse>;

/**
 * Counts of thumbnails found in the correct and incorrect folders.
 *
 * @since 1.0.0
 * @category Models
 */
export const ThumbnailPathReport = Schemas.model(
    v.strictObject({
        totalMatches: Schemas.NullishInteger,
        inCorrectFolder: Schemas.NullishInteger,
        inWrongFolder: Schemas.NullishInteger,
        numMoved: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ThumbnailPathReport = v.InferOutput<typeof ThumbnailPathReport>;
