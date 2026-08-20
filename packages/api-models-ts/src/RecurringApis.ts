/**
 * Request and response models for `/api/recurring_api`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * A recurring API call scheduled by a user (upstream `RecurringAPI`).
 *
 * `owner` is always loaded (`lazy="selectin"` upstream). `payload` is
 * free-form JSON, and the single-object endpoint returns it exactly as stored,
 * which may still be a JSON string.
 *
 * @since 1.0.0
 * @category Models
 */
export const RecurringApi = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        endpoint: Schemas.NullishString,
        method: Schemas.NullishString,
        payload: Schemas.nullish(v.union([Schemas.JsonObject, v.string()])),
        next_call: Schemas.NullishTimestamp,
        call_delay: Schemas.NullishNumber,
        number_of_retries: Schemas.NullishInteger,
        active: Schemas.NullishBoolean,
        owner_id: Schemas.NullishInteger,
        owner: Schemas.nullish(Users.User),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type RecurringApi = v.InferOutput<typeof RecurringApi>;

/**
 * Payload for scheduling a recurring API call.
 *
 * `method` is upper-cased by the server and must end up as `"GET"` or
 * `"POST"`, `payload` must be a valid JSON string, `next_call` is any
 * arrow-parseable timestamp, `call_delay` is in days, and `number_of_retries`
 * may not exceed `10`.
 *
 * @since 1.0.0
 * @category Models
 */
export interface RecurringApiPost {
    readonly endpoint: string;
    readonly method: string;
    readonly next_call: string;
    readonly call_delay: number;
    readonly payload: string;
    readonly number_of_retries?: number | undefined;
}

/**
 * Result of scheduling a recurring API call.
 *
 * @since 1.0.0
 * @category Models
 */
export const RecurringApiPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type RecurringApiPostResponse = v.InferOutput<typeof RecurringApiPostResponse>;
