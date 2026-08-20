/**
 * Typed endpoint functions for `/api/photometric_series`.
 *
 * @since 1.0.0
 */

import {
    PhotometricSeries,
    PhotometricSeriesPage,
    PhotometricSeriesPostResponse,
    type PhotometricSeriesPost,
} from "skyportal-js-models/PhotometricSeries";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/PhotometricSeries";

/**
 * Options for retrieving a single photometric series.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchPhotometricSeriesOptions {
    /**
     * How to return the light curve in the `data` field: `"json"` (the
     * default; a mapping of column name to list of values), `"hdf5"` (a
     * base64-encoded HDF5 bytestream) or `"none"` (omit the data and return
     * metadata only).
     */
    readonly dataFormat?: string | undefined;
}

/**
 * Retrieve a single photometric series by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param photometricSeriesId - ID of the photometric series.
 */
export const fetchPhotometricSeries = async (
    client: Http.Client,
    photometricSeriesId: number,
    options: FetchPhotometricSeriesOptions = {}
): Promise<PhotometricSeries> =>
    Http.decode(
        PhotometricSeries,
        await Http.get(client, `/api/photometric_series/${photometricSeriesId}`, {
            dataFormat: options.dataFormat ?? "json",
        })
    );

/**
 * Options for a photometric series query.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchPhotometricSeriesPageOptions {
    /**
     * How to return each light curve in the `data` field: `"none"` (the
     * default for multi-series queries; metadata only), `"json"` or `"hdf5"`.
     * Requesting the data can return a very large payload unless the query is
     * narrowed down.
     */
    readonly dataFormat?: string | undefined;
    /** Page of results to return. */
    readonly pageNumber?: number | undefined;
    /** Results per page. Capped server-side at 500. */
    readonly numPerPage?: number | undefined;
    /** Column to sort by, e.g. `"id"`, `"ra"`, `"dec"` or `"saved_at"`. */
    readonly sortBy?: string | undefined;
    /** `"asc"` or `"desc"`. */
    readonly sortOrder?: string | undefined;
    /**
     * Right ascension in degrees for a cone search. Only applied when `dec`
     * and `radius` are given too.
     */
    readonly ra?: number | undefined;
    /** Declination in degrees for a cone search. */
    readonly dec?: number | undefined;
    /** Cone search radius in degrees. */
    readonly radius?: number | undefined;
    /** Substring of the SkyPortal object ID to match. */
    readonly objectId?: string | undefined;
    /** Comma-separated object IDs to exclude from the results. */
    readonly rejectedObjectId?: string | undefined;
    /** Exact series name to match. */
    readonly seriesName?: string | undefined;
    /**
     * Exact object ID used inside the series, e.g. a TESS TIC ID. This is not
     * the SkyPortal object ID.
     */
    readonly seriesObjId?: string | undefined;
    /** Bandpass to match, e.g. `"ztfg"`. */
    readonly filter?: string | undefined;
    /** Channel name or ID to match. */
    readonly channel?: string | undefined;
    /** Provenance string to match, e.g. the pipeline that produced the data. */
    readonly origin?: string | undefined;
    /**
     * Filename to match. Relative paths are resolved against the server's
     * photometric series data directory.
     */
    readonly filename?: string | undefined;
    /** Arrow-parseable date; keep only series that started before it. */
    readonly startBefore?: string | undefined;
    /** Arrow-parseable date; keep only series that started after it. */
    readonly startAfter?: string | undefined;
    /** Arrow-parseable date; keep only series whose midpoint is before it. */
    readonly midBefore?: string | undefined;
    /** Arrow-parseable date; keep only series whose midpoint is after it. */
    readonly midAfter?: string | undefined;
    /** Arrow-parseable date; keep only series that ended before it. */
    readonly endBefore?: string | undefined;
    /** Arrow-parseable date; keep only series that ended after it. */
    readonly endAfter?: string | undefined;
    /** Keep only series with (`true`) or without (`false`) detections. */
    readonly detected?: boolean | undefined;
    /** Keep only series with exactly this exposure time, in seconds. */
    readonly expTime?: number | undefined;
    /** Minimum exposure time, in seconds. */
    readonly minExpTime?: number | undefined;
    /** Maximum exposure time, in seconds. */
    readonly maxExpTime?: number | undefined;
    /** Minimum frame rate, in Hz. */
    readonly minFrameRate?: number | undefined;
    /** Maximum frame rate, in Hz. */
    readonly maxFrameRate?: number | undefined;
    /** Minimum number of exposures. */
    readonly minNumExposures?: number | undefined;
    /** Maximum number of exposures. */
    readonly maxNumExposures?: number | undefined;
    /** Keep only series taken with this instrument. */
    readonly instrumentId?: number | undefined;
    /** Keep only series taken for this follow-up request. */
    readonly followupRequestId?: number | undefined;
    /** Keep only series taken for this observing run assignment. */
    readonly assignmentId?: number | undefined;
    /** Keep only series uploaded by this user. */
    readonly ownerId?: number | undefined;
    /** Keep only series with a mean magnitude at least this bright. */
    readonly magBrighterThan?: number | undefined;
    /** Keep only series with a mean magnitude at least this faint. */
    readonly magFainterThan?: number | undefined;
    /** Keep only series with a limiting magnitude at least this bright. */
    readonly limitingMagBrighterThan?: number | undefined;
    /** Keep only series with a limiting magnitude at least this faint. */
    readonly limitingMagFainterThan?: number | undefined;
    /**
     * Keep only series that have no limiting magnitude. Only sent when true,
     * because the server treats any value it receives as enabled.
     */
    readonly limitingMagIsNaN?: boolean | undefined;
    /** Keep only series that have a magref at least this bright. */
    readonly magrefBrighterThan?: number | undefined;
    /** Keep only series that have a magref at least this faint. */
    readonly magrefFainterThan?: number | undefined;
    /** Minimum magnitude RMS. */
    readonly minRms?: number | undefined;
    /** Maximum magnitude RMS. */
    readonly maxRms?: number | undefined;
    /**
     * Filter on `robust_mag`/`robust_rms` instead of `mean_mag`/`rms_mag`.
     * Does not affect the magref filters. Only sent when true, because the
     * server treats any value it receives as enabled.
     */
    readonly useRobustMagAndRms?: boolean | undefined;
    /** Minimum median signal-to-noise ratio. */
    readonly minMedianSnr?: number | undefined;
    /** Maximum median signal-to-noise ratio. */
    readonly maxMedianSnr?: number | undefined;
    /** Minimum best signal-to-noise ratio. */
    readonly minBestSnr?: number | undefined;
    /** Maximum best signal-to-noise ratio. */
    readonly maxBestSnr?: number | undefined;
    /** Minimum worst signal-to-noise ratio. */
    readonly minWorstSnr?: number | undefined;
    /** Maximum worst signal-to-noise ratio. */
    readonly maxWorstSnr?: number | undefined;
    /**
     * MD5 hash of the series data file, useful to match a downloaded HDF5 file
     * back to its series.
     */
    readonly fileHash?: string | undefined;
}

