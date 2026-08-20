/**
 * Typed endpoint functions for `/api/mmadetector`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    MmaDetector,
    MmaDetectorSpectrum,
    MmaDetectorTimeInterval,
    MmaDetectorPostResponse,
    MmaDetectorSpectrumPostResponse,
    MmaDetectorTimeIntervalsPostResponse,
    type MmaDetectorPost,
    type MmaDetectorSpectrumPost,
} from "skyportal-js-models/MmaDetectors";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/MmaDetectors";

/**
 * Retrieve a single MMA detector by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param mmadetectorId - ID of the MMA detector.
 */
export const fetchMmaDetector = async (
    client: Http.Client,
    mmadetectorId: number
): Promise<MmaDetector> =>
    Http.decode(
        MmaDetector,
        await Http.get(client, `/api/mmadetector/${mmadetectorId}`)
    );

/**
 * Options for listing MMA detectors.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchMmaDetectorsOptions {
    /** Restrict to detectors whose name contains this string. */
    readonly name?: string | undefined;
}

/**
 * Retrieve all MMA detectors.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchMmaDetectors = async (
    client: Http.Client,
    options: FetchMmaDetectorsOptions = {}
): Promise<Array<MmaDetector>> =>
    Http.decode(
        v.array(MmaDetector),
        await Http.get(client, "/api/mmadetector", { name: options.name })
    );

/**
 * Create an MMA detector.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The detector to create.
 */
export const postMmaDetector = async (
    client: Http.Client,
    payload: MmaDetectorPost
): Promise<MmaDetectorPostResponse> =>
    Http.decode(
        MmaDetectorPostResponse,
        await Http.post(client, "/api/mmadetector", Http.body(payload))
    );

/**
 * Options for updating an MMA detector.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateMmaDetectorOptions {
    /** New unabbreviated facility name. */
    readonly name?: string | undefined;
    /** New abbreviated facility name. */
    readonly nickname?: string | undefined;
    /** New detector type, e.g. `"gravitational wave"`. */
    readonly type?: string | undefined;
    /** New coordinates, in degrees. */
    readonly lat?: number | undefined;
    readonly lon?: number | undefined;
    /** Whether the detector has a fixed location. */
    readonly fixedLocation?: boolean | undefined;
}

/**
 * Update fields of an existing MMA detector.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param mmadetectorId - ID of the MMA detector to update.
 */
export const updateMmaDetector = async (
    client: Http.Client,
    mmadetectorId: number,
    options: UpdateMmaDetectorOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        `/api/mmadetector/${mmadetectorId}`,
        Http.body({
            name: options.name,
            nickname: options.nickname,
            type: options.type,
            lat: options.lat,
            lon: options.lon,
            fixed_location: options.fixedLocation,
        })
    );
};

/**
 * Delete an MMA detector.
 *
 * @since 1.0.0
 * @category Requests
 * @param mmadetectorId - ID of the MMA detector to delete.
 */
export const deleteMmaDetector = async (
    client: Http.Client,
    mmadetectorId: number
): Promise<void> => {
    await Http.del(client, `/api/mmadetector/${mmadetectorId}`);
};

/**
 * Retrieve a single MMA detector spectrum by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the MMA detector spectrum.
 */
export const fetchMmaDetectorSpectrum = async (
    client: Http.Client,
    spectrumId: number
): Promise<MmaDetectorSpectrum> =>
    Http.decode(
        MmaDetectorSpectrum,
        await Http.get(client, `/api/mmadetector/spectra/${spectrumId}`)
    );

/**
 * Options for querying MMA detector spectra or time intervals.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchMmaDetectorDataOptions {
    /**
     * Restrict to records observed before/after this time, as arrow-parseable
     * date strings, e.g. `"2020-01-01"`.
     */
    readonly observedBefore?: string | undefined;
    readonly observedAfter?: string | undefined;
    /** Restrict to records from these MMA detectors. */
    readonly detectorIds?: ReadonlyArray<number> | undefined;
    /** Restrict to records saved to these groups. */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/** @internal */
const detectorDataParams = (
    options: FetchMmaDetectorDataOptions
): Http.QueryParams => ({
    observedBefore: options.observedBefore,
    observedAfter: options.observedAfter,
    detectorIDs: Http.commaSeparated(options.detectorIds),
    groupIDs: Http.commaSeparated(options.groupIds),
});

/**
 * Query MMA detector spectra.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchMmaDetectorSpectra = async (
    client: Http.Client,
    options: FetchMmaDetectorDataOptions = {}
): Promise<Array<MmaDetectorSpectrum>> =>
    Http.decode(
        v.array(MmaDetectorSpectrum),
        await Http.get(client, "/api/mmadetector/spectra", detectorDataParams(options))
    );

/**
 * Upload an MMA detector spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The spectrum to upload.
 */
