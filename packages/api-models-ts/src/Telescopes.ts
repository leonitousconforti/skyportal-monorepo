/**
 * Request and response models for `/api/telescope`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * Sun/twilight times computed for a telescope's site.
 *
 * Returned by the single-allocation endpoint. Every value is `null` when the
 * telescope has no usable observer (no fixed location, or missing
 * coordinates), in which case the server sends an empty object instead.
 *
 * @since 1.0.0
 * @category Models
 */
export const Ephemeris = Schemas.model(
    v.strictObject({
        sunset_utc: Schemas.NullishString,
        sunrise_utc: Schemas.NullishString,
        twilight_morning_astronomical_utc: Schemas.NullishString,
        twilight_evening_astronomical_utc: Schemas.NullishString,
        twilight_morning_nautical_utc: Schemas.NullishString,
        twilight_evening_nautical_utc: Schemas.NullishString,
        utc_offset_hours: Schemas.NullishNumber,
        sunset_unix_ms: Schemas.NullishNumber,
        sunrise_unix_ms: Schemas.NullishNumber,
        twilight_morning_astronomical_unix_ms: Schemas.NullishNumber,
        twilight_evening_astronomical_unix_ms: Schemas.NullishNumber,
        twilight_morning_nautical_unix_ms: Schemas.NullishNumber,
        twilight_evening_nautical_unix_ms: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Ephemeris = v.InferOutput<typeof Ephemeris>;

/**
 * A SkyPortal telescope (upstream `Telescope`).
 *
 * `instruments` and `allocations` stay untyped: typing them with
 * {@link skyportal-js/Instruments!Instrument} /
 * {@link skyportal-js/Allocations!Allocation} would create an import cycle, as
 * both of those models point back at `Telescope`.
 *
 * @since 1.0.0
 * @category Models
 */
export const Telescope = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        nickname: Schemas.NullishString,
        lat: Schemas.NullishNumber,
        lon: Schemas.NullishNumber,
        elevation: Schemas.NullishNumber,
        mpc_obscode: Schemas.NullishString,
        diameter: Schemas.NullishNumber,
        skycam_link: Schemas.NullishString,
        weather_link: Schemas.NullishString,
        robotic: Schemas.NullishBoolean,
        fixed_location: Schemas.NullishBoolean,
        instruments: Schemas.nullish(v.array(Schemas.JsonObject)),
        allocations: Schemas.nullish(v.array(Schemas.JsonObject)),
        is_night_astronomical: Schemas.NullishBoolean,
        morning: Schemas.nullish(v.union([v.string(), v.boolean()])),
        evening: Schemas.nullish(v.union([v.string(), v.boolean()])),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Telescope = v.InferOutput<typeof Telescope>;

/**
 * Payload for creating a telescope.
 *
 * `name` is the unabbreviated facility name, `nickname` the abbreviated one,
 * and `diameter` is in meters. `fixed_location` defaults to true server-side,
 * in which case `lat`, `lon`, and `elevation` are required.
 *
 * @since 1.0.0
 * @category Models
 */
export interface TelescopePost {
    readonly name: string;
    readonly nickname: string;
    readonly diameter: number;
    readonly lat?: number | undefined;
    readonly lon?: number | undefined;
    readonly elevation?: number | undefined;
    readonly skycam_link?: string | undefined;
    readonly weather_link?: string | undefined;
    readonly robotic?: boolean | undefined;
    readonly fixed_location?: boolean | undefined;
}

/**
 * Result of creating a telescope.
 *
 * @since 1.0.0
 * @category Models
 */
export const TelescopePostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type TelescopePostResponse = v.InferOutput<typeof TelescopePostResponse>;

/**
 * Payload for updating a telescope.
 *
 * @since 1.0.0
 * @category Models
 */
export interface TelescopePut {
    readonly name?: string | undefined;
    readonly nickname?: string | undefined;
    readonly diameter?: number | undefined;
    readonly lat?: number | undefined;
    readonly lon?: number | undefined;
    readonly elevation?: number | undefined;
    readonly skycam_link?: string | undefined;
    readonly weather_link?: string | undefined;
    readonly robotic?: boolean | undefined;
    readonly fixed_location?: boolean | undefined;
}
