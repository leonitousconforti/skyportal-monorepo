/**
 * Request and response models for `/api/candidates`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Annotations from "./Annotations.ts";
import * as Classifications from "./Classifications.ts";
import * as Comments from "./Comments.ts";
import * as Galaxies from "./Galaxies.ts";
import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Tags from "./Tags.ts";
import * as Thumbnails from "./Thumbnails.ts";

/**
 * One alert that made an object pass a filter (upstream `Candidate`).
 *
 * @since 1.0.0
 * @category Models
 */
export const CandidatePassingAlert = Schemas.model(
    v.strictObject({
        filter_id: Schemas.NullishInteger,
        passing_alert_id: Schemas.NullishInteger,
        passed_at: Schemas.NullishTimestamp,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CandidatePassingAlert = v.InferOutput<typeof CandidatePassingAlert>;

/**
 * Another object linked to a candidate through a `SuperObj`.
 *
 * @since 1.0.0
 * @category Models
 */
export const CandidateAssociatedObj = Schemas.model(
    v.strictObject({
        obj_id: Schemas.NullishString,
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        separation: Schemas.NullishNumber,
        super_obj_id: Schemas.NullishInteger,
        super_obj_name: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CandidateAssociatedObj = v.InferOutput<typeof CandidateAssociatedObj>;

/**
 * An object that passed a filter (upstream `Obj`, scanning view).
 *
 * The candidate endpoints serialize the `Obj` itself and graft the scanning
 * extras onto it, so every `Obj` column appears here. The `photometry`,
 * `spectra` and `followup_requests` payloads keep their eager-loaded
 * relationships inline and stay free-form.
 *
 * @since 1.0.0
 * @category Models
 */
export const Candidate = Schemas.model(
    v.strictObject({
        id: v.string(),
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        ra_dis: Schemas.NullishNumber,
        dec_dis: Schemas.NullishNumber,
        ra_err: Schemas.NullishNumber,
        dec_err: Schemas.NullishNumber,
        offset: Schemas.NullishNumber,
        t0: Schemas.NullishNumber,
        redshift: Schemas.NullishNumber,
        redshift_error: Schemas.NullishNumber,
        redshift_origin: Schemas.NullishString,
        redshift_history: Schemas.nullish(v.array(Schemas.JsonObject)),
        host_id: Schemas.NullishInteger,
        summary: Schemas.NullishString,
        summary_history: Schemas.nullish(v.array(Schemas.JsonObject)),
        altdata: Schemas.nullish(Schemas.JsonObject),
        dist_nearest_source: Schemas.NullishNumber,
        mag_nearest_source: Schemas.NullishNumber,
        e_mag_nearest_source: Schemas.NullishNumber,
        transient: Schemas.NullishBoolean,
        varstar: Schemas.NullishBoolean,
        is_roid: Schemas.NullishBoolean,
        mpc_name: Schemas.NullishString,
        tns_name: Schemas.NullishString,
        tns_info: Schemas.nullish(Schemas.JsonObject),
        score: Schemas.NullishNumber,
        origin: Schemas.NullishString,
        alias: Schemas.nullish(v.array(v.string())),
        healpix: Schemas.NullishInteger,
        detect_photometry_count: Schemas.NullishInteger,
        internal_key: Schemas.NullishString,

        // Relationships the handlers eager-load.
        thumbnails: Schemas.nullish(v.array(Thumbnails.Thumbnail)),
        photstats: Schemas.nullish(v.array(Schemas.JsonObject)),
        host: Schemas.nullish(Galaxies.Galaxy),

        // Keys the handlers inject.
        is_source: Schemas.nullish(v.union([v.boolean(), Schemas.Integer])),
        saved_groups: Schemas.nullish(v.array(Groups.Group)),
        classifications: Schemas.nullish(v.array(Classifications.Classification)),
        passing_group_ids: Schemas.nullish(v.array(Schemas.Integer)),
        filter_ids: Schemas.nullish(v.array(Schemas.Integer)),
        passing_alerts: Schemas.nullish(v.array(CandidatePassingAlert)),
        tags: Schemas.nullish(v.array(Tags.ObjTag)),
        annotations: Schemas.nullish(v.array(Annotations.Annotation)),
        comments: Schemas.nullish(v.array(Comments.Comment)),
        photometry: Schemas.nullish(v.array(Schemas.JsonObject)),
        spectra: Schemas.nullish(v.array(Schemas.JsonObject)),
        followup_requests: Schemas.nullish(v.array(Schemas.JsonObject)),
        associated_objs: Schemas.nullish(v.array(CandidateAssociatedObj)),
        last_detected_at: Schemas.NullishTimestamp,
        gal_lon: Schemas.NullishNumber,
        gal_lat: Schemas.NullishNumber,
        luminosity_distance: Schemas.NullishNumber,
        dm: Schemas.NullishNumber,
        angular_diameter_distance: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Candidate = v.InferOutput<typeof Candidate>;

/**
 * One page of results from a candidates query.
 *
 * The name-only autocomplete form returns a bare `{ candidates: [...] }` with
 * no pagination keys, so `totalMatches` cannot be required.
 *
 * @since 1.0.0
 * @category Models
 */
export const CandidatesPage = Schemas.model(
    v.strictObject({
        candidates: v.array(Candidate),
        totalMatches: Schemas.NullishInteger,
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 25),
        queryID: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CandidatesPage = v.InferOutput<typeof CandidatesPage>;

/**
 * Payload for posting a new candidate.
 *
 * Beyond the candidate's own fields, the server loads the body with the `Obj`
 * schema, so any `Obj` column may be set when the object does not exist yet
 * (and is updated in place when it does).
 *
 * @since 1.0.0
 * @category Models
 */
export interface CandidatePost {
    readonly id: string;
    readonly ra: number;
    readonly dec: number;
    readonly filter_ids: ReadonlyArray<number>;
    readonly passed_at: string;
    readonly passing_alert_id?: number | undefined;
    readonly ra_dis?: number | undefined;
    readonly dec_dis?: number | undefined;
    readonly ra_err?: number | undefined;
    readonly dec_err?: number | undefined;
    readonly offset?: number | undefined;
    readonly t0?: number | undefined;
    readonly redshift?: number | undefined;
    readonly redshift_error?: number | undefined;
    readonly redshift_origin?: string | undefined;
    readonly host_id?: number | undefined;
    readonly summary?: string | undefined;
    readonly altdata?: Record<string, unknown> | undefined;
    readonly dist_nearest_source?: number | undefined;
    readonly mag_nearest_source?: number | undefined;
    readonly e_mag_nearest_source?: number | undefined;
    readonly transient?: boolean | undefined;
    readonly varstar?: boolean | undefined;
    readonly is_roid?: boolean | undefined;
    readonly mpc_name?: string | undefined;
    readonly tns_name?: string | undefined;
    readonly tns_info?: Record<string, unknown> | undefined;
    readonly score?: number | undefined;
    readonly origin?: string | undefined;
    readonly alias?: ReadonlyArray<string> | undefined;
    readonly detect_photometry_count?: number | undefined;
}

/**
 * Result of posting a new candidate.
 *
 * @since 1.0.0
 * @category Models
 */
export const CandidatePostResponse = Schemas.model(
    v.strictObject({
        ids: Schemas.list(Schemas.Integer),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CandidatePostResponse = v.InferOutput<typeof CandidatePostResponse>;

/**
 * One row of the `candidates` table (upstream `Candidate`).
 *
 * @since 1.0.0
 * @category Models
 */
export const CandidateRecordEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    obj_id: Schemas.NullishString,
    filter_id: Schemas.NullishInteger,
    passed_at: Schemas.NullishTimestamp,
    passing_alert_id: Schemas.NullishInteger,
    uploader_id: Schemas.NullishInteger,
};

/**
 * @since 1.0.0
 * @category Models
 */
export const CandidateRecord = Schemas.model(v.strictObject(CandidateRecordEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type CandidateRecord = v.InferOutput<typeof CandidateRecord>;

/**
 * One page of raw candidate rows from `/api/candidates_filter`.
 *
 * @since 1.0.0
 * @category Models
 */
export const CandidateFilterPage = Schemas.model(
    v.strictObject({
        candidates: Schemas.list(CandidateRecord),
        totalMatches: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type CandidateFilterPage = v.InferOutput<typeof CandidateFilterPage>;

/**
 * Result of a bulk deletion of old, unsaved candidate objects.
 *
 * @since 1.0.0
 * @category Models
 */
export const BulkCandidateDeleteResponse = Schemas.model(
    v.strictObject({
        deleted: Schemas.Integer,
        remaining: Schemas.Integer,
        dryRun: v.optional(v.boolean(), false),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BulkCandidateDeleteResponse = v.InferOutput<typeof BulkCandidateDeleteResponse>;

/**
 * Time range over which candidates must have passed a filter.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ScanReportPassedFiltersRange {
    readonly start_date: string;
    readonly end_date: string;
}

/**
 * Time range over which candidates must have been saved as sources.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ScanReportSavedCandidatesRange {
    readonly start_saved_date: string;
    readonly end_saved_date: string;
}

/**
 * Payload for generating a candidate scanning report.
 *
 * Each range may instead be given as a rolling window in hours ending now
 * (`passed_filters_window_hours`, `saved_candidates_window_hours`); the
 * explicit ranges win when both are supplied.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ScanReportPost {
    readonly group_ids: ReadonlyArray<number>;
    readonly passed_filters_range?: ScanReportPassedFiltersRange | undefined;
    readonly saved_candidates_range?: ScanReportSavedCandidatesRange | undefined;
    readonly passed_filters_window_hours?: number | undefined;
    readonly saved_candidates_window_hours?: number | undefined;
    readonly gcn_event_dateobs?: string | undefined;
}

/**
 * A candidate scanning report (upstream `ScanReport`).
 *
 * `author` is the author's username, which the handler substitutes for the
 * `author` relationship before returning the report.
 *
 * @since 1.0.0
 * @category Models
 */
export const ScanReport = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        author_id: Schemas.NullishInteger,
        author: Schemas.NullishString,
        options: Schemas.nullish(Schemas.JsonObject),
        groups: Schemas.nullish(v.array(Groups.Group)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ScanReport = v.InferOutput<typeof ScanReport>;

/**
 * One page of candidate scanning reports.
 *
 * @since 1.0.0
 * @category Models
 */
export const ScanReportsPage = Schemas.model(
    v.strictObject({
        reports: Schemas.list(ScanReport),
        totalMatches: Schemas.Integer,
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 10),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ScanReportsPage = v.InferOutput<typeof ScanReportsPage>;

/**
 * One saved candidate listed in a scanning report.
 *
 * @since 1.0.0
 * @category Models
 */
export const ScanReportItem = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        scan_report_id: Schemas.NullishInteger,
        data: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ScanReportItem = v.InferOutput<typeof ScanReportItem>;
