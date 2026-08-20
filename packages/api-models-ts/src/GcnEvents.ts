/**
 * Request and response models for `/api/gcn_event`.
 *
 * Every model below whose upstream row hangs off a `GcnEvent` keeps its
 * `gcnevent` back-reference free-form: {@link GcnEvent} already types the
 * forward direction, so typing the reverse one too would make the models
 * mutually recursive.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Allocations from "./Allocations.ts";
import * as Comments from "./Comments.ts";
import * as Filters from "./Filters.ts";
import * as Groups from "./Groups.ts";
import * as Localizations from "./Localizations.ts";
import * as MmaDetectors from "./MmaDetectors.ts";
import * as ObservationPlans from "./ObservationPlans.ts";
import * as Reminders from "./Reminders.ts";
import * as Schemas from "./Schemas.ts";
import * as Sources from "./Sources.ts";
import * as SurveyEfficiency from "./SurveyEfficiency.ts";
import * as Users from "./Users.ts";

/**
 * A GCN notice attached to an event (upstream `GcnNotice`).
 *
 * `content` is the raw notice body (XML, JSON or plain text): a `LargeBinary`
 * column the server decodes to a string. It is deferred, so it is absent
 * unless the handler undefers it, and the single-event endpoint drops it when
 * `excludeNoticeContent` is set.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnNotice = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        ivorn: Schemas.NullishString,
        notice_type: Schemas.NullishString,
        notice_format: Schemas.NullishString,
        stream: Schemas.NullishString,
        date: Schemas.NullishTimestamp,
        content: Schemas.nullish(Schemas.Json),
        has_localization: Schemas.NullishBoolean,
        localization_ingested: Schemas.NullishBoolean,
        sent_by: Schemas.nullish(Users.User),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnNotice = v.InferOutput<typeof GcnNotice>;

/**
 * Properties parsed from an event notice (upstream `GcnProperty`).
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnProperty = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        data: Schemas.nullish(Schemas.JsonObject),
        sent_by: Schemas.nullish(Users.User),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnProperty = v.InferOutput<typeof GcnProperty>;

/**
 * A qualitative tag on a GCN event (upstream `GcnTag`).
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnTag = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        text: Schemas.NullishString,
        sent_by: Schemas.nullish(Users.User),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnTag = v.InferOutput<typeof GcnTag>;

/**
 * A human-readable summary of a GCN event (upstream `GcnSummary`).
 *
 * `text` is deferred server-side and is undeferred by the single-summary
 * endpoint; it reads `"pending"` until the background writer fills it in.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnSummary = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        group_id: Schemas.NullishInteger,
        title: Schemas.NullishString,
        text: Schemas.NullishString,
        sent_by: Schemas.nullish(Users.User),
        group: Schemas.nullish(Groups.Group),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnSummary = v.InferOutput<typeof GcnSummary>;

/**
 * A structured (publishable) report on a GCN event (upstream `GcnReport`).
 *
 * `data` is a deferred JSONB column, undeferred by the single-report endpoint.
 * It holds `{ status: "pending" }` while the report is being assembled and a
 * JSON *string* once the background writer has stored the rendered report, so
 * both forms are accepted.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnReport = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        group_id: Schemas.NullishInteger,
        report_name: Schemas.NullishString,
        data: Schemas.nullish(v.union([Schemas.JsonObject, v.string()])),
        published: Schemas.NullishBoolean,
        sent_by: Schemas.nullish(Users.User),
        group: Schemas.nullish(Groups.Group),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnReport = v.InferOutput<typeof GcnReport>;

/**
 * Whether a GCN event triggered an allocation (upstream `GcnTrigger`).
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnTrigger = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        dateobs: Schemas.NullishTimestamp,
        allocation_id: Schemas.NullishInteger,
        triggered: Schemas.NullishBoolean,
        allocation: Schemas.nullish(Allocations.Allocation),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnTrigger = v.InferOutput<typeof GcnTrigger>;

/**
 * A user advocating for a GCN event (upstream `GcnEventUser`).
 *
 * `username`, `first_name` and `last_name` are copied off the joined user by
 * the single-event endpoint, which returns these rows as `event_users`.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventUser = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        gcnevent_id: Schemas.NullishInteger,
        user_id: Schemas.NullishInteger,
        username: Schemas.NullishString,
        first_name: Schemas.NullishString,
        last_name: Schemas.NullishString,
        user: Schemas.nullish(Users.User),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventUser = v.InferOutput<typeof GcnEventUser>;

/**
 * A localization as returned inside a GCN event payload.
 *
 * The single-event endpoint replaces the localization's `tags` and
 * `properties` with explicitly serialized lists and adds `center`; the
 * paginated endpoint returns `tags` only.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventLocalization = Schemas.model(
    v.strictObject({
        ...Localizations.LocalizationEntries,
        tags: Schemas.nullish(v.array(Localizations.LocalizationTag)),
        properties: Schemas.nullish(v.array(Localizations.LocalizationProperty)),
        center: Schemas.nullish(Localizations.LocalizationCenter),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventLocalization = v.InferOutput<typeof GcnEventLocalization>;

/**
 * Alert-crossmatch progress for one event, filter and localization.
 *
 * Upstream `GcnEventCrossmatchState`. `status` is one of `"pending"`,
 * `"processing"`, `"done"` or `"failed"`, but the column is a plain string, so
 * it is not narrowed here.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventCrossmatchState = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        gcnevent_id: Schemas.NullishInteger,
        filter_id: Schemas.NullishInteger,
        localization_id: Schemas.NullishInteger,
        last_queried: Schemas.NullishTimestamp,
        last_alert_jd: Schemas.NullishNumber,
        status: Schemas.NullishString,
        error: Schemas.NullishString,
        archival_done: Schemas.NullishBoolean,
        n_matches: Schemas.NullishInteger,
        gcnevent: Schemas.nullish(Schemas.JsonObject),
        filter: Schemas.nullish(Filters.Filter),
        localization: Schemas.nullish(Localizations.Localization),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventCrossmatchState = v.InferOutput<typeof GcnEventCrossmatchState>;

/**
 * A catalog query submitted for a GCN event (upstream `CatalogQuery`).
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnCatalogQuery = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        requester_id: Schemas.NullishInteger,
        allocation_id: Schemas.NullishInteger,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        status: Schemas.NullishString,
        requester: Schemas.nullish(Users.User),
        allocation: Schemas.nullish(Allocations.Allocation),
        target_groups: Schemas.nullish(v.array(Groups.Group)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnCatalogQuery = v.InferOutput<typeof GcnCatalogQuery>;

/**
 * A GCN event, keyed by its UTC observation time (upstream `GcnEvent`).
 *
 * `tags` (the distinct texts of the event's `GcnTag` rows) and `lightcurve` (a
 * URL parsed out of the first notice) are properties the handlers inject
 * rather than columns; the underlying `_tags` relationship is never
 * serialized. `circulars`, `gracedb_log` and `gracedb_labels` are deferred, so
 * they only appear when a handler undefers them. `event_users_ids` is a column
 * property aggregating `gcnevent_users`, and `event_users` is the same join
 * rows with the user's name copied in.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEvent = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        trigger_id: Schemas.NullishString,
        aliases: Schemas.nullish(v.array(v.string())),
        tach_id: Schemas.NullishString,
        circulars: Schemas.nullish(v.record(v.string(), v.string())),
        gracedb_log: Schemas.nullish(Schemas.JsonObject),
        gracedb_labels: Schemas.nullish(Schemas.JsonObject),
        lightcurve: Schemas.NullishString,
        event_users_ids: Schemas.nullish(v.array(Schemas.Integer)),
        tags: Schemas.nullish(v.array(v.string())),
        localizations: Schemas.nullish(v.array(GcnEventLocalization)),
        gcn_notices: Schemas.nullish(v.array(GcnNotice)),
        properties: Schemas.nullish(v.array(GcnProperty)),
        summaries: Schemas.nullish(v.array(GcnSummary)),
        reports: Schemas.nullish(v.array(GcnReport)),
        comments: Schemas.nullish(v.array(Comments.Comment)),
        reminders: Schemas.nullish(v.array(Reminders.Reminder)),
        detectors: Schemas.nullish(v.array(MmaDetectors.MmaDetector)),
        gcn_triggers: Schemas.nullish(v.array(GcnTrigger)),
        event_users: Schemas.nullish(v.array(GcnEventUser)),
        gcnevent_users: Schemas.nullish(v.array(GcnEventUser)),
        users: Schemas.nullish(v.array(Users.User)),
        groups: Schemas.nullish(v.array(Groups.Group)),
        sent_by: Schemas.nullish(Users.User),
        observationplan_requests: Schemas.nullish(v.array(ObservationPlans.ObservationPlanRequest)),
        survey_efficiency_analyses: Schemas.nullish(v.array(SurveyEfficiency.SurveyEfficiencyForObservations)),
        crossmatch_states: Schemas.nullish(v.array(GcnEventCrossmatchState)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEvent = v.InferOutput<typeof GcnEvent>;

/**
 * One page of results from a GCN events query.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventsPage = Schemas.model(
    v.strictObject({
        events: Schemas.list(GcnEvent),
        totalMatches: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventsPage = v.InferOutput<typeof GcnEventsPage>;

/**
 * Payload for ingesting a GCN event.
 *
 * Provide `xml` (a VOEvent) or `json` (a GCN JSON notice); otherwise
 * `dateobs` is required and the remaining fields describe the event. `skymap`
 * accepts a multi-order map, a base64 FITS blob, a URL, or a
 * cone/ellipse/polygon description.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GcnEventPost {
    readonly xml?: string | undefined;
    readonly json?: Record<string, unknown> | undefined;
    readonly dateobs?: string | undefined;
    readonly trigger_id?: string | undefined;
    readonly aliases?: ReadonlyArray<string> | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
    readonly properties?: Record<string, unknown> | undefined;
    readonly tags?: ReadonlyArray<string> | undefined;
    readonly skymap?: unknown;
}

/**
 * Result of ingesting a GCN event.
 *
 * `notice_id` is null for the dictionary form.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventPostResponse = Schemas.model(
    v.strictObject({
        gcnevent_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishString,
        notice_id: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventPostResponse = v.InferOutput<typeof GcnEventPostResponse>;

/**
 * A response carrying only the ID of the affected GCN event.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventIdResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventIdResponse = v.InferOutput<typeof GcnEventIdResponse>;

/**
 * Result of tagging a GCN event.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventTagPostResponse = Schemas.model(v.strictObject({ gcntag_id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventTagPostResponse = v.InferOutput<typeof GcnEventTagPostResponse>;

/**
 * The TACH identifiers, aliases and circulars of a GCN event.
 *
 * `circulars` maps GCN circular ID to that circular's subject line.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventTachInfo = Schemas.model(
    v.strictObject({
        tach_id: Schemas.NullishString,
        aliases: Schemas.nullish(v.array(v.string())),
        circulars: Schemas.nullish(v.record(v.string(), v.string())),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventTachInfo = v.InferOutput<typeof GcnEventTachInfo>;

/**
 * Result of requeueing the alert crossmatch of a GCN event.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventCrossmatchRequeue = Schemas.model(
    v.strictObject({
        filters_requeued: Schemas.Integer,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventCrossmatchRequeue = v.InferOutput<typeof GcnEventCrossmatchRequeue>;

/**
 * Instrument field probabilities for a GCN event localization.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventInstrumentFields = Schemas.model(
    v.strictObject({
        field_ids: Schemas.list(Schemas.Integer),
        probabilities: Schemas.list(v.number()),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventInstrumentFields = v.InferOutput<typeof GcnEventInstrumentFields>;

/**
 * Payload for generating a GCN event summary.
 *
 * `localizationCumprob` defaults to 0.95, `numberDetections` to 2,
 * `numberObservations` to 1 and `statsMethod` to `"python"` (`"db"` is the
 * alternative).
 *
 * @since 1.0.0
 * @category Models
 */