/**
 * Retrieve one page of photometric series matching a query.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchPhotometricSeriesPage = async (
    client: Http.Client,
    options: FetchPhotometricSeriesPageOptions = {}
): Promise<PhotometricSeriesPage> =>
    Http.decode(
        PhotometricSeriesPage,
        await Http.get(client, "/api/photometric_series", {
            dataFormat: options.dataFormat ?? "none",
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 100,
            sortBy: options.sortBy ?? "obj_id",
            sortOrder: options.sortOrder ?? "asc",
            ra: options.ra,
            dec: options.dec,
            radius: options.radius,
            objectID: options.objectId,
            rejectedObjectID: options.rejectedObjectId,
            seriesName: options.seriesName,
            seriesObjID: options.seriesObjId,
            filter: options.filter,
            channel: options.channel,
            origin: options.origin,
            filename: options.filename,
            startBefore: options.startBefore,
            startAfter: options.startAfter,
            midBefore: options.midBefore,
            midAfter: options.midAfter,
            endBefore: options.endBefore,
            endAfter: options.endAfter,
            detected: options.detected,
            expTime: options.expTime,
            minExpTime: options.minExpTime,
            maxExpTime: options.maxExpTime,
            minFrameRate: options.minFrameRate,
            maxFrameRate: options.maxFrameRate,
            minNumExposures: options.minNumExposures,
            maxNumExposures: options.maxNumExposures,
            instrumentID: options.instrumentId,
            followupRequestID: options.followupRequestId,
            assignmentID: options.assignmentId,
            ownerID: options.ownerId,
            magBrighterThan: options.magBrighterThan,
            magFainterThan: options.magFainterThan,
            limitingMagBrighterThan: options.limitingMagBrighterThan,
            limitingMagFainterThan: options.limitingMagFainterThan,
            limitingMagIsNaN: options.limitingMagIsNaN === true ? true : undefined,
            magrefBrighterThan: options.magrefBrighterThan,
            magrefFainterThan: options.magrefFainterThan,
            minRMS: options.minRms,
            maxRMS: options.maxRms,
            useRobustMagAndRMS: options.useRobustMagAndRms === true ? true : undefined,
            minMedianSNR: options.minMedianSnr,
            maxMedianSNR: options.maxMedianSnr,
            minBestSNR: options.minBestSnr,
            maxBestSNR: options.maxBestSnr,
            minWorstSNR: options.minWorstSnr,
            maxWorstSNR: options.maxWorstSnr,
            hash: options.fileHash,
        })
    );

/**
 * Upload a photometric series.
 *
 * `series_name`, `series_obj_id`, `obj_id` and `instrument_id` are required by
 * the server. If `group_ids` is omitted the series is shared with the
 * configured default group; pass `"all"` to share it with the public group.
 * The uploader's single-user group is always added.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The series to upload.
 */
