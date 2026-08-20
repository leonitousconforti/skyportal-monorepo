/**
 * Typed endpoint functions for `/api/candidates`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Candidate,
    CandidatesPage,
    CandidatePostResponse,
    CandidateFilterPage,
    BulkCandidateDeleteResponse,
    ScanReportsPage,
    ScanReportItem,
    type CandidatePost,
    type ScanReportPost,
} from "skyportal-js-models/Candidates";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Candidates";

/**
 * Options for retrieving a single candidate.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchCandidateOptions {
    /** Include the candidate's photometry in `photometry`. */
    readonly includePhotometry?: boolean | undefined;
    /** Include the candidate's spectra in `spectra`. */
    readonly includeSpectra?: boolean | undefined;
    /**
     * Include the filters the candidate passed and the alerts behind them, in
     * `filter_ids` and `passing_alerts`.
     */
    readonly includeAlerts?: boolean | undefined;
}

/**
 * Retrieve a single candidate by object ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the candidate, e.g. `"ZTF20abcdef"`.
 */
export const fetchCandidate = async (
    client: Http.Client,
    objId: string,
    options: FetchCandidateOptions = {}
): Promise<Candidate> =>
    Http.decode(
        Candidate,
        await Http.get(client, `/api/candidates/${objId}`, {
            includePhotometry: options.includePhotometry ?? false,
            includeSpectra: options.includeSpectra ?? false,
            includeAlerts: options.includeAlerts ?? false,
        })
    );

/**
 * Check whether a candidate with this object ID exists.
 *
 * Uses the endpoint's HEAD form, which carries no body.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID to check.
 */
export const candidateExists = (client: Http.Client, objId: string): Promise<boolean> =>
    Http.head(client, `/api/candidates/${objId}`);

