/**
 * Typed endpoint functions for `/api/localization`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import { Localization } from "skyportal-js-models/Localizations";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Localizations";

/**
 * Options for retrieving a localization.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchLocalizationOptions {
    /**
     * Include the flattened 2D skymap (`flat_2d`) in the response. Defaults to
     * false server-side.
     */
    readonly include2DMap?: boolean | undefined;
}

/**
 * Retrieve a GCN localization by event time and name.
 *
 * @since 1.0.0
 * @category Requests
 * @param dateobs - UTC event timestamp of the GCN event, e.g.
 *   `"2023-05-23T12:00:00"`.
 * @param localizationName - Name of the localization, e.g.
 *   `"bayestar.fits.gz"`.
 */
export const fetchLocalization = async (
    client: Http.Client,
    dateobs: string,
    localizationName: string,
    options: FetchLocalizationOptions = {}
): Promise<Localization> =>
    Http.decode(
        Localization,
        await Http.get(
            client,
            `/api/localization/${dateobs}/name/${localizationName}`,
            {
                include2DMap: options.include2DMap ?? false,
            }
        )
    );

/**
 * Delete a GCN localization.
 *
 * @since 1.0.0
 * @category Requests
 * @param dateobs - UTC event timestamp of the GCN event.
 * @param localizationName - Name of the localization to delete.
 */
export const deleteLocalization = async (
    client: Http.Client,
    dateobs: string,
    localizationName: string
): Promise<void> => {
    await Http.del(client, `/api/localization/${dateobs}/name/${localizationName}`);
};

/**
 * Ingest the skymap referenced by an existing GCN notice.
 *
 * The server reads the stored notice content and posts the skymap it
 * references as a new localization. Fails with a conflict if that localization
 * already exists, or 404 if the notice has no available skymap (e.g. a
 * retraction).
 *
 * @since 1.0.0
 * @category Requests
 * @param dateobs - UTC event timestamp of the GCN event the notice belongs to.
 * @param noticeId - ID of the GCN notice to ingest the skymap from.
 */
export const postLocalizationFromNotice = async (
    client: Http.Client,
    dateobs: string,
    noticeId: number
): Promise<void> => {
    await Http.post(client, `/api/localization/${dateobs}/notice/${noticeId}`);
};

/**
 * Download a localization's skymap as a FITS file.
 *
 * @since 1.0.0
 * @category Requests
 * @param dateobs - UTC event timestamp of the GCN event.
 * @param localizationName - Name of the localization to download.
 */
export const fetchLocalizationSkymap = (
    client: Http.Client,
    dateobs: string,
    localizationName: string
): Promise<Uint8Array> =>
    Http.getContent(
        client,
        `/api/localization/${dateobs}/name/${localizationName}/download`
    );

/**
 * Retrieve all distinct localization tags.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchLocalizationTags = async (
    client: Http.Client
): Promise<Array<string>> =>
    Http.decode(v.array(v.string()), await Http.get(client, "/api/localization/tags"));

/**
 * Retrieve all distinct localization property names, sorted.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchLocalizationProperties = async (
    client: Http.Client
): Promise<Array<string>> =>
    Http.decode(
        v.array(v.string()),
        await Http.get(client, "/api/localization/properties")
    );

/**
 * Crossmatch two localizations, returning the intersection as FITS.
 *
 * The server multiplies the two flattened skymaps, renormalizes, and returns
 * the product as a multi-order FITS skymap.
 *
 * @since 1.0.0
 * @category Requests
 * @param id1 - ID of the first localization to crossmatch.
 * @param id2 - ID of the second localization to crossmatch.
 */
export const fetchLocalizationCrossmatch = (
    client: Http.Client,
    id1: number,
    id2: number
): Promise<Uint8Array> =>
    Http.getContent(client, "/api/localizationcrossmatch", { id1, id2 });

/**
 * Options for the observability and world map plots.
 *
 * @since 1.0.0
 * @category Models
 */
export interface LocalizationPlotOptions {
    /** Maximum airmass to consider. Server default is 2.5. */
    readonly maxAirmass?: number | undefined;
    /**
     * Twilight definition: `"astronomical"` (-18 deg, server default),
     * `"nautical"` (-12 deg), or `"civil"` (-6 deg).
     */
    readonly twilight?: string | undefined;
}

/**
 * Download an observability summary plot (PDF) for a localization.
 *
 * Charts when each fixed-location telescope can observe the localization's
 * contour center over the day after the event.
 *
 * @since 1.0.0
 * @category Requests
 * @param localizationId - ID of the localization to plot observability for.
 */
export const fetchLocalizationObservabilityPlot = (
    client: Http.Client,
    localizationId: number,
    options: LocalizationPlotOptions = {}
): Promise<Uint8Array> =>
    Http.getContent(client, `/api/localization/${localizationId}/observability`, {
        maxAirmass: options.maxAirmass,
        twilight: options.twilight,
    });

/**
 * Download an airmass chart (PDF) for a localization at a telescope.
 *
 * @since 1.0.0
 * @category Requests
 * @param localizationId - ID of the localization to chart.
 * @param telescopeId - ID of the telescope to compute the airmass for.
 */
export const fetchLocalizationAirmassChart = (
    client: Http.Client,
    localizationId: number,
    telescopeId: number
): Promise<Uint8Array> =>
    Http.getContent(
        client,
        `/api/localization/${localizationId}/airmass/${telescopeId}`
    );

/**
 * Download a world map plot (PDF) of telescope observability.
 *
 * Shows every fixed-location telescope on a world map, colored by the
 * probability of the localization region it can observe at event time.
 *
 * @since 1.0.0
 * @category Requests
 * @param localizationId - ID of the localization to generate the map for.
 */
export const fetchLocalizationWorldmapPlot = (
    client: Http.Client,
    localizationId: number,
    options: LocalizationPlotOptions = {}
): Promise<Uint8Array> =>
    Http.getContent(client, `/api/localization/${localizationId}/worldmap`, {
        maxAirmass: options.maxAirmass,
        twilight: options.twilight,
    });
