/**
 * Typed endpoint functions for `/api/recurring_api`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    RecurringApi,
    RecurringApiPostResponse,
    type RecurringApiPost,
} from "skyportal-js-models/RecurringApis";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/RecurringApis";

/**
 * Retrieve every recurring API call the token can access.
 *
 * The server decodes each `payload` from its stored JSON string, so `payload`
 * is an object here even though it is a string on creation.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchRecurringApis = async (
    client: Http.Client
): Promise<Array<RecurringApi>> =>
    Http.decode(v.array(RecurringApi), await Http.get(client, "/api/recurring_api"));

/**
 * Retrieve a single recurring API call by ID.
 *
 * Unlike {@link fetchRecurringApis}, the server returns `payload` exactly as
 * stored.
 *
 * @since 1.0.0
 * @category Requests
 * @param recurringApiId - ID of the recurring API call to retrieve.
 */
export const fetchRecurringApi = async (
    client: Http.Client,
    recurringApiId: number
): Promise<RecurringApi> =>
    Http.decode(
        RecurringApi,
        await Http.get(client, `/api/recurring_api/${recurringApiId}`)
    );

/**
 * Schedule a recurring API call (requires "Manage Recurring APIs").
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The call to schedule.
 */
export const postRecurringApi = async (
    client: Http.Client,
    payload: RecurringApiPost
): Promise<RecurringApiPostResponse> =>
    Http.decode(
        RecurringApiPostResponse,
        await Http.post(client, "/api/recurring_api", Http.body(payload))
    );

/**
 * Delete a recurring API call (requires "Manage Recurring APIs").
 *
 * @since 1.0.0
 * @category Requests
 * @param recurringApiId - ID of the recurring API call to delete; only its
 *   owner may delete it.
 */
export const deleteRecurringApi = async (
    client: Http.Client,
    recurringApiId: number
): Promise<void> => {
    await Http.del(client, `/api/recurring_api/${recurringApiId}`);
};