export const postMmaDetectorSpectrum = async (
    client: Http.Client,
    payload: MmaDetectorSpectrumPost
): Promise<MmaDetectorSpectrumPostResponse> =>
    Http.decode(
        MmaDetectorSpectrumPostResponse,
        await Http.post(client, "/api/mmadetector/spectra", Http.body(payload))
    );

/**
 * Update an MMA detector spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the MMA detector spectrum to update.
 * @param payload - The new spectrum data. Groups in `group_ids` are added to
 *   the spectrum's existing groups.
 */
export const updateMmaDetectorSpectrum = async (
    client: Http.Client,
    spectrumId: number,
    payload: MmaDetectorSpectrumPost
): Promise<void> => {
    await Http.patch(
        client,
        `/api/mmadetector/spectra/${spectrumId}`,
        Http.body(payload)
    );
};

/**
 * Delete an MMA detector spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the MMA detector spectrum to delete.
 */
export const deleteMmaDetectorSpectrum = async (
    client: Http.Client,
    spectrumId: number
): Promise<void> => {
    await Http.del(client, `/api/mmadetector/spectra/${spectrumId}`);
};

/**
 * Retrieve a single MMA detector time interval by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param timeIntervalId - ID of the MMA detector time interval.
 */
export const fetchMmaDetectorTimeInterval = async (
    client: Http.Client,
    timeIntervalId: number
): Promise<MmaDetectorTimeInterval> =>
    Http.decode(
        MmaDetectorTimeInterval,
        await Http.get(client, `/api/mmadetector/time_intervals/${timeIntervalId}`)
    );

/**
 * Query MMA detector time intervals.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchMmaDetectorTimeIntervals = async (
    client: Http.Client,
    options: FetchMmaDetectorDataOptions = {}
): Promise<Array<MmaDetectorTimeInterval>> =>
    Http.decode(
        v.array(MmaDetectorTimeInterval),
        await Http.get(
            client,
            "/api/mmadetector/time_intervals",
            detectorDataParams(options)
        )
    );

/**
 * Options for uploading MMA detector time intervals.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostMmaDetectorTimeIntervalsOptions {
    /**
     * Share the intervals with these groups. If omitted, the server applies
     * its default visibility; pass `"all"` to share with all accessible
     * groups.
     */
    readonly groupIds?: ReadonlyArray<number> | "all" | undefined;
}

/**
 * Upload MMA detector time intervals.
 *
 * @since 1.0.0
 * @category Requests
 * @param detectorId - ID of the MMA detector the intervals belong to.
 * @param timeIntervals - The intervals to upload, each a `[start, end]` pair of
 *   UTC time strings.
 */
export const postMmaDetectorTimeIntervals = async (
    client: Http.Client,
    detectorId: number,
    timeIntervals: ReadonlyArray<readonly [string, string]>,
    options: PostMmaDetectorTimeIntervalsOptions = {}
): Promise<MmaDetectorTimeIntervalsPostResponse> =>
    Http.decode(
        MmaDetectorTimeIntervalsPostResponse,
        await Http.post(
            client,
            "/api/mmadetector/time_intervals",
            Http.body({
                detector_id: detectorId,
                time_intervals: timeIntervals,
                group_ids: options.groupIds,
            })
        )
    );

/**
 * Options for updating an MMA detector time interval.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateMmaDetectorTimeIntervalOptions {
    /** New `[start, end]` pair of UTC time strings. */
    readonly timeInterval?: readonly [string, string] | undefined;
    /**
     * Groups to add to the interval's visibility; pass `"all"` for all
     * accessible groups.
     */
    readonly groupIds?: ReadonlyArray<number> | "all" | undefined;
}

/**
 * Update an MMA detector time interval.
 *
 * @since 1.0.0
 * @category Requests
 * @param timeIntervalId - ID of the MMA detector time interval to update.
 */
export const updateMmaDetectorTimeInterval = async (
    client: Http.Client,
    timeIntervalId: number,
    options: UpdateMmaDetectorTimeIntervalOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        `/api/mmadetector/time_intervals/${timeIntervalId}`,
        Http.body({ time_interval: options.timeInterval, group_ids: options.groupIds })
    );
};

/**
 * Delete an MMA detector time interval.
 *
 * @since 1.0.0
 * @category Requests
 * @param timeIntervalId - ID of the MMA detector time interval to delete.
 */
export const deleteMmaDetectorTimeInterval = async (
    client: Http.Client,
    timeIntervalId: number
): Promise<void> => {
    await Http.del(client, `/api/mmadetector/time_intervals/${timeIntervalId}`);
};
