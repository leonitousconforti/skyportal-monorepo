/**
 * Request and response models for `/api/observation`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Instruments from "./Instruments.ts";
import * as Schemas from "./Schemas.ts";

/**
 * A survey observation (upstream `ExecutedObservation`/`QueuedObservation`).
 *
 * The endpoint returns either kind depending on `observationStatus`, so the
 * executed-only fields (`observation_id`, `airmass`, `seeing`, `limmag`,
 * `target_name`, `processed_fraction`) and the queued-only ones
 * (`queue_name`, `validity_window_start` and `validity_window_end`) are all
 * optional.
 *
 * @since 1.0.0
 * @category Models
 */
export const Observation = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        instrument_id: Schemas.NullishInteger,
        instrument_field_id: Schemas.NullishInteger,
        observation_id: Schemas.NullishInteger,
        obstime: Schemas.NullishTimestamp,
        filt: Schemas.NullishString,
        exposure_time: Schemas.NullishInteger,
        airmass: Schemas.NullishNumber,
        seeing: Schemas.NullishNumber,
        limmag: Schemas.NullishNumber,
        target_name: Schemas.NullishString,
        processed_fraction: Schemas.NullishNumber,
        queue_name: Schemas.NullishString,
        validity_window_start: Schemas.NullishTimestamp,
        validity_window_end: Schemas.NullishTimestamp,
        field: Schemas.nullish(Instruments.InstrumentField),
        instrument: Schemas.nullish(Instruments.Instrument),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Observation = v.InferOutput<typeof Observation>;

/**
 * One page of results from an observations query.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationsPage = Schemas.model(
    v.strictObject({
        observations: Schemas.list(Observation),
        totalMatches: v.optional(Schemas.Integer, 0),
        probability: Schemas.NullishNumber,
        area: Schemas.NullishNumber,
        geojson: Schemas.nullish(v.array(Schemas.JsonObject)),
        field_ids: Schemas.nullish(v.array(Schemas.Integer)),
        min_observations_per_field: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationsPage = v.InferOutput<typeof ObservationsPage>;

/**
 * Payload for ingesting a set of executed observations.
 *
 * `observationData` maps column names to equal-length lists and must include
 * `observation_id`, `field_id` (or `RA` and `Dec`), `obstime`, `filter`, and
 * `exposure_time`.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ObservationPost {
    readonly telescopeName: string;
    readonly instrumentName: string;
    readonly observationData: Record<string, ReadonlyArray<unknown>>;
}

/**
 * Result of starting a SimSurvey efficiency calculation.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationSimSurveyResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationSimSurveyResponse = v.InferOutput<typeof ObservationSimSurveyResponse>;

/**
 * Queue names retrieved from an instrument's external API.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservationQueues = Schemas.model(
    v.strictObject({
        queue_names: Schemas.list(v.string()),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservationQueues = v.InferOutput<typeof ObservationQueues>;
