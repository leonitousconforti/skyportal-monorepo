/**
 * Typed endpoint functions for `/api/catalog_queries` and `/api/catalogs`.
 *
 * @since 1.0.0
 */

import type { CatalogQueryPost } from "skyportal-js-models/CatalogQueries";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/CatalogQueries";

/**
 * Submit a catalog query, retrieving sources in a GCN localization.
 *
 * The query runs asynchronously on the server; a success response only means
 * the query was started. Retrieved sources are saved to the target groups and
 * the allocation's group.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The query to submit.
 */
export const postCatalogQuery = async (
    client: Http.Client,
    payload: CatalogQueryPost
): Promise<void> => {
    await Http.post(client, "/api/catalog_queries", Http.body(payload));
};

/**
 * Options for a Swift LSXPS catalog import.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostSwiftLsxpsQueryOptions {
    /**
     * Nickname of the telescope to assign this catalog to. Server default is
     * `"Swift"`.
     */
    readonly telescopeName?: string | undefined;
    /**
     * Save the sources to these groups. If omitted, the server uses all of the
     * token's accessible groups.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Post Swift LSXPS transients as sources.
 *
 * The query runs asynchronously on the server; a success response only means
 * the query was started. Repeated posting skips existing sources.
 *
 * @since 1.0.0
 * @category Requests
 */
export const postSwiftLsxpsQuery = async (
    client: Http.Client,
    options: PostSwiftLsxpsQueryOptions = {}
): Promise<void> => {
    await Http.post(
        client,
        "/api/catalogs/swift_lsxps",
        Http.body({ telescope_name: options.telescopeName, groupIDs: options.groupIds })
    );
};

/**
 * Options for a Gaia Photometric Alerts import.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostGaiaAlertsQueryOptions {
    /**
     * Nickname of the telescope to assign this catalog to. Server default is
     * `"Gaia"`.
     */
    readonly telescopeName?: string | undefined;
    /**
     * Save the sources to these groups. If omitted, the server uses all of the
     * token's accessible groups.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
    /**
     * Only include alerts in this date range, as arrow-parsable strings, e.g.
     * `"2020-01-01"`.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
}

/**
 * Post Gaia Photometric Alerts as sources.
 *
 * The query runs asynchronously on the server; a success response only means
 * the query was started. Repeated posting skips existing sources.
 *
 * @since 1.0.0
 * @category Requests
 */
export const postGaiaAlertsQuery = async (
    client: Http.Client,
    options: PostGaiaAlertsQueryOptions = {}
): Promise<void> => {
    await Http.post(
        client,
        "/api/catalogs/gaia_alerts",
        Http.body({
            telescope_name: options.telescopeName,
            groupIDs: options.groupIds,
            startDate: options.startDate,
            endDate: options.endDate,
        })
    );
};
