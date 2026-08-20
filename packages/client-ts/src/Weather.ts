/**
 * Typed endpoint functions for `/api/weather`.
 *
 * @since 1.0.0
 */

import { Weather } from "skyportal-js-models/Weather";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Weather";

/**
 * Options for a weather lookup.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchWeatherOptions {
    /**
     * Telescope to report on. If omitted the server falls back to the user's
     * weather preference, then to the first telescope the token can access.
     */
    readonly telescopeId?: number | undefined;
}

/**
 * Retrieve the weather at a telescope site.
 *
 * The server refreshes the cached OpenWeather data only once the configured
 * refresh interval has elapsed, and reports upstream failures in `message`
 * rather than as an error. When no telescope can be resolved at all, every
 * field except `weather` is absent.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchWeather = async (
    client: Http.Client,
    options: FetchWeatherOptions = {}
): Promise<Weather> =>
    Http.decode(
        Weather,
        await Http.get(client, "/api/weather", { telescope_id: options.telescopeId })
    );
