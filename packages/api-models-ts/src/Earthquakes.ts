/**
 * Request and response models for `/api/earthquake`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Comments from "./Comments.ts";
import * as Reminders from "./Reminders.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * A single notice about an earthquake (upstream `EarthquakeNotice`).
 *
 * `content` is the raw QuakeML document; it is a deferred `LargeBinary`
 * column, so it is only present on the single-event endpoint (which undefers
 * it) and arrives UTF-8 decoded.
 *
 * @since 1.0.0
 * @category Models
 */
export const EarthquakeNotice = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        sent_by: Schemas.nullish(Users.User),
        content: Schemas.nullish(Schemas.Json),
        event_id: Schemas.NullishString,
        lat: Schemas.NullishNumber,
        lon: Schemas.NullishNumber,
        depth: Schemas.NullishNumber,
        magnitude: Schemas.NullishNumber,
        date: Schemas.NullishTimestamp,
        country: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EarthquakeNotice = v.InferOutput<typeof EarthquakeNotice>;

/**
 * A predicted seismic arrival (upstream `EarthquakePrediction`).
 *
 * @since 1.0.0
 * @category Models
 */
export const EarthquakePrediction = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        event_id: Schemas.NullishInteger,
        detector_id: Schemas.NullishInteger,
        d: Schemas.NullishNumber,
        p: Schemas.NullishTimestamp,
        s: Schemas.NullishTimestamp,
        r2p0: Schemas.NullishTimestamp,
        r3p5: Schemas.NullishTimestamp,
        r5p0: Schemas.NullishTimestamp,
        rfamp: Schemas.NullishNumber,
        lockloss: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EarthquakePrediction = v.InferOutput<typeof EarthquakePrediction>;

/**
 * A measured ground velocity (upstream `EarthquakeMeasured`).
 *
 * @since 1.0.0
 * @category Models
 */
export const EarthquakeMeasurement = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        event_id: Schemas.NullishInteger,
        detector_id: Schemas.NullishInteger,
        rfamp: Schemas.NullishNumber,
        lockloss: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EarthquakeMeasurement = v.InferOutput<typeof EarthquakeMeasurement>;

/**
 * An earthquake event (upstream `EarthquakeEvent`).
 *
 * The single-event endpoint replaces `comments` with hand-built dicts that
 * drop `attachment_bytes` and add `author` and `resourceType`.
 *
 * @since 1.0.0
 * @category Models
 */
export const Earthquake = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        sent_by_id: Schemas.NullishInteger,
        sent_by: Schemas.nullish(Users.User),
        event_id: Schemas.NullishString,
        event_uri: Schemas.NullishString,
        status: Schemas.NullishString,
        notices: Schemas.list(EarthquakeNotice),
        predictions: Schemas.list(EarthquakePrediction),
        measurements: Schemas.list(EarthquakeMeasurement),
        comments: Schemas.list(Comments.Comment),
        reminders: Schemas.list(Reminders.Reminder),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Earthquake = v.InferOutput<typeof Earthquake>;

/**
 * One page of results from an earthquake events query.
 *
 * @since 1.0.0
 * @category Models
 */
export const EarthquakesPage = Schemas.model(
    v.strictObject({
        events: Schemas.list(Earthquake),
        totalMatches: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EarthquakesPage = v.InferOutput<typeof EarthquakesPage>;

/**
 * Payload for ingesting an earthquake event.
 *
 * Provide either `xml` (raw QuakeML) or all of `date`, `event_id`,
 * `latitude`, `longitude`, `depth` and `magnitude`.
 *
 * @since 1.0.0
 * @category Models
 */
export interface EarthquakePost {
    readonly xml?: string | undefined;
    readonly event_id?: string | undefined;
    readonly date?: string | undefined;
    readonly latitude?: number | undefined;
    readonly longitude?: number | undefined;
    readonly depth?: number | undefined;
    readonly magnitude?: number | undefined;
}

/**
 * Result of ingesting an earthquake event.
 *
 * @since 1.0.0
 * @category Models
 */
export const EarthquakePostResponse = Schemas.model(
    v.strictObject({
        id: Schemas.nullish(v.union([v.string(), Schemas.Integer])),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type EarthquakePostResponse = v.InferOutput<typeof EarthquakePostResponse>;