/**
 * Options for querying candidates.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchCandidatesOptions {
    /** Pagination controls. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /** Restrict to candidates passing filters belonging to these groups. */
    readonly groupIds?: ReadonlyArray<number> | undefined;
    /**
     * Restrict to candidates passing these filters. Defaults to every filter
     * of the token's groups when `groupIds` is not given.
     */
    readonly filterIds?: ReadonlyArray<number> | undefined;
    /**
     * Filter on whether candidates are saved as sources, e.g. `"all"` or
     * `"savedToAllSelected"`.
     */
    readonly savedStatus?: string | undefined;
    /**
     * Restrict to candidates that passed a filter in this ISO-format (UTC)
     * time range.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    /** Partial object ID to autocomplete against. */
    readonly objId?: string | undefined;
    /** With `objId`, return only the matching object IDs. */
    readonly nameOnly?: boolean | undefined;
    /** Include each candidate's photometry in `photometry`. */
    readonly includePhotometry?: boolean | undefined;
    /**
     * Sort the page by this annotation key from this origin; provide both
     * together.
     */
    readonly sortByAnnotationOrigin?: string | undefined;
    readonly sortByAnnotationKey?: string | undefined;
    /**
     * Direction of the annotation sort, `"asc"` (the server default) or
     * `"desc"`.
     */
    readonly sortByAnnotationOrder?: string | undefined;
    /**
     * JSON-encoded list of `{"origin", "key", "min"/"max"/"value"}` annotation
     * constraints, as the frontend scanner sends it.
     */
    readonly annotationFilterList?: string | undefined;
    /** Keep candidates carrying one of these classifications. */
    readonly classifications?: ReadonlyArray<string> | undefined;
    /** Drop candidates carrying any of these classifications. */
    readonly classificationsReject?: ReadonlyArray<string> | undefined;
    /** Redshift range filter. */
    readonly minRedshift?: number | undefined;
    readonly maxRedshift?: number | undefined;
    /**
     * Keep only candidates saved to this list of the querying user, e.g.
     * `"favorites"`.
     */
    readonly listName?: string | undefined;
    /**
     * Drop candidates saved to this list of the querying user, e.g.
     * `"rejected_candidates"`.
     */
    readonly listNameReject?: string | undefined;
    /**
     * Replay a previously cached query; the response's `queryID` identifies
     * the cache entry.
     */
    readonly queryId?: string | undefined;
    /**
     * Comma-separated `key[:value:operator]` constraints on photometry
     * annotations.
     */
    readonly photometryAnnotationsFilter?: string | undefined;
    /**
     * Comma-separated origins the photometry annotations must come from.
     */
    readonly photometryAnnotationsFilterOrigin?: string | undefined;
    /**
     * ISO-format bounds on the photometry annotations' creation time.
     */
    readonly photometryAnnotationsFilterBefore?: string | undefined;
    readonly photometryAnnotationsFilterAfter?: string | undefined;
    /**
     * Require at least this many photometry annotations passing the
     * photometry-annotation filters. Server default is 1.
     */
    readonly photometryAnnotationsFilterMinCount?: number | undefined;
    /**
     * ISO-format (UTC) bounds on when the candidates were first/last detected.
     */
    readonly firstDetectionAfter?: string | undefined;
    readonly lastDetectionBefore?: string | undefined;
    /** Keep only candidates detected at least this many times. */
    readonly numberDetections?: number | undefined;
    /**
     * Only apply the detection filters above, and require them to be set when
     * querying within a localization. Server default is true.
     */
    readonly requireDetections?: boolean | undefined;
    /** Ignore forced photometry when applying the detection filters. */
    readonly excludeForcedPhotometry?: boolean | undefined;
    /**
     * Restrict to candidates inside a GCN localization, identified by its
     * event time in ISO format.
     */
    readonly localizationDateobs?: string | undefined;
    /**
     * Name of the localization/skymap to use; defaults to the event's most
     * recent localization.
     */
    readonly localizationName?: string | undefined;
    /**
     * Cumulative probability of the localization up to which to include
     * candidates. Server default is 0.95.
     */
    readonly localizationCumprob?: number | undefined;
    /** Save every candidate the query returns as a source. */
    readonly autosave?: boolean | undefined;
    /**
     * Groups to save autosaved candidates to; defaults to all of the token's
     * groups.
     */
    readonly autosaveGroupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Query candidates, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchCandidates = async (
    client: Http.Client,
    options: FetchCandidatesOptions = {}
): Promise<CandidatesPage> =>
    Http.decode(
        CandidatesPage,
        await Http.get(client, "/api/candidates", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 25,
            includePhotometry: options.includePhotometry ?? false,
            requireDetections: options.requireDetections ?? true,
            excludeForcedPhotometry: options.excludeForcedPhotometry ?? false,
            autosave: options.autosave ?? false,
            groupIDs: Http.commaSeparated(options.groupIds),
            filterIDs: Http.commaSeparated(options.filterIds),
            savedStatus: options.savedStatus,
            startDate: options.startDate,
            endDate: options.endDate,
            objID: options.objId,
            nameOnly: options.nameOnly,
            sortByAnnotationOrigin: options.sortByAnnotationOrigin,
            sortByAnnotationKey: options.sortByAnnotationKey,
            sortByAnnotationOrder: options.sortByAnnotationOrder,
            annotationFilterList: options.annotationFilterList,
            classifications: Http.commaSeparated(options.classifications),
            classificationsReject: Http.commaSeparated(options.classificationsReject),
            minRedshift: options.minRedshift,
            maxRedshift: options.maxRedshift,
            listName: options.listName,
            listNameReject: options.listNameReject,
            queryID: options.queryId,
            photometryAnnotationsFilter: options.photometryAnnotationsFilter,
            photometryAnnotationsFilterOrigin:
                options.photometryAnnotationsFilterOrigin,
            photometryAnnotationsFilterBefore:
                options.photometryAnnotationsFilterBefore,
            photometryAnnotationsFilterAfter: options.photometryAnnotationsFilterAfter,
            photometryAnnotationsFilterMinCount:
                options.photometryAnnotationsFilterMinCount,
            firstDetectionAfter: options.firstDetectionAfter,
            lastDetectionBefore: options.lastDetectionBefore,
            numberDetections: options.numberDetections,
            localizationDateobs: options.localizationDateobs,
            localizationName: options.localizationName,
            localizationCumprob: options.localizationCumprob,
            autosaveGroupIds: Http.commaSeparated(options.autosaveGroupIds),
        })
    );

/**
 * Post a new candidate.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The candidate to post, including the filters it passed
 *   (`filter_ids`) and when it passed them (`passed_at`).
 */
export const postCandidate = async (
    client: Http.Client,
    payload: CandidatePost
): Promise<CandidatePostResponse> =>
    Http.decode(
        CandidatePostResponse,
        await Http.post(client, "/api/candidates", Http.body(payload))
    );

/**
 * Delete the candidate entries for an object on a given filter.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the candidate, e.g. `"ZTF20abcdef"`.
 * @param filterId - ID of the filter the candidate passed. The server errors if
 *   no candidate matches this `(objId, filterId)` pairing.
 */
export const deleteCandidate = async (
    client: Http.Client,
    objId: string,
    filterId: number
): Promise<void> => {
    await Http.del(client, `/api/candidates/${objId}/${filterId}`);
};

/**
 * Options for a bulk candidate deletion.
 *
 * @since 1.0.0
 * @category Models
 */