export interface GcnSummaryPost {
    readonly title: string;
    readonly groupId: number;
    readonly number?: number | undefined;
    readonly subject?: string | undefined;
    readonly userIds?: ReadonlyArray<number> | undefined;
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    readonly localizationName?: string | undefined;
    readonly localizationCumprob?: number | undefined;
    readonly numberDetections?: number | undefined;
    readonly numberObservations?: number | undefined;
    readonly showSources?: boolean | undefined;
    readonly showGalaxies?: boolean | undefined;
    readonly showObservations?: boolean | undefined;
    readonly noText?: boolean | undefined;
    readonly photometryInWindow?: boolean | undefined;
    readonly statsMethod?: string | undefined;
    readonly instrumentIds?: ReadonlyArray<number> | undefined;
    readonly acknowledgements?: string | undefined;
}

/**
 * Payload for generating a GCN event report.
 *
 * `localizationCumprob` defaults to 0.95, `numberDetections` to 2 and
 * `statsMethod` to `"python"` (`"db"` is the alternative).
 *
 * @since 1.0.0
 * @category Models
 */
export interface GcnReportPost {
    readonly reportName: string;
    readonly groupId: number;
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    readonly localizationName?: string | undefined;
    readonly localizationCumprob?: number | undefined;
    readonly numberDetections?: number | undefined;
    readonly showSources?: boolean | undefined;
    readonly showObservations?: boolean | undefined;
    readonly showSurveyEfficiencies?: boolean | undefined;
    readonly photometryInWindow?: boolean | undefined;
    readonly statsMethod?: string | undefined;
    readonly instrumentIds?: ReadonlyArray<number> | undefined;
}

