/**
 * Request and response models for `/api/observation_plan`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Allocations from "./Allocations.ts";
import * as FollowupRequests from "./FollowupRequests.ts";
import * as Groups from "./Groups.ts";
import * as Instruments from "./Instruments.ts";
import * as Localizations from "./Localizations.ts";
import * as Schemas from "./Schemas.ts";
import * as SurveyEfficiency from "./SurveyEfficiency.ts";
import * as Users from "./Users.ts";

/**
 * Statistics for one plan (upstream `EventObservationPlanStatistics`).
 *
 * @since 1.0.0
 * @category Models
 */
export const EventObservationPlanStatistics = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        observation_plan_id: Schemas.NullishInteger,
        localization_id: Schemas.NullishInteger,
        statistics: v.optional(Schemas.JsonObject, () => ({})),
        observation_plan: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EventObservationPlanStatistics = v.InferOutput<typeof EventObservationPlanStatistics>;

/**
 * A planned exposure (upstream `PlannedObservation`).
 *
 * The single-plan handler renames the `field_id` foreign key to `field_db_id`
 * and puts the instrument's own field number in `field_id`, then adds
 * `rise_time`/`set_time` (empty strings when the field never rises or sets
 * that night).
 *
 * @since 1.0.0
 * @category Models
 */
export const PlannedObservation = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        observation_plan_id: Schemas.NullishInteger,
        instrument_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        field_id: Schemas.NullishInteger,
        field_db_id: Schemas.NullishInteger,
        exposure_time: Schemas.NullishInteger,
        weight: Schemas.NullishNumber,
        filt: Schemas.NullishString,
        obstime: Schemas.NullishTimestamp,
        overhead_per_exposure: Schemas.NullishInteger,
        planned_observation_id: Schemas.NullishInteger,
        rise_time: Schemas.NullishString,
        set_time: Schemas.NullishString,
        field: Schemas.nullish(Instruments.InstrumentField),
        instrument: Schemas.nullish(Instruments.Instrument),
        observation_plan: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PlannedObservation = v.InferOutput<typeof PlannedObservation>;

/**
 * A generated observation plan (upstream `EventObservationPlan`).
 *
 * @since 1.0.0
 * @category Models
 */
export const EventObservationPlan = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        observation_plan_request_id: Schemas.NullishInteger,
        instrument_id: Schemas.NullishInteger,
        dateobs: Schemas.NullishTimestamp,
        plan_name: Schemas.NullishString,
        validity_window_start: Schemas.NullishTimestamp,
        validity_window_end: Schemas.NullishTimestamp,
        status: Schemas.NullishString,
        statistics: Schemas.list(EventObservationPlanStatistics),
        planned_observations: Schemas.list(PlannedObservation),
        survey_efficiency_analyses: Schemas.list(SurveyEfficiency.SurveyEfficiencyForObservationPlan),
        instrument: Schemas.nullish(Instruments.Instrument),
        observation_plan_request: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EventObservationPlan = v.InferOutput<typeof EventObservationPlan>;

/**
 * A request for an observation plan (upstream `ObservationPlanRequest`).
 *
 * `gcnevent` stays free-form because {@link skyportal-js/GcnEvents} already
 * imports this module, so typing it would create an import cycle.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationPlanRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        requester_id: Schemas.NullishInteger,
        last_modified_by_id: Schemas.NullishInteger,
        gcnevent_id: Schemas.NullishInteger,
        localization_id: Schemas.NullishInteger,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        status: Schemas.NullishString,
        allocation_id: Schemas.NullishInteger,
        combined_id: Schemas.NullishString,
        default_plan: Schemas.NullishBoolean,
        observation_plans: Schemas.list(EventObservationPlan),
        allocation: Schemas.nullish(Allocations.Allocation),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
        localization: Schemas.nullish(Localizations.Localization),
        requester: Schemas.nullish(Users.User),
        last_modified_by: Schemas.nullish(Users.User),
        target_groups: Schemas.list(Groups.Group),
        transactions: Schemas.list(FollowupRequests.FacilityTransaction),
        transaction_requests: Schemas.list(FollowupRequests.FacilityTransactionRequest),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationPlanRequest = v.InferOutput<typeof ObservationPlanRequest>;

/**
 * One page of results from an observation plan requests query.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationPlanRequestsPage = Schemas.model(
    v.strictObject({
        requests: Schemas.list(ObservationPlanRequest),
        totalMatches: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationPlanRequestsPage = v.InferOutput<typeof ObservationPlanRequestsPage>;

/**
 * One page of observation plan requests under an allocation.
 *
 * @since 1.0.0
 * @category Models
 */