export const postPhotometricSeries = async (
    client: Http.Client,
    payload: PhotometricSeriesPost
): Promise<PhotometricSeriesPostResponse> =>
    Http.decode(
        PhotometricSeriesPostResponse,
        await Http.post(client, "/api/photometric_series", Http.body(payload))
    );

/**
 * Update a photometric series.
 *
 * The series is reloaded, its metadata and data updated, and it is written
 * back to disk. If new `data` is supplied, `ra`, `dec`, `exp_time` and
 * `filter` are re-inferred from the data columns and override the stored
 * values unless they are given explicitly here.
 *
 * @since 1.0.0
 * @category Requests
 * @param photometricSeriesId - ID of the photometric series to update.
 * @param payload - Fields to apply; all of them are optional for an update.
 */
export const updatePhotometricSeries = async (
    client: Http.Client,
    photometricSeriesId: number,
    payload: PhotometricSeriesPost
): Promise<PhotometricSeriesPostResponse> =>
    Http.decode(
        PhotometricSeriesPostResponse,
        await Http.patch(
            client,
            `/api/photometric_series/${photometricSeriesId}`,
            Http.body(payload)
        )
    );

/**
 * Delete a photometric series.
 *
 * @since 1.0.0
 * @category Requests
 * @param photometricSeriesId - ID of the photometric series to delete. If the
 *   series was stored with `autodelete` enabled, its data file is removed from
 *   disk too.
 */
export const deletePhotometricSeries = async (
    client: Http.Client,
    photometricSeriesId: number
): Promise<void> => {
    await Http.del(client, `/api/photometric_series/${photometricSeriesId}`);
};
