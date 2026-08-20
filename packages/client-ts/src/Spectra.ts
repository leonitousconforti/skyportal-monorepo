/**
 * Typed endpoint functions for spectra.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "skyportal-js-models/Schemas";
import {
    Spectrum,
    SpectrumDetail,
    SpectrumPostResponse,
    ParsedSpectrum,
    BulkSpectraResponse,
    type SpectrumPost,
    type SpectrumUpdate,
    type SpectrumAsciiParse,
    type SpectrumAsciiPost,
} from "skyportal-js-models/Spectra";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Spectra";

/** @internal */
const SourceSpectra = v.strictObject({
    obj_id: Schemas.NullishString,
    spectra: Schemas.list(Spectrum),
});

/**
 * Options for retrieving a single spectrum.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSpectrumOptions {
    /**
     * Also return the file the spectrum was originally uploaded from, in
     * `original_file_string`/`original_file_filename`.
     */
    readonly includeOriginalFile?: boolean | undefined;
}

/**
 * Retrieve a single spectrum by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the spectrum.
 */
export const fetchSpectrum = async (
    client: Http.Client,
    spectrumId: number,
    options: FetchSpectrumOptions = {}
): Promise<Spectrum> =>
    Http.decode(
        Spectrum,
        await Http.get(client, `/api/spectrum/${spectrumId}`, {
            includeOriginalFile: options.includeOriginalFile ?? false,
        })
    );

/**
 * Options for retrieving a source's spectra.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSpectraOptions {
    /**
     * Also return each spectrum's originally uploaded file, in
     * `original_file_string`/`original_file_filename`.
     */
    readonly includeOriginalFile?: boolean | undefined;
    /**
     * Normalize each spectrum's fluxes before returning; the only supported
     * scheme is `"median"` (median absolute flux becomes 1). Omitting it
     * returns the original fluxes.
     */
    readonly normalization?: string | undefined;
    /** Column to order the spectra by, `"observed_at"` or `"created_at"`. */
    readonly sortBy?: string | undefined;
    /** Sort direction, `"asc"` or `"desc"`. */
    readonly sortOrder?: string | undefined;
}

/**
 * Retrieve the spectra of a source.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source, e.g. `"ZTF20abcdef"`.
 */
export const fetchSpectra = async (
    client: Http.Client,
    objId: string,
    options: FetchSpectraOptions = {}
): Promise<Array<Spectrum>> =>
    Http.decode(
        SourceSpectra,
        await Http.get(client, `/api/sources/${objId}/spectra`, {
            includeOriginalFile: options.includeOriginalFile ?? false,
            sortBy: options.sortBy ?? "observed_at",
            sortOrder: options.sortOrder ?? "asc",
            normalization: options.normalization,
        })
    ).spectra;

/**
 * Post a spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The spectrum to post.
 */
export const postSpectrum = async (
    client: Http.Client,
    payload: SpectrumPost
): Promise<SpectrumPostResponse> =>
    Http.decode(
        SpectrumPostResponse,
        await Http.post(client, "/api/spectrum", Http.body(payload))
    );

/**
 * Delete a spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the spectrum to delete.
 */
export const deleteSpectrum = async (
    client: Http.Client,
    spectrumId: number
): Promise<void> => {
    await Http.del(client, `/api/spectrum/${spectrumId}`);
};

/**
 * Update a spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the spectrum to update.
 * @param payload - Fields to change.
 */
export const updateSpectrum = async (
    client: Http.Client,
    spectrumId: number,
    payload: SpectrumUpdate
): Promise<void> => {
    await Http.put(client, `/api/spectrum/${spectrumId}`, Http.body(payload));
};

/**
 * Options for querying spectra across all sources.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSpectraQueryOptions {
    /**
     * Return only metadata for each spectrum (no wavelengths, fluxes, comments
     * or annotations), which is much smaller.
     */
    readonly minimalPayload?: boolean | undefined;
    /**
     * Include the raw uploaded file in `original_file_string`. Ignored when
     * `minimalPayload` is set.
     */
    readonly includeOriginalFile?: boolean | undefined;
    /** Partial match against the object ID a spectrum belongs to. */
    readonly objId?: string | undefined;
    /** Restrict to spectra linked to any of these IDs. */
    readonly instrumentIds?: ReadonlyArray<number> | undefined;
    readonly groupIds?: ReadonlyArray<number> | undefined;
    readonly followupRequestIds?: ReadonlyArray<number> | undefined;
    readonly assignmentIds?: ReadonlyArray<number> | undefined;
    /**
     * Partial matches against the spectrum origin or label; a spectrum matches
     * if any value matches.
     */
    readonly origin?: ReadonlyArray<string> | undefined;
    readonly label?: ReadonlyArray<string> | undefined;
    /**
     * Restrict to these spectrum types (the allowed types come from the server
     * config, e.g. `"source"` or `"host"`).
     */
    readonly spectrumType?: ReadonlyArray<string> | undefined;
    /**
     * Restrict by observation time; any date string the server can parse, e.g.
     * `"2020-01-01"`.
     */
    readonly observedBefore?: string | undefined;
    readonly observedAfter?: string | undefined;
    /** Restrict by last-modified time, same format. */
    readonly modifiedBefore?: string | undefined;
    readonly modifiedAfter?: string | undefined;
    /** Keep only spectra with a comment containing any of these strings. */
    readonly commentsFilter?: ReadonlyArray<string> | undefined;
    /** Only comments from these authors count towards `commentsFilter`. */
    readonly commentsFilterAuthor?: ReadonlyArray<string> | undefined;
    /** Only comments posted in this window count towards `commentsFilter`. */
    readonly commentsFilterBefore?: string | undefined;
    readonly commentsFilterAfter?: string | undefined;
}

