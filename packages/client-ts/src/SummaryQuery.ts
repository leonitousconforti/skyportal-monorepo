/**
 * Typed endpoint functions for `/api/summary_query`.
 *
 * @since 1.0.0
 */

import {
    SummaryQueryResults,
    type SummaryQueryPost,
} from "skyportal-js-models/SummaryQuery";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/SummaryQuery";

/**
 * Search for sources whose summaries match a query.
 *
 * The search runs against the vector store of source summaries, so it requires
 * the server to be configured with an embeddings store and an OpenAI key
 * (globally or in the requesting user's preferences).
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The query.
 */
export const postSummaryQuery = async (
    client: Http.Client,
    payload: SummaryQueryPost
): Promise<SummaryQueryResults> =>
    Http.decode(
        SummaryQueryResults,
        await Http.post(client, "/api/summary_query", Http.body(payload))
    );
