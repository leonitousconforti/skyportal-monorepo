/**
 * Typed endpoint functions for `/api/newsfeed`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import { NewsFeedItem } from "skyportal-js-models/NewsFeed";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/NewsFeed";

/**
 * Options for a news feed request.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchNewsFeedOptions {
    /**
     * Number of items to return. The server takes the larger of this and the
     * user's preference, defaults to `50` when neither is set, and rejects
     * values above `1000`.
     */
    readonly numItems?: number | undefined;
    /**
     * Restrict the feed to sources saved to this team's groups; a view filter
     * only, always intersected with the token's accessible groups.
     */
    readonly teamId?: number | undefined;
}

/**
 * Retrieve a summary of recent activity, newest first.
 *
 * Items cover new sources, comments, classifications, spectra and follow-up
 * photometry; which categories appear, and whether bot comments and ML
 * classifications are included, follow the user's news feed preferences.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchNewsFeed = async (
    client: Http.Client,
    options: FetchNewsFeedOptions = {}
): Promise<Array<NewsFeedItem>> =>
    Http.decode(
        v.array(NewsFeedItem),
        await Http.get(client, "/api/newsfeed", {
            numItems: options.numItems,
            teamID: options.teamId,
        })
    );
