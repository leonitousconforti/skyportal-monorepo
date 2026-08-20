/**
 * Request and response models for `/api/weather`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * Cached OpenWeather data for a telescope site (upstream `Weather`).
 *
 * The handler builds this dict by hand rather than serializing the model:
 * `weather` is the raw OpenWeather `weather_info` JSON blob,
 * `weather_retrieved_at` is the model's `retrieved_at`, and the remaining keys
 * are copied off the associated `Telescope`.
 *
 * @since 1.0.0
 * @category Models
 */
export const Weather = Schemas.model(
    v.strictObject({
        weather: Schemas.nullish(Schemas.JsonObject),
        weather_retrieved_at: Schemas.NullishTimestamp,
        weather_fetch_at: Schemas.NullishTimestamp,
        weather_link: Schemas.NullishString,
        telescope_name: Schemas.NullishString,
        telescope_nickname: Schemas.NullishString,
        telescope_id: Schemas.NullishInteger,
        message: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Weather = v.InferOutput<typeof Weather>;
