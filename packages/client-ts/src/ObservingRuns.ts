/**
 * Typed endpoint functions for `/api/observing_run`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Http from "./Http.ts";
import { ObservingRun, ObservingRunPostResponse } from "skyportal-js-models/ObservingRuns";
import type { ObservingRunPost, ObservingRunUpdate } from "skyportal-js-models/ObservingRuns";

export * from "skyportal-js-models/ObservingRuns";

/**
 * Retrieve all observing runs.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchObservingRuns = async (client: Http.Client): Promise<Array<ObservingRun>> =>
    Http.decode(v.array(ObservingRun), await Http.get(client, "/api/observing_run"));

/**
 * Retrieve a single observing run by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param runId - ID of the observing run.
 */
export const fetchObservingRun = async (client: Http.Client, runId: number): Promise<ObservingRun> =>
    Http.decode(ObservingRun, await Http.get(client, `/api/observing_run/${runId}`));

/**
 * Create an observing run.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The run to create.
 */
export const postObservingRun = async (
    client: Http.Client,
    payload: ObservingRunPost
): Promise<ObservingRunPostResponse> =>
    Http.decode(ObservingRunPostResponse, await Http.post(client, "/api/observing_run", Http.body(payload)));

/**
 * Delete an observing run.
 *
 * @since 1.0.0
 * @category Requests
 * @param runId - ID of the observing run to delete.
 */
export const deleteObservingRun = async (client: Http.Client, runId: number): Promise<void> => {
    await Http.del(client, `/api/observing_run/${runId}`);
};

/**
 * Update an observing run.
 *
 * The run's end time is recomputed server-side afterwards.
 *
 * @since 1.0.0
 * @category Requests
 * @param runId - ID of the observing run to update. Only the owner of a run may
 *   modify it.
 * @param payload - Fields to change.
 */
export const updateObservingRun = async (
    client: Http.Client,
    runId: number,
    payload: ObservingRunUpdate
): Promise<void> => {
    await Http.put(client, `/api/observing_run/${runId}`, Http.body(payload));
};

/**
 * Bulk-restatus the assignments of an observing run.
 *
 * Every assignment on the run whose status equals `currentStatus` is moved to
 * `newStatus`; the others are left alone.
 *
 * @since 1.0.0
 * @category Requests
 * @param runId - ID of the observing run.
 * @param currentStatus - Status an assignment must currently have to be
 *   updated, e.g. `"pending"`.
 * @param newStatus - Status to apply, e.g. `"not observed"`.
 */
export const updateObservingRunNotObserved = async (
    client: Http.Client,
    runId: number,
    currentStatus: string,
    newStatus: string
): Promise<void> => {
    await Http.put(client, `/api/observing_run/${runId}/not_observed`, {
        current_status: currentStatus,
        new_status: newStatus,
    });
};