/**
 * Query spectra across all sources, filtered on the server.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSpectraQuery = async (
    client: Http.Client,
    options: FetchSpectraQueryOptions = {}
): Promise<Array<SpectrumDetail>> =>
    Http.decode(
        v.array(SpectrumDetail),
        await Http.get(client, "/api/spectra", {
            minimalPayload: options.minimalPayload ?? false,
            includeOriginalFile: options.includeOriginalFile ?? false,
            objID: options.objId,
            instrumentIDs: Http.commaSeparated(options.instrumentIds),
            groupIDs: Http.commaSeparated(options.groupIds),
            followupRequestIDs: Http.commaSeparated(options.followupRequestIds),
            assignmentIDs: Http.commaSeparated(options.assignmentIds),
            origin: Http.commaSeparated(options.origin),
            label: Http.commaSeparated(options.label),
            type: Http.commaSeparated(options.spectrumType),
            observedBefore: options.observedBefore,
            observedAfter: options.observedAfter,
            modifiedBefore: options.modifiedBefore,
            modifiedAfter: options.modifiedAfter,
            commentsFilter: Http.commaSeparated(options.commentsFilter),
            commentsFilterAuthor: Http.commaSeparated(options.commentsFilterAuthor),
            commentsFilterBefore: options.commentsFilterBefore,
            commentsFilterAfter: options.commentsFilterAfter,
        })
    );

/**
 * Options for a spectra date-range query.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSpectraRangeOptions {
    /**
     * Restrict to these instruments. If omitted, all instruments the token can
     * see are included.
     */
    readonly instrumentIds?: ReadonlyArray<number> | undefined;
    /**
     * Bounds on the observation time, as ISOT UTC strings, e.g.
     * `"2020-01-01T00:00:00"`. Either bound may be omitted to leave the range
     * open ended.
     */
    readonly minDate?: string | undefined;
    readonly maxDate?: string | undefined;
}

/**
 * Retrieve spectra observed within a date range.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSpectraRange = async (
    client: Http.Client,
    options: FetchSpectraRangeOptions = {}
): Promise<Array<SpectrumDetail>> =>
    Http.decode(
        v.array(SpectrumDetail),
        await Http.get(client, "/api/spectra/range", {
            instrument_ids: options.instrumentIds,
            min_date: options.minDate,
            max_date: options.maxDate,
        })
    );

/**
 * Options for a bulk spectra query.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostSpectraBulkOptions {
    /** Restrict to sources saved to this group. */
    readonly groupId?: number | undefined;
    /** Restrict to these object IDs. */
    readonly objIds?: ReadonlyArray<string> | undefined;
    /**
     * Restrict to sources carrying any of these non-machine-learning
     * classifications.
     */
    readonly classifications?: ReadonlyArray<string> | undefined;
    /** Only count classifications at or above this probability. */
    readonly classificationProbThreshold?: number | undefined;
    /**
     * Maximum number of sources to fetch spectra for. Defaults to 200 on the
     * server and is capped at 1000; at most 3000 spectra are returned, and
     * `truncated` reports whether either cap was hit.
     */
    readonly maxSources?: number | undefined;
}

/**
 * Retrieve slim spectra and phase anchors for a set of sources.
 *
 * Despite being a POST, this endpoint only reads data: it fans a whole source
 * set into one response so that phase-stacked spectra views do not need one
 * request per source.
 *
 * @since 1.0.0
 * @category Requests
 */
export const postSpectraBulk = async (
    client: Http.Client,
    options: PostSpectraBulkOptions = {}
): Promise<BulkSpectraResponse> =>
    Http.decode(
        BulkSpectraResponse,
        await Http.post(
            client,
            "/api/spectra/bulk",
            Http.body({
                group_id: options.groupId,
                obj_ids: options.objIds,
                classifications: options.classifications,
                classificationProbThreshold: options.classificationProbThreshold,
                maxSources: options.maxSources,
            })
        )
    );

/**
 * Parse an ASCII spectrum without saving it to the database.
 *
 * The returned spectrum has no `id` because nothing is persisted.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The ASCII file contents plus the column layout.
 */
export const parseSpectrumAscii = async (
    client: Http.Client,
    payload: SpectrumAsciiParse
): Promise<ParsedSpectrum> =>
    Http.decode(
        ParsedSpectrum,
        await Http.post(client, "/api/spectrum/parse/ascii", Http.body(payload))
    );

/**
 * Upload a spectrum from an ASCII file.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The ASCII file contents, the object and instrument it
 *   belongs to, the observation time and the original `filename`.
 */
export const postSpectrumAscii = async (
    client: Http.Client,
    payload: SpectrumAsciiPost
): Promise<SpectrumPostResponse> =>
    Http.decode(
        SpectrumPostResponse,
        await Http.post(client, "/api/spectrum/ascii", Http.body(payload))
    );

/**
 * Create synthetic photometry from a spectrum.
 *
 * @since 1.0.0
 * @category Requests
 * @param spectrumId - ID of the spectrum to synthesise photometry from. Its
 *   `units` must be set, otherwise the server cannot convert the fluxes.
 * @param filters - Bandpass names to compute AB magnitudes in. The resulting
 *   photometry points are saved for the spectrum's object and shared with every
 *   group the token can access.
 */
export const postSyntheticPhotometry = async (
    client: Http.Client,
    spectrumId: number,
    filters: ReadonlyArray<string>
): Promise<void> => {
    await Http.post(client, `/api/spectra/synthphot/${spectrumId}`, { filters });
};
