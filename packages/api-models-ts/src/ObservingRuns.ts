/**
 * Request and response models for `/api/observing_run`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Assignments from "./Assignments.ts";
import * as Groups from "./Groups.ts";
import * as Instruments from "./Instruments.ts";
import * as Schemas from "./Schemas.ts";
import * as Telescopes from "./Telescopes.ts";
import * as Users from "./Users.ts";

/**
 * A classical observing run (upstream `ObservingRun`).
 *
 * `sources` stays free-form because typing its entries as
 * {@link skyportal-js/Sources!Source} would create an import cycle. The list
 * endpoint returns `to_dict()` output (columns plus the eager-loaded
 * `instrument`); the single-run endpoint returns a hand-built dict that swaps
 * `created_at`/`modified`/`run_end_utc` for `ephemeris` and the run's
 * `assignments`.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservingRun = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        instrument_id: Schemas.NullishInteger,
        calendar_date: Schemas.NullishString,
        run_end_utc: Schemas.NullishTimestamp,
        pi: Schemas.NullishString,
        observers: Schemas.NullishString,
        duration: Schemas.NullishInteger,
        group_id: Schemas.NullishInteger,
        owner_id: Schemas.NullishInteger,
        ephemeris: Schemas.nullish(Telescopes.Ephemeris),
        instrument: Schemas.nullish(Instruments.Instrument),
        group: Schemas.nullish(Groups.Group),
        owner: Schemas.nullish(Users.User),
        assignments: Schemas.list(Assignments.Assignment),
        sources: Schemas.list(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservingRun = v.InferOutput<typeof ObservingRun>;

/**
 * Payload for creating an observing run.
 *
 * `calendar_date` is the local calendar date of the run in ISO format, e.g.
 * `"2026-09-01"`; `duration` is the number of nights.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ObservingRunPost {
    readonly instrument_id: number;
    readonly calendar_date: string;
    readonly pi?: string | undefined;
    readonly observers?: string | undefined;
    readonly duration?: number | undefined;
    readonly group_id?: number | undefined;
}

/**
 * Payload for updating an observing run; every field is optional.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ObservingRunUpdate {
    readonly instrument_id?: number | undefined;
    readonly calendar_date?: string | undefined;
    readonly pi?: string | undefined;
    readonly observers?: string | undefined;
    readonly duration?: number | undefined;
    readonly group_id?: number | undefined;
}

/**
 * Result of creating an observing run.
 *
 * @since 1.0.0
 * @category Models
 */
export const ObservingRunPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObservingRunPostResponse = v.InferOutput<typeof ObservingRunPostResponse>;
