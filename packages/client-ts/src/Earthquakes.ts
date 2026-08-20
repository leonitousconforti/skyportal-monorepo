/**
 * Typed endpoint functions for `/api/earthquake`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    EarthquakeMeasurement,
    Earthquake,
    EarthquakesPage,
    EarthquakePostResponse,
    type EarthquakePost,
} from "skyportal-js-models/Earthquakes";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Earthquakes";

/**
 * Retrieve a single earthquake event by its event ID.
 *
 * The response includes the event's notices (with raw QuakeML content),
 * predictions and comments, each sorted newest first.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID, e.g. `"us7000abcd"`.
 */
export const fetchEarthquake = async (
    client: Http.Client,
    eventId: string
): Promise<Earthquake> =>
    Http.decode(Earthquake, await Http.get(client, `/api/earthquake/${eventId}`));

/**
 * Options for querying earthquake events.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchEarthquakesOptions {
    /**
     * Arrow-parseable date strings (e.g. `"2020-01-01"`) filtering on the date
     * of the event's notices.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    /** Keep only events whose status contains this string. */
    readonly statusKeep?: string | undefined;
    /** Drop events whose status contains this string. */
    readonly statusRemove?: string | undefined;
    /**
     * Pagination controls; the server defaults to page 1 and 100 per page.
     */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
}

/**
 * Query earthquake events, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchEarthquakes = async (
    client: Http.Client,
    options: FetchEarthquakesOptions = {}
): Promise<EarthquakesPage> =>
    Http.decode(
        EarthquakesPage,
        await Http.get(client, "/api/earthquake", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 100,
            startDate: options.startDate,
            endDate: options.endDate,
            statusKeep: options.statusKeep,
            statusRemove: options.statusRemove,
        })
    );

/**
 * Retrieve the distinct status tags used by earthquake events.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchEarthquakeStatuses = async (
    client: Http.Client
): Promise<Array<string>> =>
    Http.decode(v.array(v.string()), await Http.get(client, "/api/earthquake/status"));

/**
 * Ingest an earthquake event.
 *
 * Posting again for a known event adds another notice; only the original
 * poster may update an existing event.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The earthquake to ingest.
 */
export const postEarthquake = async (
    client: Http.Client,
    payload: EarthquakePost
): Promise<EarthquakePostResponse> =>
    Http.decode(
        EarthquakePostResponse,
        await Http.post(client, "/api/earthquake", Http.body(payload))
    );

/**
 * Delete an earthquake event.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID to delete.
 */
export const deleteEarthquake = async (
    client: Http.Client,
    eventId: string
): Promise<void> => {
    await Http.del(client, `/api/earthquake/${eventId}`);
};

/**
 * Run and store a seismic arrival prediction for one detector.
 *
 * The prediction uses the event's most recent notice, so the event must
 * already have one, and the detector must be at a fixed location.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID.
 * @param mmadetectorId - ID of the MMA detector to predict arrivals for.
 */
export const postEarthquakePrediction = async (
    client: Http.Client,
    eventId: string,
    mmadetectorId: number
): Promise<void> => {
    await Http.post(
        client,
        `/api/earthquake/${eventId}/mmadetector/${mmadetectorId}/predictions`
    );
};

/**
 * Retrieve the ground velocity measurement for one detector.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID.
 * @param mmadetectorId - ID of the MMA detector the measurement belongs to.
 */
export const fetchEarthquakeMeasurement = async (
    client: Http.Client,
    eventId: string,
    mmadetectorId: number
): Promise<EarthquakeMeasurement> =>
    Http.decode(
        EarthquakeMeasurement,
        await Http.get(
            client,
            `/api/earthquake/${eventId}/mmadetector/${mmadetectorId}/measurements`
        )
    );

/**
 * Options for an earthquake ground-velocity measurement.
 *
 * @since 1.0.0
 * @category Models
 */
export interface EarthquakeMeasurementOptions {
    /** Measured earthquake amplitude, in m/s. */
    readonly rfamp?: number | undefined;
    /** Measured lockloss: 0 (no lockloss) or 1 (lockloss). */
    readonly lockloss?: number | undefined;
}

/**
 * Post a ground velocity measurement for one detector.
 *
 * At least one of `rfamp` or `lockloss` is required. Only one measurement may
 * exist per earthquake and detector; use {@link updateEarthquakeMeasurement}
 * to change an existing one.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID.
 * @param mmadetectorId - ID of the MMA detector the measurement belongs to.
 */
export const postEarthquakeMeasurement = async (
    client: Http.Client,
    eventId: string,
    mmadetectorId: number,
    options: EarthquakeMeasurementOptions = {}
): Promise<void> => {
    await Http.post(
        client,
        `/api/earthquake/${eventId}/mmadetector/${mmadetectorId}/measurements`,
        Http.body(options)
    );
};

/**
 * Update the ground velocity measurement for one detector.
 *
 * At least one of `rfamp` or `lockloss` is required; omitted fields are left
 * unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID.
 * @param mmadetectorId - ID of the MMA detector the measurement belongs to.
 */
export const updateEarthquakeMeasurement = async (
    client: Http.Client,
    eventId: string,
    mmadetectorId: number,
    options: EarthquakeMeasurementOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        `/api/earthquake/${eventId}/mmadetector/${mmadetectorId}/measurements`,
        Http.body(options)
    );
};

/**
 * Delete the ground velocity measurement for one detector.
 *
 * @since 1.0.0
 * @category Requests
 * @param eventId - Earthquake event ID.
 * @param mmadetectorId - ID of the MMA detector the measurement belongs to.
 */
export const deleteEarthquakeMeasurement = async (
    client: Http.Client,
    eventId: string,
    mmadetectorId: number
): Promise<void> => {
    await Http.del(
        client,
        `/api/earthquake/${eventId}/mmadetector/${mmadetectorId}/measurements`
    );
};
