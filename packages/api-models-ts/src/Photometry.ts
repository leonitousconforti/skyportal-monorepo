/**
 * Request and response models for photometry.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Annotations from "./Annotations.ts";
import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Streams from "./Streams.ts";
import * as Users from "./Users.ts";

/**
 * A measurement field of {@link PhotometryPost}, which accepts either a scalar
 * or a column of values to upload many points at once.
 *
 * @since 1.0.0
 * @category Models
 */
export type OneOrMany<TValue> = TValue | ReadonlyArray<TValue>;

/**
 * A validated/rejected mark on a photometry point.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryValidation = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        photometry_id: Schemas.NullishInteger,
        validated: Schemas.NullishBoolean,
        validator_id: Schemas.NullishInteger,
        explanation: Schemas.NullishString,
        notes: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryValidation = v.InferOutput<typeof PhotometryValidation>;

/**
 * The fields of a photometry point as built by the API's `serialize` helper.
 *
 * `serialize` never returns `Photometry.to_dict()`: it hand-builds a dict
 * whose keys depend on the `format` query parameter. `mag`, `magerr` and
 * `limiting_mag` are only present for `format="mag"`, `flux`, `fluxerr` and
 * `zp` only for `format="flux"`, and both sets for `format="both"`. The
 * `ref_*`/`tot_*`/`mag(ref|tot)` block is only present when the point has a
 * reference flux, and the `extinction`/`mag_corr`/`flux_corr` keys only when
 * the caller asked for extinction. `groups`, `annotations`, `owner`, `streams`
 * and `validations` are each opt-in per endpoint, and the
 * `owner`/`groups`/`streams` entries are trimmed to a few columns.
 *
 * @since 1.0.0
 * @category Models
 */
export const SerializedPhotometryEntries = {
    id: Schemas.Integer,
    obj_id: Schemas.NullishString,
    ra: Schemas.NullishNumber,
    dec: Schemas.NullishNumber,
    ra_unc: Schemas.NullishNumber,
    dec_unc: Schemas.NullishNumber,
    filter: Schemas.NullishString,
    mjd: Schemas.NullishNumber,
    snr: Schemas.NullishNumber,
    instrument_id: Schemas.NullishInteger,
    instrument_name: Schemas.NullishString,
    origin: Schemas.NullishString,
    altdata: Schemas.nullish(Schemas.JsonObject),
    created_at: Schemas.NullishTimestamp,
    groups: Schemas.list(Groups.Group),
    annotations: Schemas.list(Annotations.AnnotationDetail),
    owner: Schemas.nullish(Users.User),
    streams: Schemas.list(Streams.Stream),
    validations: Schemas.list(PhotometryValidation),
    magsys: Schemas.NullishString,
    mag: Schemas.NullishNumber,
    magerr: Schemas.NullishNumber,
    limiting_mag: Schemas.NullishNumber,
    flux: Schemas.NullishNumber,
    fluxerr: Schemas.NullishNumber,
    zp: Schemas.NullishNumber,
    ref_flux: Schemas.NullishNumber,
    ref_fluxerr: Schemas.NullishNumber,
    tot_flux: Schemas.NullishNumber,
    tot_fluxerr: Schemas.NullishNumber,
    magref: Schemas.NullishNumber,
    magtot: Schemas.NullishNumber,
    e_magref: Schemas.NullishNumber,
    e_magtot: Schemas.NullishNumber,
    extinction: Schemas.NullishNumber,
    mag_corr: Schemas.NullishNumber,
    flux_corr: Schemas.NullishNumber,
};

