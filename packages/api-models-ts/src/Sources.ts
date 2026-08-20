/**
 * Request and response models for `/api/sources`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Analysis from "./Analysis.ts";
import * as Annotations from "./Annotations.ts";
import * as Assignments from "./Assignments.ts";
import * as Candidates from "./Candidates.ts";
import * as Classifications from "./Classifications.ts";
import * as Comments from "./Comments.ts";
import * as Filters from "./Filters.ts";
import * as FollowupRequests from "./FollowupRequests.ts";
import * as Galaxies from "./Galaxies.ts";
import * as Groups from "./Groups.ts";
import * as Photometry from "./Photometry.ts";
import * as Schemas from "./Schemas.ts";
import * as Tags from "./Tags.ts";
import * as Thumbnails from "./Thumbnails.ts";
import * as Users from "./Users.ts";

/**
 * A group a source is saved to, with its `sources` join-table record.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceSavedGroup = Schemas.model(
    v.strictObject({
        ...Groups.GroupEntries,
        active: Schemas.NullishBoolean,
        requested: Schemas.NullishBoolean,
        saved_at: Schemas.NullishTimestamp,
        saved_by: Schemas.nullish(Users.User),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceSavedGroup = v.InferOutput<typeof SourceSavedGroup>;

/**
 * An annotation as returned on a source (upstream `Annotation`).
 *
 * `get_source` tags every annotation with the resource it belongs to.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceAnnotation = Schemas.model(
    v.strictObject({
        ...Annotations.AnnotationEntries,
        type: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceAnnotation = v.InferOutput<typeof SourceAnnotation>;

/**
 * Another saved source within 4 arcsec of this one (upstream `Obj`).
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceDuplicate = Schemas.model(
    v.strictObject({
        obj_id: v.string(),
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        separation: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceDuplicate = v.InferOutput<typeof SourceDuplicate>;

/**
 * An object linked to this source through a `SuperObj`.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceAssociatedObj = Schemas.model(
    v.strictObject({
        obj_id: v.string(),
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
export type SourceAssociatedObj = v.InferOutput<typeof SourceAssociatedObj>;

/**
 * How a source stands against a GCN event, as the source handler words it.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnNoteStatus = v.picklist([
    "highlighted",
    "rejected",
    "ambiguous",
    "pending",
    "not vetted",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnNoteStatus = v.InferOutput<typeof GcnNoteStatus>;

/**
 * A source's vetting note for one GCN event (upstream `GcnEventObj`).
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceGcnNote = Schemas.model(
    v.strictObject({
        dateobs: Schemas.NullishTimestamp,
        explanation: Schemas.NullishString,
        notes: Schemas.NullishString,
        status: Schemas.nullish(GcnNoteStatus),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceGcnNote = v.InferOutput<typeof SourceGcnNote>;

/**
 * A filter passage as returned on a source (upstream `Candidate`).
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceCandidate = Schemas.model(
    v.strictObject({
        ...Candidates.CandidateRecordEntries,
        filter: Schemas.nullish(Filters.Filter),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceCandidate = v.InferOutput<typeof SourceCandidate>;

/**
 * A follow-up request as returned on a source (upstream `FollowupRequest`).
 *
 * `get_source` replaces the transaction rows with the decoded JSON bodies of
 * their responses, and only for admins.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceFollowupRequest = Schemas.model(
    v.strictObject({
        ...FollowupRequests.FollowupRequestEntries,
        transactions: Schemas.list(Schemas.Json),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceFollowupRequest = v.InferOutput<typeof SourceFollowupRequest>;

/**
 * A color and absolute magnitude derived from one catalog cross-match.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceColorMag = Schemas.model(
    v.strictObject({
        origin: Schemas.NullishString,
        color: Schemas.NullishNumber,
        abs_mag: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceColorMag = v.InferOutput<typeof SourceColorMag>;

/**
 * Aggregate photometry statistics for one object (upstream `PhotStat`).
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotStat = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        last_update: Schemas.NullishTimestamp,
        last_full_update: Schemas.NullishTimestamp,
        /** Not a column: set on the instance by `PhotStatHandler.get`. */
        last_phot_add_time: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        num_obs_global: Schemas.NullishInteger,
        num_obs_per_filter: Schemas.nullish(Schemas.JsonObject),
        num_det_global: Schemas.NullishInteger,
        num_det_no_forced_phot_global: Schemas.NullishInteger,
        num_det_per_filter: Schemas.nullish(Schemas.JsonObject),
        first_detected_mjd: Schemas.NullishNumber,
        first_detected_mag: Schemas.NullishNumber,
        first_detected_filter: Schemas.NullishString,
        last_detected_mjd: Schemas.NullishNumber,
        last_detected_mag: Schemas.NullishNumber,
        last_detected_filter: Schemas.NullishString,
        first_detected_no_forced_phot_mjd: Schemas.NullishNumber,
        first_detected_no_forced_phot_mag: Schemas.NullishNumber,
        first_detected_no_forced_phot_filter: Schemas.NullishString,
        last_detected_no_forced_phot_mjd: Schemas.NullishNumber,
        last_detected_no_forced_phot_mag: Schemas.NullishNumber,
        last_detected_no_forced_phot_filter: Schemas.NullishString,
        recent_obs_mjd: Schemas.NullishNumber,
        predetection_mjds: Schemas.nullish(v.array(v.number())),
        last_non_detection_mjd: Schemas.NullishNumber,
        time_to_non_detection: Schemas.NullishNumber,
        mean_mag_global: Schemas.NullishNumber,
        mean_mag_per_filter: Schemas.nullish(Schemas.JsonObject),
        mean_color: Schemas.nullish(Schemas.JsonObject),
        peak_mjd_global: Schemas.NullishNumber,
        peak_mjd_per_filter: Schemas.nullish(Schemas.JsonObject),
        peak_mag_global: Schemas.NullishNumber,
        peak_mag_per_filter: Schemas.nullish(Schemas.JsonObject),
        faintest_mag_global: Schemas.NullishNumber,
        faintest_mag_per_filter: Schemas.nullish(Schemas.JsonObject),
        deepest_limit_global: Schemas.NullishNumber,
        deepest_limit_per_filter: Schemas.nullish(Schemas.JsonObject),
        rise_rate: Schemas.NullishNumber,
        decay_rate: Schemas.NullishNumber,
        mag_rms_global: Schemas.NullishNumber,
        mag_rms_per_filter: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotStat = v.InferOutput<typeof PhotStat>;

