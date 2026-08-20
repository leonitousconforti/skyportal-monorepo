/**
 * Request and response models for `/api/mmadetector`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * The kind of multimessenger detector.
 *
 * @since 1.0.0
 * @category Models
 */
export const MmaDetectorType = v.picklist(["gravitational-wave", "neutrino", "gamma-ray-burst"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type MmaDetectorType = v.InferOutput<typeof MmaDetectorType>;

/**
 * A multimessenger astronomical detector (upstream `MMADetector`).
 *
 * `events` stays untyped: {@link skyportal-js/GcnEvents!GcnEvent} already
 * points at `MMADetector`, so typing it would create an import cycle.
 *
 * Declared by hand rather than inferred, because it refers to
 * {@link MmaDetectorSpectrum} and {@link MmaDetectorTimeInterval}, which refer
 * back to it.
 *
 * @since 1.0.0
 * @category Models
 */
export interface MmaDetector {
    readonly id: number;
    readonly created_at?: string | null | undefined;
    readonly modified?: string | null | undefined;
    readonly name?: string | null | undefined;
    readonly nickname?: string | null | undefined;
    readonly type?: MmaDetectorType | null | undefined;
    readonly lat?: number | null | undefined;
    readonly lon?: number | null | undefined;
    readonly elevation?: number | null | undefined;
    readonly fixed_location?: boolean | null | undefined;
    readonly events?: Array<Record<string, unknown>> | null | undefined;
    readonly spectra?: Array<MmaDetectorSpectrum> | null | undefined;
    readonly time_intervals?: Array<MmaDetectorTimeInterval> | null | undefined;
}

/**
 * A sensitivity spectrum of a detector (upstream `MMADetectorSpectrum`).
 *
 * `owner` and `groups` stay untyped: the upstream `User` and `Group` both own
 * an `mmadetector_spectra` relationship, so typing them here would risk an
 * import cycle.
 *
 * @since 1.0.0
 * @category Models
 */
export interface MmaDetectorSpectrum {
    readonly id: number;
    readonly created_at?: string | null | undefined;
    readonly modified?: string | null | undefined;
    readonly detector_id?: number | null | undefined;
    readonly detector?: MmaDetector | null | undefined;
    readonly frequencies: Array<number>;
    readonly amplitudes: Array<number>;
    readonly start_time?: string | null | undefined;
    readonly end_time?: string | null | undefined;
    readonly owner_id?: number | null | undefined;
    readonly owner?: Record<string, unknown> | null | undefined;
    readonly groups?: Array<Record<string, unknown>> | null | undefined;
    readonly original_file_string?: string | null | undefined;
    readonly original_file_filename?: string | null | undefined;
}

/**
 * A detector data-taking interval (upstream `MMADetectorTimeInterval`).
 *
 * The time-interval endpoints build this payload by hand, so it carries only
 * these five keys rather than the model's full column set. `owner` and
 * `groups` stay untyped: the upstream `User` and `Group` both own an
 * `mmadetector_time_intervals` relationship, so typing them here would risk an
 * import cycle.
 *
 * @since 1.0.0
 * @category Models
 */
export interface MmaDetectorTimeInterval {
    readonly id: number;
    readonly time_interval: Array<string>;
    readonly owner?: Record<string, unknown> | null | undefined;
    readonly groups?: Array<Record<string, unknown>> | null | undefined;
    readonly detector?: MmaDetector | null | undefined;
}

/**
 * @since 1.0.0
 * @category Models
 */
export const MmaDetector = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        nickname: Schemas.NullishString,
        type: Schemas.nullish(MmaDetectorType),
        lat: Schemas.NullishNumber,
        lon: Schemas.NullishNumber,
        elevation: Schemas.NullishNumber,
        fixed_location: Schemas.NullishBoolean,
        events: Schemas.nullish(v.array(Schemas.JsonObject)),
        spectra: Schemas.nullish(
            v.array(v.lazy((): v.GenericSchema<unknown, MmaDetectorSpectrum> => MmaDetectorSpectrum))
        ),
        time_intervals: Schemas.nullish(
            v.array(v.lazy((): v.GenericSchema<unknown, MmaDetectorTimeInterval> => MmaDetectorTimeInterval))
        ),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export const MmaDetectorSpectrum = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        detector_id: Schemas.NullishInteger,
        detector: Schemas.nullish(v.lazy((): v.GenericSchema<unknown, MmaDetector> => MmaDetector)),
        frequencies: Schemas.list(v.number()),
        amplitudes: Schemas.list(v.number()),
        start_time: Schemas.NullishTimestamp,
        end_time: Schemas.NullishTimestamp,
        owner_id: Schemas.NullishInteger,
        owner: Schemas.nullish(Schemas.JsonObject),
        groups: Schemas.nullish(v.array(Schemas.JsonObject)),
        original_file_string: Schemas.NullishString,
        original_file_filename: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export const MmaDetectorTimeInterval = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        time_interval: Schemas.list(Schemas.Timestamp),
        owner: Schemas.nullish(Schemas.JsonObject),
        groups: Schemas.nullish(v.array(Schemas.JsonObject)),
        detector: Schemas.nullish(v.lazy((): v.GenericSchema<unknown, MmaDetector> => MmaDetector)),
    })
);

/**
 * Payload for creating an MMA detector.
 *
 * If `fixed_location` is true, `lat` must be between -90 and 90 and `lon`
 * between -180 and 180.
 *
 * @since 1.0.0
 * @category Models
 */
export interface MmaDetectorPost {
    readonly name: string;
    readonly nickname: string;
    readonly type: string;
    readonly fixed_location: boolean;
    readonly lat?: number | undefined;
    readonly lon?: number | undefined;
    readonly elevation?: number | undefined;
}

/**
 * Result of creating an MMA detector.
 *
 * @since 1.0.0
 * @category Models
 */
export const MmaDetectorPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type MmaDetectorPostResponse = v.InferOutput<typeof MmaDetectorPostResponse>;

/**
 * Payload for uploading an MMA detector spectrum.
 *
 * If `group_ids` is omitted, the server applies its default visibility; pass
 * `"all"` to share with all accessible groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface MmaDetectorSpectrumPost {
    readonly frequencies: ReadonlyArray<number>;
    readonly amplitudes: ReadonlyArray<number>;
    readonly start_time: string;
    readonly end_time: string;
    readonly detector_id: number;
    readonly group_ids?: ReadonlyArray<number> | "all" | undefined;
}

/**
 * Result of uploading an MMA detector spectrum.
 *
 * @since 1.0.0
 * @category Models
 */
export const MmaDetectorSpectrumPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type MmaDetectorSpectrumPostResponse = v.InferOutput<typeof MmaDetectorSpectrumPostResponse>;

/**
 * Result of uploading MMA detector time intervals.
 *
 * @since 1.0.0
 * @category Models
 */
export const MmaDetectorTimeIntervalsPostResponse = Schemas.model(
    v.strictObject({
        ids: Schemas.list(Schemas.Integer),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type MmaDetectorTimeIntervalsPostResponse = v.InferOutput<typeof MmaDetectorTimeIntervalsPostResponse>;
