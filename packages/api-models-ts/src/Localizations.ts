/**
 * Request and response models for `/api/localization`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * Properties parsed from a localization (upstream `LocalizationProperty`).
 *
 * `localization` stays free-form: typing it would make the model recursive
 * through {@link Localization}, which owns this one.
 *
 * @since 1.0.0
 * @category Models
 */
export const LocalizationProperty = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        localization_id: Schemas.NullishInteger,
        data: Schemas.nullish(Schemas.JsonObject),
        sent_by: Schemas.nullish(Users.User),
        localization: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type LocalizationProperty = v.InferOutput<typeof LocalizationProperty>;

/**
 * A qualitative tag on a localization (upstream `LocalizationTag`).
 *
 * `localization` stays free-form: typing it would make the model recursive
 * through {@link Localization}, which owns this one.
 *
 * @since 1.0.0
 * @category Models
 */
export const LocalizationTag = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        localization_id: Schemas.NullishInteger,
        text: Schemas.NullishString,
        sent_by: Schemas.nullish(Users.User),
        localization: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type LocalizationTag = v.InferOutput<typeof LocalizationTag>;

/**
 * The center of a localization (upstream `Localization.center`).
 *
 * `ebv` is the Schlegel-Finkbeiner-Davis reddening at that position and is
 * null when the dust map lookup fails.
 *
 * @since 1.0.0
 * @category Models
 */
export const LocalizationCenter = Schemas.model(
    v.strictObject({
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        gal_lat: Schemas.NullishNumber,
        gal_lon: Schemas.NullishNumber,
        ebv: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type LocalizationCenter = v.InferOutput<typeof LocalizationCenter>;

/**
 * The fields of a {@link Localization}.
 *
 * @since 1.0.0
 * @category Models
 */
export const LocalizationEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    sent_by_id: Schemas.NullishInteger,
    dateobs: Schemas.NullishTimestamp,
    localization_name: Schemas.NullishString,
    uniq: Schemas.nullish(v.array(Schemas.Integer)),
    probdensity: Schemas.nullish(v.array(v.number())),
    distmu: Schemas.nullish(v.array(v.nullable(v.number()))),
    distsigma: Schemas.nullish(v.array(v.nullable(v.number()))),
    distnorm: Schemas.nullish(v.array(v.nullable(v.number()))),
    contour: Schemas.nullish(Schemas.JsonObject),
    notice_id: Schemas.NullishInteger,
    flat_2d: Schemas.nullish(v.array(v.number())),
    sent_by: Schemas.nullish(Users.User),
    gcnevent: Schemas.nullish(Schemas.JsonObject),
    properties: Schemas.nullish(v.array(LocalizationProperty)),
    tags: Schemas.nullish(v.array(LocalizationTag)),
    observationplan_requests: Schemas.nullish(v.array(Schemas.JsonObject)),
    survey_efficiency_analyses: Schemas.nullish(v.array(Schemas.JsonObject)),
};

/**
 * A GCN event localization (upstream `Localization`).
 *
 * `uniq`, `probdensity`, `distmu`, `distsigma`, `distnorm` and `contour` are
 * deferred server-side, so each is only present when the handler undefers it;
 * the distance arrays are undeferred only by the single-localization endpoint.
 * `flat_2d` is the rasterized 2D skymap that endpoint injects when
 * `include2DMap` is set. `gcnevent`, `observationplan_requests` and
 * `survey_efficiency_analyses` stay free-form: those upstream models point
 * back at `Localization`, so typing them would create an import cycle. The
 * `_localization_path` column is never serialized.
 *
 * @since 1.0.0
 * @category Models
 */
export const Localization = Schemas.model(v.strictObject(LocalizationEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type Localization = v.InferOutput<typeof Localization>;
