/**
 * Typed endpoint functions for `/api/filters`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Filter,
    FilterPostResponse,
    type FilterPost,
    type FilterPatch,
} from "skyportal-js-models/Filters";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Filters";

/**
 * Retrieve all filters belonging to the token's groups.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchFilters = async (client: Http.Client): Promise<Array<Filter>> =>
    Http.decode(v.array(Filter), await Http.get(client, "/api/filters"));

/**
 * Retrieve a single filter by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param filterId - ID of the filter.
 */
export const fetchFilter = async (
    client: Http.Client,
    filterId: number
): Promise<Filter> =>
    Http.decode(Filter, await Http.get(client, `/api/filters/${filterId}`));

/**
 * Create a filter.
 *
 * Requires the "Upload data" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The filter to create.
 */
export const postFilter = async (
    client: Http.Client,
    payload: FilterPost
): Promise<FilterPostResponse> =>
    Http.decode(
        FilterPostResponse,
        await Http.post(client, "/api/filters", Http.body(payload))
    );

/**
 * Update a filter.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 * `group_id` and `stream_id` cannot be changed and are accepted only when they
 * match the filter's current values. Renaming a filter that is attached to a
 * broker also renames it on the broker, and fails if the broker rejects the
 * rename. `autosave` controls whether objects passing the filter during broker
 * ingestion are saved as sources to the filter's group. Requires the "Upload
 * data" permission and group- or system-admin access to the filter's group.
 *
 * @since 1.0.0
 * @category Requests
 * @param filterId - ID of the filter to update.
 * @param payload - The fields to change.
 */
export const updateFilter = async (
    client: Http.Client,
    filterId: number,
    payload: FilterPatch
): Promise<void> => {
    await Http.patch(client, `/api/filters/${filterId}`, Http.body(payload));
};

/**
 * Delete a filter.
 *
 * Requires the "Upload data" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param filterId - ID of the filter to delete.
 */
export const deleteFilter = async (
    client: Http.Client,
    filterId: number
): Promise<void> => {
    await Http.del(client, `/api/filters/${filterId}`);
};
