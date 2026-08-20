/**
 * Request and response models for `/api/photometric_series`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Streams from "./Streams.ts";

/**
 * Where in an exposure a series timestamp falls.
 *
 * @since 1.0.0
 * @category Models
 */
export const TimeStampAlignment = v.picklist(["start", "middle", "end"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type TimeStampAlignment = v.InferOutput<typeof TimeStampAlignment>;

/**
 * The light curve of a series, either as a mapping of column name to values or
 * as a base64-encoded HDF5 bytestream written with `pandas.HDFStore`.
 *
 * @since 1.0.0
 * @category Models
 */
export type SeriesData = Record<string, ReadonlyArray<unknown>> | string;

/**
 * A photometric series: one light curve of one object in one series.
 *
 * `PhotometricSeries.to_dict` returns the mapper columns plus `data` (the
 * light curve in the requested `dataFormat`), `group_ids`, `stream_ids`,
 * `groups` and `streams`; the group/stream entries are trimmed to a few
 * columns. `magref` and `e_magref` are upstream hybrid properties derived from
 * `ref_flux`/`ref_fluxerr`: they are accepted on upload but are not part of
 * the serialized output. `obj`, `instrument`, `owner`, `followup_request` and
 * `assignment` are lazy-loaded relationships that these endpoints never touch,
 * so they are never returned.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometricSeries = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        series_name: Schemas.NullishString,
        series_obj_id: Schemas.NullishString,
        filter: Schemas.NullishString,
        channel: Schemas.NullishString,
        origin: Schemas.NullishString,
        filename: Schemas.NullishString,
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        ra_unc: Schemas.NullishNumber,
        dec_unc: Schemas.NullishNumber,
        mjd_first: Schemas.NullishNumber,
        mjd_mid: Schemas.NullishNumber,
        mjd_last: Schemas.NullishNumber,
        mjd_last_detected: Schemas.NullishNumber,
        mag_first: Schemas.NullishNumber,
        mag_last: Schemas.NullishNumber,
        mag_last_detected: Schemas.NullishNumber,
        is_detected: Schemas.NullishBoolean,
        exp_time: Schemas.NullishNumber,
        frame_rate: Schemas.NullishNumber,
        num_exp: Schemas.NullishInteger,
        time_stamp_alignment: Schemas.nullish(TimeStampAlignment),
        limiting_mag: Schemas.NullishNumber,
        ref_flux: Schemas.NullishNumber,
        ref_fluxerr: Schemas.NullishNumber,
        magref: Schemas.NullishNumber,
        e_magref: Schemas.NullishNumber,
        mean_mag: Schemas.NullishNumber,
        rms_mag: Schemas.NullishNumber,
        robust_mag: Schemas.NullishNumber,
        robust_rms: Schemas.NullishNumber,
        median_snr: Schemas.NullishNumber,
        best_snr: Schemas.NullishNumber,
        worst_snr: Schemas.NullishNumber,
        medians: Schemas.nullish(Schemas.JsonObject),
        maxima: Schemas.nullish(Schemas.JsonObject),
        minima: Schemas.nullish(Schemas.JsonObject),
        stds: Schemas.nullish(Schemas.JsonObject),
        altdata: Schemas.nullish(Schemas.JsonObject),
        hash: Schemas.NullishString,
        autodelete: Schemas.NullishBoolean,
        instrument_id: Schemas.NullishInteger,
        followup_request_id: Schemas.NullishInteger,
        assignment_id: Schemas.NullishInteger,
        owner_id: Schemas.NullishInteger,
        group_ids: Schemas.list(Schemas.Integer),
        stream_ids: Schemas.list(Schemas.Integer),
        groups: Schemas.list(Groups.Group),
        streams: Schemas.list(Streams.Stream),
        data: Schemas.nullish(v.union([v.record(v.string(), v.array(Schemas.Json)), v.string()])),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometricSeries = v.InferOutput<typeof PhotometricSeries>;

/**
 * One page of results from a photometric series query.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometricSeriesPage = Schemas.model(
    v.strictObject({
        series: Schemas.list(PhotometricSeries),
        totalMatches: v.optional(Schemas.Integer, 0),
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometricSeriesPage = v.InferOutput<typeof PhotometricSeriesPage>;

/**
 * Payload for uploading or updating a photometric series.
 *
 * `data` is either a mapping of column name to list of values, or a
 * base64-encoded HDF5 bytestream written with `pandas.HDFStore`. It must
 * contain an `mjd` column and either a `flux` or a `mag` column. `ra`, `dec`,
 * `exp_time` and `filter` are inferred from the data columns when not given
 * explicitly. `data` is required when creating a series and optional when
 * updating one.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PhotometricSeriesPost {
    readonly data?: SeriesData | undefined;
    readonly series_name?: string | undefined;
    readonly series_obj_id?: string | undefined;
    readonly obj_id?: string | undefined;
    readonly instrument_id?: number | undefined;
    readonly group_ids?: ReadonlyArray<number> | "all" | undefined;
    readonly stream_ids?: ReadonlyArray<number> | undefined;
    readonly ra?: number | undefined;
    readonly dec?: number | undefined;
    readonly ra_unc?: number | undefined;
    readonly dec_unc?: number | undefined;
    readonly exp_time?: number | undefined;
    readonly filter?: string | undefined;
    readonly channel?: string | undefined;
    readonly origin?: string | undefined;
    readonly limiting_mag?: number | undefined;
    readonly magref?: number | undefined;
    readonly e_magref?: number | undefined;
    readonly ref_flux?: number | undefined;
    readonly ref_fluxerr?: number | undefined;
    readonly followup_request_id?: number | undefined;
    readonly assignment_id?: number | undefined;
    readonly time_stamp_alignment?: TimeStampAlignment | undefined;
    readonly altdata?: Record<string, unknown> | undefined;
}

/**
 * Result of uploading or updating a photometric series.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotometricSeriesPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotometricSeriesPostResponse = v.InferOutput<typeof PhotometricSeriesPostResponse>;
