/**
 * Request and response models for `/api/moving_object`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * Payload for scheduling follow-up of a moving object.
 *
 * `start_time` and `end_time` are ISO-format datetimes less than 7 days apart.
 * `primary_only` restricts the search to the instrument's primary field grid
 * (server default true), and `airmass_limit`, `moon_distance_limit` and
 * `sun_altitude_limit` default server-side to 2.5, 30 degrees and -18 degrees
 * respectively.
 *
 * @since 1.0.0
 * @category Models
 */
export interface MovingObjectFollowupPost {
    readonly instrument_id: number;
    readonly exposure_count: number;
    readonly exposure_time: number;
    readonly start_time: string;
    readonly end_time: string;
    readonly filter: string;
    readonly primary_only?: boolean | undefined;
    readonly airmass_limit?: number | undefined;
    readonly moon_distance_limit?: number | undefined;
    readonly sun_altitude_limit?: number | undefined;
    readonly references_only?: boolean | undefined;
}

/**
 * A scheduled exposure from `find_observable_sequence`.
 *
 * This is not a database model: the handler returns the plain dicts built by
 * `skyportal.utils.moving_objects.find_observable_sequence`, nothing is
 * persisted, and the keys below are the complete set.
 *
 * @since 1.0.0
 * @category Models
 */
export const MovingObjectObservation = Schemas.model(
    v.strictObject({
        start_time: Schemas.NullishTimestamp,
        end_time: Schemas.NullishTimestamp,
        band: Schemas.NullishString,
        field_id: Schemas.NullishInteger,
        airmass: Schemas.NullishNumber,
        sun_altitude: Schemas.NullishNumber,
        moon_distance: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type MovingObjectObservation = v.InferOutput<typeof MovingObjectObservation>;
