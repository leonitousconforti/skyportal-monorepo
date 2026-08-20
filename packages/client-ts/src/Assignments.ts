/**
 * Typed endpoint functions for `/api/assignment`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    type FollowupPriority,
    Assignment,
    AssignmentPostResponse,
    type AssignmentPost,
} from "skyportal-js-models/Assignments";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Assignments";

/**
 * Retrieve a single observing-run assignment by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param assignmentId - ID of the assignment.
 */
export const fetchAssignment = async (
    client: Http.Client,
    assignmentId: number
): Promise<Assignment> =>
    Http.decode(Assignment, await Http.get(client, `/api/assignment/${assignmentId}`));

/**
 * Retrieve all observing-run assignments visible to the token.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchAssignments = async (
    client: Http.Client
): Promise<Array<Assignment>> =>
    Http.decode(v.array(Assignment), await Http.get(client, "/api/assignment"));

/**
 * Assign a target to a classical observing run.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The assignment to create.
 */
export const postAssignment = async (
    client: Http.Client,
    payload: AssignmentPost
): Promise<AssignmentPostResponse> =>
    Http.decode(
        AssignmentPostResponse,
        await Http.post(client, "/api/assignment", Http.body(payload))
    );

/**
 * Options for updating an assignment.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateAssignmentOptions {
    /** New comment on the assignment. */
    readonly comment?: string | undefined;
    /** New status, e.g. `"done"`, `"not done"`, or `"pending"`. */
    readonly status?: string | undefined;
    /** New priority, from `"1"` (lowest) to `"5"` (highest). */
    readonly priority?: FollowupPriority | undefined;
}

/**
 * Update an observing-run assignment.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param assignmentId - ID of the assignment to update.
 */
export const updateAssignment = async (
    client: Http.Client,
    assignmentId: number,
    options: UpdateAssignmentOptions = {}
): Promise<void> => {
    await Http.put(client, `/api/assignment/${assignmentId}`, Http.body(options));
};

/**
 * Delete an observing-run assignment.
 *
 * @since 1.0.0
 * @category Requests
 * @param assignmentId - ID of the assignment to delete.
 */
export const deleteAssignment = async (
    client: Http.Client,
    assignmentId: number
): Promise<void> => {
    await Http.del(client, `/api/assignment/${assignmentId}`);
};