export const AllocationObservationPlansPage = Schemas.model(
    v.strictObject({
        observation_plan_requests: Schemas.list(ObservationPlanRequest),
        totalMatches: v.optional(Schemas.Integer, 0),
        pageNumber: v.optional(Schemas.Integer, 1),
        numPerPage: v.optional(Schemas.Integer, 50),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AllocationObservationPlansPage = v.InferOutput<typeof AllocationObservationPlansPage>;

/**
 * Payload for submitting an observation plan request.
 *
 * `payload` must contain a globally unique `queue_name` key and a `filters`
 * key that is a subset of the allocation instrument's filters; the
 * allocation's instrument API defines the rest of its schema. The plan is
 * generated asynchronously server-side.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ObservationPlanPost {
    readonly gcnevent_id: number;
    readonly allocation_id: number;
    readonly localization_id: number;
    readonly payload: Record<string, unknown>;
    readonly status?: string | undefined;
    readonly target_group_ids?: ReadonlyArray<number> | undefined;
    readonly requester_id?: number | undefined;
}

/**
 * Result of submitting observation plan requests.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationPlanIdsResponse = Schemas.model(
    v.strictObject({
        ids: Schemas.list(Schemas.Integer),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationPlanIdsResponse = v.InferOutput<typeof ObservationPlanIdsResponse>;

/**
 * Payload for submitting a manually-built observation plan.
 *
 * Provide either `gcnevent_id` or `dateobs` to identify the GCN event, and
 * either `localization_id` or `localization_name` to identify the
 * localization. Only the first entry of `observation_plans` is used; it must
 * contain `validity_window_start`, `validity_window_end`, `status` and a
 * `planned_observations` list whose entries each contain `dateobs`,
 * `field_id`, `exposure_time`, `weight`, `filt`, `planned_observation_id` and
 * `overhead_per_exposure`.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ObservationPlanManualPost {
    readonly allocation_id: number;
    readonly plan_name: string;
    readonly status: string;
    readonly payload: Record<string, unknown>;
    readonly observation_plans: ReadonlyArray<Record<string, unknown>>;
    readonly gcnevent_id?: number | undefined;
    readonly dateobs?: string | undefined;
    readonly localization_id?: number | undefined;
    readonly localization_name?: string | undefined;
}

/**
 * Result of submitting a manual observation plan.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationPlanManualPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationPlanManualPostResponse = v.InferOutput<typeof ObservationPlanManualPostResponse>;

/**
 * GeoJSON summary of an observation plan's fields.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationPlanGeoJson = Schemas.model(
    v.strictObject({
        geojson: Schemas.list(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationPlanGeoJson = v.InferOutput<typeof ObservationPlanGeoJson>;

/**
 * Result of starting a simsurvey efficiency analysis.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationPlanSimSurveyResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationPlanSimSurveyResponse = v.InferOutput<typeof ObservationPlanSimSurveyResponse>;

/**
 * Payload for creating a default observation plan request.
 *
 * `default_plan_name` must be unique. `payload` must not contain
 * `start_date`, `end_date` or `queue_name` (the server fills these in per
 * event). `filters` controls which GCN events trigger the plan and is required
 * when `auto_send` is true.
 *
 * @since 1.0.0
 * @category Models
 */
export interface DefaultObservationPlanPost {
    readonly allocation_id: number;
    readonly default_plan_name: string;
    readonly payload: Record<string, unknown>;
    readonly auto_send?: boolean | undefined;
    readonly filters?: Record<string, unknown> | undefined;
    readonly target_group_ids?: ReadonlyArray<number> | undefined;
    readonly requester_id?: number | undefined;
}

/**
 * Result of creating a default observation plan request.
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultObservationPlanPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultObservationPlanPostResponse = v.InferOutput<typeof DefaultObservationPlanPostResponse>;

/**
 * A default efficiency request as nested in a default observation plan
 * (upstream `DefaultSurveyEfficiencyRequest`).
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultSurveyEfficiencyRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        default_observationplan_request_id: Schemas.NullishInteger,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        default_observationplan_request: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultSurveyEfficiencyRequest = v.InferOutput<typeof DefaultSurveyEfficiencyRequest>;

/**
 * A default observation plan (upstream `DefaultObservationPlanRequest`).
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultObservationPlanRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        requester_id: Schemas.NullishInteger,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        filters: Schemas.nullish(Schemas.JsonObject),
        allocation_id: Schemas.NullishInteger,
        default_plan_name: Schemas.NullishString,
        auto_send: Schemas.NullishBoolean,
        allocation: Schemas.nullish(Allocations.Allocation),
        requester: Schemas.nullish(Users.User),
        target_groups: Schemas.list(Groups.Group),
        default_survey_efficiencies: Schemas.list(DefaultSurveyEfficiencyRequest),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultObservationPlanRequest = v.InferOutput<typeof DefaultObservationPlanRequest>;
