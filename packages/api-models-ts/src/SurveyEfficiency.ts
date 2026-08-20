/**
 * Request and response models for `/api/survey_efficiency`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Instruments from "./Instruments.ts";
import * as Localizations from "./Localizations.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * An efficiency analysis (upstream `SurveyEfficiencyForObservations`).
 *
 * `gcnevent` stays free-form because {@link skyportal-js/GcnEvents} already
 * imports {@link skyportal-js/ObservationPlans}, which this module imports, so
 * typing it would risk an import cycle.
 *
 * `number_of_transients`, `number_in_covered`, `number_detected` and
 * `efficiency` are Python properties derived from `lightcurves`, not columns:
 * the `/api/survey_efficiency` handlers omit them, while the GCN event and
 * observation plan handlers add them to the serialized row.
 *
 * @since 1.0.0
 * @category Models
 */
export const SurveyEfficiencyForObservations = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        status: Schemas.NullishString,
        lightcurves: Schemas.NullishString,
        requester_id: Schemas.NullishInteger,
        gcnevent_id: Schemas.NullishInteger,
        localization_id: Schemas.NullishInteger,
        instrument_id: Schemas.NullishInteger,
        number_of_transients: Schemas.NullishInteger,
        number_in_covered: Schemas.NullishInteger,
        number_detected: Schemas.NullishInteger,
        efficiency: Schemas.NullishNumber,
        requester: Schemas.nullish(Users.User),
        groups: Schemas.list(Groups.Group),
        gcnevent: Schemas.nullish(Schemas.JsonObject),
        localization: Schemas.nullish(Localizations.Localization),
        instrument: Schemas.nullish(Instruments.Instrument),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SurveyEfficiencyForObservations = v.InferOutput<typeof SurveyEfficiencyForObservations>;

/**
 * An efficiency analysis (upstream `SurveyEfficiencyForObservationPlan`).
 *
 * As above, the four count/efficiency keys are properties injected by the
 * observation plan handler rather than mapper columns.
 *
 * @since 1.0.0
 * @category Models
 */
export const SurveyEfficiencyForObservationPlan = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        status: Schemas.NullishString,
        lightcurves: Schemas.NullishString,
        requester_id: Schemas.NullishInteger,
        observation_plan_id: Schemas.NullishInteger,
        number_of_transients: Schemas.NullishInteger,
        number_in_covered: Schemas.NullishInteger,
        number_detected: Schemas.NullishInteger,
        efficiency: Schemas.NullishNumber,
        requester: Schemas.nullish(Users.User),
        groups: Schemas.list(Groups.Group),
        /**
         * Stays free-form: this module is the canonical home of the
         * survey-efficiency models, and `ObservationPlans` imports it.
         */
        observation_plan: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SurveyEfficiencyForObservationPlan = v.InferOutput<typeof SurveyEfficiencyForObservationPlan>;

/**
 * A default efficiency request (upstream `DefaultSurveyEfficiencyRequest`).
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultSurveyEfficiencyRequest = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        payload: v.optional(Schemas.JsonObject, () => ({})),
        default_observationplan_request_id: Schemas.NullishInteger,
        default_observationplan_request: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultSurveyEfficiencyRequest = v.InferOutput<typeof DefaultSurveyEfficiencyRequest>;

/**
 * Result of creating a default survey efficiency request.
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultSurveyEfficiencyPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultSurveyEfficiencyPostResponse = v.InferOutput<typeof DefaultSurveyEfficiencyPostResponse>;