/**
 * A single photometry point of a source (upstream `Photometry`).
 *
 * `GET /api/sources/{objId}/photometry` returns individual photometry points
 * *and* the rows of the object's photometric series in one list, so this model
 * also carries the extra keys a series row has: `instrument` and `telescope`
 * (names, not objects) and, when the caller asked to phase-fold, `phase`. A
 * series row can also carry arbitrary auxiliary columns from the uploaded data
 * file, which cannot be modelled. `format="plot"` returns a strict subset of
 * these keys.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryPoint = Schemas.model(
    v.strictObject({
        ...SerializedPhotometryEntries,
        instrument: Schemas.NullishString,
        telescope: Schemas.NullishString,
        phase: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryPoint = v.InferOutput<typeof PhotometryPoint>;

/**
 * A photometry point as serialized by the date-range query.
 *
 * `GET /api/photometry/range` calls `serialize` with its defaults, so this is
 * the plain serialized point: the same keys as {@link PhotometryPoint} minus
 * the photometric-series extras.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryRangePoint = Schemas.model(
    v.strictObject(SerializedPhotometryEntries)
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryRangePoint = v.InferOutput<typeof PhotometryRangePoint>;

/**
 * Payload for posting one or many photometry points.
 *
 * Provide either `mag`/`magerr` (magnitude space) or `flux`/`fluxerr`/`zp`
 * (flux space). For non-detections, leave the measurement fields unset and
 * provide `limiting_mag`. Every measurement field also accepts a 1D list to
 * upload many points at once; scalars are broadcast across the lists, and a
 * `null` entry inside a `mag`/`flux` list marks that point as a non-detection.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PhotometryPost {
    readonly obj_id: OneOrMany<string>;
    readonly mjd: OneOrMany<number>;
    readonly instrument_id: OneOrMany<number>;
    readonly filter: OneOrMany<string>;
    /** Defaults to `"ab"`. */
    readonly magsys?: OneOrMany<string> | undefined;
    readonly mag?: OneOrMany<number | null> | undefined;
    readonly magerr?: OneOrMany<number | null> | undefined;
    readonly limiting_mag?: OneOrMany<number | null> | undefined;
    readonly limiting_mag_nsigma?: OneOrMany<number | null> | undefined;
    readonly magref?: OneOrMany<number | null> | undefined;
    readonly e_magref?: OneOrMany<number | null> | undefined;
    readonly flux?: OneOrMany<number | null> | undefined;
    readonly fluxerr?: OneOrMany<number | null> | undefined;
    readonly zp?: OneOrMany<number | null> | undefined;
    readonly ref_flux?: OneOrMany<number | null> | undefined;
    readonly ref_fluxerr?: OneOrMany<number | null> | undefined;
    readonly ref_zp?: OneOrMany<number | null> | undefined;
    readonly ra?: OneOrMany<number | null> | undefined;
    readonly dec?: OneOrMany<number | null> | undefined;
    readonly ra_unc?: OneOrMany<number | null> | undefined;
    readonly dec_unc?: OneOrMany<number | null> | undefined;
    readonly origin?: OneOrMany<string | null> | undefined;
    readonly assignment_id?: number | undefined;
    readonly altdata?: OneOrMany<Record<string, unknown> | null> | undefined;
    readonly extinction_corrected?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | "all" | undefined;
    readonly stream_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of posting photometry.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryPostResponse = Schemas.model(
    v.strictObject({
        ids: Schemas.list(Schemas.Integer),
        upload_id: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryPostResponse = v.InferOutput<typeof PhotometryPostResponse>;

/**
 * Payload for updating an existing photometry point.
 *
 * Every field is optional: the server loads the point, applies the given
 * fields, and re-validates the result as either a flux-space
 * (`flux`/`fluxerr`/`zp`) or magnitude-space (`mag`/`magerr`) measurement.
 * Only the fields explicitly set on the payload are sent, so passing `null`
 * explicitly (e.g. `{ mag: null, magerr: null }` to turn a detection into a
 * non-detection) sends a null, while omitting a field leaves it unchanged.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PhotometryUpdate {
    readonly obj_id?: string | null | undefined;
    readonly mjd?: number | null | undefined;
    readonly instrument_id?: number | null | undefined;
    readonly filter?: string | null | undefined;
    readonly magsys?: string | null | undefined;
    readonly mag?: number | null | undefined;
    readonly magerr?: number | null | undefined;
    readonly limiting_mag?: number | null | undefined;
    readonly magref?: number | null | undefined;
    readonly e_magref?: number | null | undefined;
    readonly flux?: number | null | undefined;
    readonly fluxerr?: number | null | undefined;
    readonly zp?: number | null | undefined;
    readonly ref_flux?: number | null | undefined;
    readonly ref_fluxerr?: number | null | undefined;
    readonly ref_zp?: number | null | undefined;
    readonly ra?: number | null | undefined;
    readonly dec?: number | null | undefined;
    readonly ra_unc?: number | null | undefined;
    readonly dec_unc?: number | null | undefined;
    readonly origin?: string | null | undefined;
    readonly alert_id?: number | null | undefined;
    readonly assignment_id?: number | null | undefined;
    readonly altdata?: Record<string, unknown> | null | undefined;
    /** Replaces the point's groups. */
    readonly group_ids?: ReadonlyArray<number> | undefined;
    /** Only adds streams; it never removes them. */
    readonly stream_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of creating, updating or deleting a photometry validation.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometryValidationResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometryValidationResponse = v.InferOutput<
    typeof PhotometryValidationResponse
>;
