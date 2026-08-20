/**
 * Typed endpoint functions for classifications.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Classification,
    ClassificationPostResponse,
    ClassificationsPostResponse,
    ClassificationsPage,
    type ClassificationPost,
    type ClassificationUpdate,
} from "skyportal-js-models/Classifications";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Classifications";

/**
 * Options for listing a source's classifications.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchClassificationsOptions {
    /**
     * Aggregate classifications from every object linked through the source's
     * SuperObj.
     */
    readonly includeSuperObjs?: boolean | undefined;
}

/**
 * Retrieve the classifications of a source.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source, e.g. `"ZTF20abcdef"`.
 */
export const fetchClassifications = async (
    client: Http.Client,
    objId: string,
    options: FetchClassificationsOptions = {}
): Promise<Array<Classification>> =>
    Http.decode(
        v.array(Classification),
        await Http.get(client, `/api/sources/${objId}/classifications`, {
            includeSuperObjs: options.includeSuperObjs ?? false,
        })
    );

/**
 * Post a classification of a source.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The classification to post.
 */
export const postClassification = async (
    client: Http.Client,
    payload: ClassificationPost
): Promise<ClassificationPostResponse> =>
    Http.decode(
        ClassificationPostResponse,
        await Http.post(client, "/api/classification", Http.body(payload))
    );

/**
 * Post several classifications in one request.
 *
 * @since 1.0.0
 * @category Requests
 * @param payloads - The classifications to post; same semantics as
 *   {@link postClassification}, applied per entry.
 */
export const postClassifications = async (
    client: Http.Client,
    payloads: ReadonlyArray<ClassificationPost>
): Promise<ClassificationsPostResponse> =>
    Http.decode(
        ClassificationsPostResponse,
        await Http.post(client, "/api/classification", {
            classifications: payloads.map((payload) => Http.body(payload)),
        })
    );

/**
 * Delete a classification.
 *
 * @since 1.0.0
 * @category Requests
 * @param classificationId - ID of the classification to delete.
 */
export const deleteClassification = async (
    client: Http.Client,
    classificationId: number
): Promise<void> => {
    await Http.del(client, `/api/classification/${classificationId}`);
};

/**
 * Options for retrieving a single classification.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchClassificationOptions {
    /** Include the associated taxonomy in the response. */
    readonly includeTaxonomy?: boolean | undefined;
}

/**
 * Retrieve a single classification by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param classificationId - ID of the classification.
 */
export const fetchClassification = async (
    client: Http.Client,
    classificationId: number,
    options: FetchClassificationOptions = {}
): Promise<Classification> =>
    Http.decode(
        Classification,
        await Http.get(client, `/api/classification/${classificationId}`, {
            includeTaxonomy: options.includeTaxonomy ?? false,
        })
    );

/**
 * Options for querying all accessible classifications.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchClassificationsQueryOptions {
    /**
     * Pagination controls. `numPerPage` defaults to 100 and is capped
     * server-side at 500.
     */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /**
     * Restrict to classifications created in this date range, as ISO-format
     * date strings, e.g. `"2020-01-01"`.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    /** Include each classification's associated taxonomy. */
    readonly includeTaxonomy?: boolean | undefined;
}

/**
 * Query all accessible classifications, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchClassificationsQuery = async (
    client: Http.Client,
    options: FetchClassificationsQueryOptions = {}
): Promise<ClassificationsPage> =>
    Http.decode(
        ClassificationsPage,
        await Http.get(client, "/api/classification", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 100,
            includeTaxonomy: options.includeTaxonomy ?? false,
            startDate: options.startDate,
            endDate: options.endDate,
        })
    );

/**
 * Update a classification.
 *
 * Only the provided fields are sent. Note that the server treats an omitted
 * `ml` flag as `false`, so pass `ml: true` on every update of a
 * machine-learning classification to preserve it.
 *
 * @since 1.0.0
 * @category Requests
 * @param classificationId - ID of the classification to update.
 * @param payload - The fields to change.
 */
export const updateClassification = async (
    client: Http.Client,
    classificationId: number,
    payload: ClassificationUpdate
): Promise<void> => {
    await Http.put(
        client,
        `/api/classification/${classificationId}`,
        Http.body(payload)
    );
};

/**
 * Options for deleting a source's classifications.
 *
 * @since 1.0.0
 * @category Models
 */
export interface DeleteSourceClassificationsOptions {
    /**
     * Whether to also record a source label for the deleting user in each
     * affected group. The server defaults to `true`.
     */
    readonly label?: boolean | undefined;
}

/**
 * Delete all of a source's classifications.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source whose classifications are deleted.
 */
export const deleteSourceClassifications = async (
    client: Http.Client,
    objId: string,
    options: DeleteSourceClassificationsOptions = {}
): Promise<void> => {
    await Http.del(
        client,
        `/api/sources/${objId}/classifications`,
        options.label === undefined ? undefined : { label: options.label }
    );
};

/**
 * Vote on a classification.
 *
 * A user has at most one vote per classification; voting again overwrites the
 * previous vote.
 *
 * @since 1.0.0
 * @category Requests
 * @param classificationId - ID of the classification to vote on.
 * @param vote - The vote value, generally `1` (upvote) or `-1` (downvote).
 */
export const postClassificationVote = async (
    client: Http.Client,
    classificationId: number,
    vote: number
): Promise<void> => {
    await Http.post(client, `/api/classification/votes/${classificationId}`, { vote });
};

/**
 * Delete the token user's vote on a classification.
 *
 * @since 1.0.0
 * @category Requests
 * @param classificationId - ID of the classification whose vote is removed.
 */
export const deleteClassificationVote = async (
    client: Http.Client,
    classificationId: number
): Promise<void> => {
    await Http.del(client, `/api/classification/votes/${classificationId}`);
};

/**
 * Options for listing classified sources.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSourcesByClassificationOptions {
    /**
     * Restrict to classifications created in this date range, as ISO-format
     * date strings, e.g. `"2020-01-01"`.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
}

/**
 * Retrieve the object IDs of sources that have classifications.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSourcesByClassification = async (
    client: Http.Client,
    options: FetchSourcesByClassificationOptions = {}
): Promise<Array<string>> =>
    Http.decode(
        v.array(v.string()),
        await Http.get(client, "/api/classification/sources", {
            startDate: options.startDate,
            endDate: options.endDate,
        })
    );