/**
 * A rule that automatically tags matching GCN events.
 *
 * Upstream `DefaultGcnTag`. `filters` is free-form JSON; the ingester reads
 * the keys `gcn_tags`, `notice_types` and `localization_tags`.
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultGcnTag = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        requester_id: Schemas.NullishInteger,
        default_tag_name: Schemas.NullishString,
        filters: Schemas.nullish(Schemas.JsonObject),
        requester: Schemas.nullish(Users.User),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultGcnTag = v.InferOutput<typeof DefaultGcnTag>;

/**
 * Payload for creating a default GCN tag.
 *
 * `default_tag_name` must be unique. `filters` accepts the keys `gcn_tags`,
 * `notice_types` and `localization_tags`, each a list of strings.
 *
 * @since 1.0.0
 * @category Models
 */
export interface DefaultGcnTagPost {
    readonly default_tag_name: string;
    readonly filters?: Record<string, unknown> | undefined;
}

/**
 * How an object stands against a GCN event.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventObjStatus = v.picklist(["pending", "confirmed", "ambiguous", "rejected"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventObjStatus = v.InferOutput<typeof GcnEventObjStatus>;

/**
 * An object's standing against a GCN event (upstream `GcnEventObj`).
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventObj = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        dateobs: Schemas.NullishTimestamp,
        status: Schemas.nullish(GcnEventObjStatus),
        confirmer_id: Schemas.NullishInteger,
        explanation: Schemas.NullishString,
        notes: Schemas.NullishString,
        obj: Schemas.nullish(Sources.Source),
        confirmer: Schemas.nullish(Users.User),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventObj = v.InferOutput<typeof GcnEventObj>;

/**
 * Payload for recording an object's standing against a GCN event.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GcnEventObjPost {
    readonly source_id: string;
    readonly status: GcnEventObjStatus;
    readonly localization_name: string;
    readonly localization_cumprob: number;
    readonly start_date: string;
    readonly end_date: string;
    readonly explanation?: string | undefined;
    readonly notes?: string | undefined;
}

/**
 * Result of creating, updating or deleting a source-in-GCN record.
 *
 * @since 1.0.0
 * @category Models
 */
export const GcnEventObjIdResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type GcnEventObjIdResponse = v.InferOutput<typeof GcnEventObjIdResponse>;

/**
 * Payload for crossmatching an object against GCN events.
 *
 * `probability` is the integrated probability contour to search within,
 * defaulting to 0.95.
 *
 * @since 1.0.0
 * @category Models
 */
export interface GcnEventObjCrossmatchPost {
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
