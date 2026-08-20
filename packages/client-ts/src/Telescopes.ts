/**
 * Typed endpoint functions for `/api/telescope`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Telescope,
    TelescopePostResponse,
    type TelescopePost,
    type TelescopePut,
} from "skyportal-js-models/Telescopes";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Telescopes";

/**
 * Options for listing telescopes.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchTelescopesOptions {
    /** Exact telescope name to match. */
    readonly name?: string | undefined;
    /** Keep telescopes whose latitude lies in this range, in degrees. */
    readonly latitudeMin?: number | undefined;
    readonly latitudeMax?: number | undefined;
    /** Keep telescopes whose longitude lies in this range, in degrees. */
    readonly longitudeMin?: number | undefined;
    readonly longitudeMax?: number | undefined;
}

/**
 * Retrieve telescopes, optionally filtered by name or location box.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchTelescopes = async (
    client: Http.Client,
    options: FetchTelescopesOptions = {}
): Promise<Array<Telescope>> =>
    Http.decode(
        v.array(Telescope),
        await Http.get(client, "/api/telescope", {
            name: options.name,
            latitudeMin: options.latitudeMin,
            latitudeMax: options.latitudeMax,
            longitudeMin: options.longitudeMin,
            longitudeMax: options.longitudeMax,
        })
    );

/**
 * Retrieve a single telescope by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param telescopeId - ID of the telescope.
 */
export const fetchTelescope = async (
    client: Http.Client,
    telescopeId: number
): Promise<Telescope> =>
    Http.decode(Telescope, await Http.get(client, `/api/telescope/${telescopeId}`));

/**
 * Create a telescope.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The telescope to create.
 */
export const postTelescope = async (
    client: Http.Client,
    payload: TelescopePost
): Promise<TelescopePostResponse> =>
    Http.decode(
        TelescopePostResponse,
        await Http.post(
            client,
            "/api/telescope",
            Http.body({ robotic: false, ...payload })
        )
    );

/**
 * Update a telescope.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 * Requires the "Manage telescopes" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param telescopeId - ID of the telescope to update.
 * @param payload - The fields to change.
 */
export const updateTelescope = async (
    client: Http.Client,
    telescopeId: number,
    payload: TelescopePut
): Promise<void> => {
    await Http.put(client, `/api/telescope/${telescopeId}`, Http.body(payload));
};

/**
 * Delete a telescope.
 *
 * Requires the "Manage telescopes" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param telescopeId - ID of the telescope to delete.
 */
export const deleteTelescope = async (
    client: Http.Client,
    telescopeId: number
): Promise<void> => {
    await Http.del(client, `/api/telescope/${telescopeId}`);
};