/**
 * A SkyPortal source (upstream `Obj`).
 *
 * @since 1.0.0
 * @category Models
 */
export const Source = Schemas.model(
    v.strictObject({
        // -- Mapper columns of `Obj` --------------------------------------------
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
        /** `Obj.to_dict` strips this; the source handlers add it back by hand. */
        internal_key: Schemas.NullishString,

        // -- Values the handlers compute and inject ------------------------------
        gal_lat: Schemas.NullishNumber,
        gal_lon: Schemas.NullishNumber,
        luminosity_distance: Schemas.NullishNumber,
        dm: Schemas.NullishNumber,
        angular_diameter_distance: Schemas.NullishNumber,
        ebv: Schemas.NullishNumber,
        first_detected: Schemas.NullishTimestamp,
        last_detected: Schemas.NullishTimestamp,
        host_offset: Schemas.NullishNumber,
        host_distance: Schemas.NullishNumber,
        /** `period_exists` on a single source, `period` in a sources listing. */
        period_exists: Schemas.NullishBoolean,
        period: Schemas.NullishBoolean,
        photometry_exists: Schemas.NullishBoolean,
        spectrum_exists: Schemas.NullishBoolean,
        comment_exists: Schemas.NullishBoolean,
        /** Names of galaxies within 10 arcsec; null for moving objects. */
        galaxies: Schemas.nullish(v.array(v.string())),
        duplicates: Schemas.list(SourceDuplicate),
        associated_objs: Schemas.list(SourceAssociatedObj),
        color_magnitude: Schemas.list(SourceColorMag),
        gcn_notes: Schemas.list(SourceGcnNote),
        tags: Schemas.list(Tags.ObjTag),

        // -- Nested records ------------------------------------------------------
        groups: Schemas.list(SourceSavedGroup),
        thumbnails: Schemas.list(Thumbnails.Thumbnail),
        photstats: Schemas.list(PhotStat),
        annotations: Schemas.list(SourceAnnotation),
        classifications: Schemas.list(Classifications.Classification),
        comments: Schemas.list(Comments.Comment),
        photometry: Schemas.list(Photometry.PhotometryPoint),
        host: Schemas.nullish(Galaxies.Galaxy),
        followup_requests: Schemas.list(SourceFollowupRequest),
        assignments: Schemas.list(Assignments.Assignment),
        analyses: Schemas.list(Analysis.ObjAnalysis),
        candidates: Schemas.list(SourceCandidate),
        /**
         * `GcnEvent` rows with an added `dateobs_mjd`; left free-form because
         * `GcnEvents` cannot import `Sources` without a cycle.
         */
        gcn_crossmatch: Schemas.list(Schemas.JsonObject),
        /** Users on a single source, `SourceLabel` rows in a sources listing. */
        labellers: Schemas.list(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Source = v.InferOutput<typeof Source>;

/**
 * One page of results from a sources query.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourcesPage = Schemas.model(
    v.strictObject({
        sources: v.array(Source),
        totalMatches: Schemas.Integer,
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
        /** Echoed back when exactly one group was queried for. */
        group_id: Schemas.NullishInteger,
        /** Returned when `useCache` is set; pass it back to replay the query. */
        queryID: Schemas.NullishString,
        geojson: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourcesPage = v.InferOutput<typeof SourcesPage>;

/**
 * A row of the save-summary form of the sources query.
 *
 * The upstream `Source` join-table record between an object and the group it
 * is saved to, rather than the object itself.
 *
 * @since 1.0.0
 * @category Models
 */
export const SavedSource = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: v.string(),
        group_id: Schemas.NullishInteger,
        saved_by_id: Schemas.NullishInteger,
        saved_at: Schemas.NullishTimestamp,
        active: Schemas.NullishBoolean,
        requested: Schemas.NullishBoolean,
        unsaved_by_id: Schemas.NullishInteger,
        unsaved_at: Schemas.NullishTimestamp,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SavedSource = v.InferOutput<typeof SavedSource>;

/**
 * One page of results from a save-summary sources query.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourcesSaveSummaryPage = Schemas.model(
    v.strictObject({
        sources: Schemas.list(SavedSource),
        totalMatches: Schemas.NullishInteger,
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
        group_id: Schemas.NullishInteger,
        queryID: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourcesSaveSummaryPage = v.InferOutput<typeof SourcesSaveSummaryPage>;

/**
 * Payload for saving a new source (upstream `ObjPost`).
 *
 * `ra` and `dec` are required for an object that does not exist yet; for one
 * that does, any field given is applied as an update. If `group_ids` is
 * omitted, the server saves the source to all of the token's groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SourcePost {
    readonly id: string;
    readonly ra?: number | undefined;
    readonly dec?: number | undefined;
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
    readonly summary_history?: ReadonlyArray<Record<string, unknown>> | undefined;
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
    readonly group_ids?: ReadonlyArray<number> | undefined;
    readonly refresh_source?: boolean | undefined;
    readonly ignore_if_in_group_ids?: Record<string, ReadonlyArray<number>> | undefined;
    readonly saver_per_group_id?: Record<string, number> | undefined;
}

/**
 * Result of saving a new source.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourcePostResponse = Schemas.model(
    v.strictObject({
        id: v.string(),
        saved_to_groups: Schemas.list(Schemas.Integer),
        warnings: Schemas.list(v.string()),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourcePostResponse = v.InferOutput<typeof SourcePostResponse>;

/**
 * One line of an offset-star starlist.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceOffsetStar = Schemas.model(
    v.strictObject({
        str: v.string(),
        name: Schemas.NullishString,
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        dras: Schemas.NullishString,
        ddecs: Schemas.NullishString,
        mag: Schemas.NullishNumber,
        pa: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceOffsetStar = v.InferOutput<typeof SourceOffsetStar>;

/**
 * Offset stars for a source, in a facility's starlist format.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceOffsets = Schemas.model(
    v.strictObject({
        facility: Schemas.NullishString,
        starlist_str: Schemas.NullishString,
        starlist_info: Schemas.list(SourceOffsetStar),
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        noffsets: Schemas.NullishInteger,
        queries_issued: Schemas.NullishInteger,
        query: Schemas.NullishString,
        used_ztfref: Schemas.NullishBoolean,
        gaia_available: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceOffsets = v.InferOutput<typeof SourceOffsets>;

/**
 * Default offset-star parameters for one finding-chart facility.
 *
 * @since 1.0.0
 * @category Models
 */
export const FinderChartFacility = Schemas.model(
    v.strictObject({
        radius_degrees: Schemas.NullishNumber,
        mag_limit: Schemas.NullishNumber,
        mag_min: Schemas.NullishNumber,
        min_sep_arcsec: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type FinderChartFacility = v.InferOutput<typeof FinderChartFacility>;

/**
 * A finding chart returned as JSON rather than as a file.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceFinderChart = Schemas.model(
    v.strictObject({
        finding_chart: v.string(),
        starlist: Schemas.list(SourceOffsetStar),
        public_url: Schemas.NullishString,
        public_url_expires_at: Schemas.NullishTimestamp,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceFinderChart = v.InferOutput<typeof SourceFinderChart>;

/**
 * Payload for crossmatching a source against GCN events.
 *
 * `startDate` and `endDate` are required and must be within 31 days of each
 * other.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SourceGcnEventCrossmatchPost {
    readonly startDate: string;
    readonly endDate: string;
    readonly probability?: number | undefined;
    readonly beforeFirstDetection?: boolean | undefined;
    readonly gcnTagKeep?: ReadonlyArray<string> | undefined;
    readonly gcnTagRemove?: ReadonlyArray<string> | undefined;
    readonly localizationTagKeep?: ReadonlyArray<string> | undefined;
    readonly localizationTagRemove?: ReadonlyArray<string> | undefined;
    readonly gcnPropertiesFilter?: ReadonlyArray<string> | undefined;
    readonly localizationPropertiesFilter?: ReadonlyArray<string> | undefined;
}

/**
 * Payload for a Minor Planet Center crossmatch.
 *
 * The server defaults to observatory code `"500"` (geocentric), the current
 * time, a limiting magnitude of 24.0, and a search radius of 1 arcmin.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SourceMpcQueryPost {
    readonly obscode?: string | undefined;
    readonly date?: string | undefined;
    readonly limiting_magnitude?: number | undefined;
    readonly search_radius?: number | undefined;
}

/**
 * Payload for sending a source notification.
 *
 * `level` is `"soft"` to send an email, `"hard"` to send an email and an SMS.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SourceNotificationPost {
    readonly sourceId: string;
    readonly groupIds: ReadonlyArray<number>;
    readonly level: "soft" | "hard";
    readonly additionalNotes?: string | undefined;
}

/**
 * Result of sending a source notification.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceNotificationPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceNotificationPostResponse = v.InferOutput<
    typeof SourceNotificationPostResponse
>;

/**
 * Whether a source already exists by name or by position.
 *
 * @since 1.0.0
 * @category Models
 */
export const SourceExists = Schemas.model(
    v.strictObject({
        source_exists: v.boolean(),
        message: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SourceExists = v.InferOutput<typeof SourceExists>;

/**
 * Counts of objects with and without photometry statistics.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotStatCounts = Schemas.model(
    v.strictObject({
        totalWithPhotStats: Schemas.Integer,
        totalWithoutPhotStats: Schemas.Integer,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotStatCounts = v.InferOutput<typeof PhotStatCounts>;

/**
 * Pagination summary of a batch photometry-statistics update.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotStatsBatch = Schemas.model(
    v.strictObject({
        totalMatches: Schemas.Integer,
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 100),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotStatsBatch = v.InferOutput<typeof PhotStatsBatch>;

/**
 * A photometry-statistics field that can be plotted.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotStatAggregateField = Schemas.model(
    v.strictObject({
        value: v.string(),
        label: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotStatAggregateField = v.InferOutput<typeof PhotStatAggregateField>;

/**
 * One source's photometry statistics, ready for plotting.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotStatAggregatePoint = Schemas.model(
    v.strictObject({
        id: v.string(),
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        redshift: Schemas.NullishNumber,
        classification: Schemas.NullishString,
        first_detected_mjd: Schemas.NullishNumber,
        peak_mjd: Schemas.NullishNumber,
        tns_discovery_date: Schemas.NullishString,
        x: Schemas.NullishNumber,
        y: Schemas.NullishNumber,
        z: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotStatAggregatePoint = v.InferOutput<typeof PhotStatAggregatePoint>;

/**
 * Bulk photometry statistics across many sources.
 *
 * @since 1.0.0
 * @category Models
 */
export const PhotStatAggregate = Schemas.model(
    v.strictObject({
        fields: Schemas.list(PhotStatAggregateField),
        points: Schemas.list(PhotStatAggregatePoint),
        count: v.optional(Schemas.Integer, 0),
        truncated: v.optional(v.boolean(), false),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PhotStatAggregate = v.InferOutput<typeof PhotStatAggregate>;
