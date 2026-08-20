/**
 * Request and response models for source annotations.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";

/**
 * What an annotation is attached to.
 *
 * @since 1.0.0
 * @category Models
 */
export type AnnotationResourceType = "sources" | "spectra" | "photometry";

/**
 * The fields of an {@link Annotation}.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnnotationEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    data: v.optional(Schemas.JsonObject, () => ({})),
    origin: Schemas.NullishString,
    author_id: Schemas.NullishInteger,
    author: Schemas.nullish(Schemas.JsonObject),
    groups: Schemas.list(Groups.Group),
    obj_id: Schemas.NullishString,
    spectrum_id: Schemas.NullishInteger,
    photometry_id: Schemas.NullishInteger,
    obj: Schemas.nullish(Schemas.JsonObject),
    spectrum: Schemas.nullish(Schemas.JsonObject),
    photometry: Schemas.nullish(Schemas.JsonObject),
    type: Schemas.NullishString,
};

/**
 * An annotation on any annotatable resource (upstream `Annotation`).
 *
 * Upstream splits annotations across `Annotation`, `AnnotationOnSpectrum` and
 * `AnnotationOnPhotometry`; this model is the union of that family, so each
 * type-specific foreign key is optional and only the ones belonging to the
 * annotation's own table are ever set. `data` is a free-form JSONB column.
 * `author` is the author's `User.to_dict()`, and `obj`, `spectrum` and
 * `photometry` stay free-form to avoid importing in a circle from the modules
 * that import this one.
 *
 * @since 1.0.0
 * @category Models
 */
export const Annotation = Schemas.model(v.strictObject(AnnotationEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type Annotation = v.InferOutput<typeof Annotation>;

/**
 * A single annotation, as returned by the single-annotation endpoint.
 *
 * The list and single-GET routes both return `Annotation.to_dict()` with the
 * groups eager-loaded, so this is {@link Annotation} under the name the
 * single-annotation endpoint is documented with.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnnotationDetail = Schemas.model(v.strictObject(AnnotationEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type AnnotationDetail = v.InferOutput<typeof AnnotationDetail>;

/**
 * Result of posting an annotation.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnnotationPostResponse = Schemas.model(v.strictObject({ annotation_id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type AnnotationPostResponse = v.InferOutput<typeof AnnotationPostResponse>;