export interface BulkDeleteCandidatesOptions {
    /** Age threshold in months. Server default is 6. */
    readonly maxAgeMonths?: number | undefined;
    /**
     * Maximum number of objects deleted in this call, oldest first. Server
     * default is 1000; must be between 1 and 10000.
     */
    readonly batchSize?: number | undefined;
    /**
     * If true, only report how many objects would be deleted. Server default
     * is false.
     */
    readonly dryRun?: boolean | undefined;
}

/**
 * Bulk-delete old, unsaved candidate objects.
 *
 * Deletes objects that appear as candidates, are not saved as an active source
 * in any group, and whose most recent `passed_at` is older than
 * `maxAgeMonths`. Deleting an object cascades to its candidates, photometry,
 * annotations and thumbnails. Requires the "System admin" permission.
 *
 * @since 1.0.0
 * @category Requests
 */
export const bulkDeleteCandidates = async (
    client: Http.Client,
    options: BulkDeleteCandidatesOptions = {}
): Promise<BulkCandidateDeleteResponse> =>
    Http.decode(
        BulkCandidateDeleteResponse,
        await Http.post(
            client,
            "/api/candidates/bulk_delete",
            Http.body({
                maxAgeMonths: options.maxAgeMonths,
                batchSize: options.batchSize,
                dryRun: options.dryRun,
            })
        )
    );

/**
 * Options for querying raw candidate rows.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchCandidatesFilterOptions {
    /**
     * Pagination controls. Rows are ordered by `passed_at` ascending.
     * `totalMatches` is only computed for page 1; keep it client-side while
     * paginating.
     */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /**
     * Restrict to these groups and filters. Both default to everything
     * accessible to the token.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
    readonly filterIds?: ReadonlyArray<number> | undefined;
    /**
     * Filter on whether candidates are saved as sources, e.g. `"all"` (the
     * server default) or `"savedToAllSelected"`.
     */
    readonly savedStatus?: string | undefined;
    /**
     * Restrict to candidates that passed a filter in this ISO-format (UTC)
     * time range.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
}

/**
 * Query the raw candidate rows, rather than the objects behind them.
 *
 * This is the lighter counterpart of {@link fetchCandidates}: it returns
 * `candidates` table rows, including `passing_alert_id` (the alert candid),
 * which is what maps a candidate back to the upstream alert.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchCandidatesFilter = async (
    client: Http.Client,
    options: FetchCandidatesFilterOptions = {}
): Promise<CandidateFilterPage> =>
    Http.decode(
        CandidateFilterPage,
        await Http.get(client, "/api/candidates_filter", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 25,
            groupIDs: Http.commaSeparated(options.groupIds),
            filterIDs: Http.commaSeparated(options.filterIds),
            savedStatus: options.savedStatus,
            startDate: options.startDate,
            endDate: options.endDate,
        })
    );

/**
 * Generate a candidate scanning report.
 *
 * The server errors if a report already exists for the same groups and
 * options, or if no saved sources match.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - Groups owning the report plus the two time ranges it covers.
 */
export const postScanReport = async (
    client: Http.Client,
    payload: ScanReportPost
): Promise<void> => {
    await Http.post(client, "/api/candidates/scan_reports", Http.body(payload));
};

/**
 * Options for listing scanning reports.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchScanReportsOptions {
    /** Pagination controls. */
    readonly page?: number | undefined;
    readonly numPerPage?: number | undefined;
}

/**
 * Retrieve candidate scanning reports, newest first.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchScanReports = async (
    client: Http.Client,
    options: FetchScanReportsOptions = {}
): Promise<ScanReportsPage> =>
    Http.decode(
        ScanReportsPage,
        await Http.get(client, "/api/candidates/scan_reports", {
            page: options.page ?? 1,
            numPerPage: options.numPerPage ?? 10,
        })
    );

/**
 * Retrieve every item of a candidate scanning report.
 *
 * @since 1.0.0
 * @category Requests
 * @param reportId - ID of the scanning report.
 */
export const fetchScanReportItems = async (
    client: Http.Client,
    reportId: number
): Promise<Array<ScanReportItem>> =>
    Http.decode(
        v.array(ScanReportItem),
        await Http.get(client, `/api/candidates/scan_reports/${reportId}/items`)
    );

/**
 * Set the comment on one item of a candidate scanning report.
 *
 * @since 1.0.0
 * @category Requests
 * @param reportId - ID of the scanning report holding the item.
 * @param itemId - ID of the report item to update.
 * @param comment - The comment to store. Passing `null` clears it, since the
 *   server overwrites the item's `comment` key with whatever is sent.
 */
export const updateScanReportItem = async (
    client: Http.Client,
    reportId: number,
    itemId: number,
    comment: string | null
): Promise<void> => {
    await Http.patch(
        client,
        `/api/candidates/scan_reports/${reportId}/items/${itemId}`,
        {
            comment,
        }
    );
};
