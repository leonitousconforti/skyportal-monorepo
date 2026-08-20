/**
 * Typed endpoint functions for `/api/taxonomy`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Taxonomy,
    TaxonomyPostResponse,
    type TaxonomyPost,
    type TaxonomyPut,
} from "skyportal-js-models/Taxonomies";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Taxonomies";

/**
 * Retrieve the taxonomies usable by the token's groups.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchTaxonomies = async (client: Http.Client): Promise<Array<Taxonomy>> =>
    Http.decode(v.array(Taxonomy), await Http.get(client, "/api/taxonomy"));

/**
 * Retrieve a single taxonomy by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param taxonomyId - ID of the taxonomy.
 */
export const fetchTaxonomy = async (
    client: Http.Client,
    taxonomyId: number
): Promise<Taxonomy> =>
    Http.decode(Taxonomy, await Http.get(client, `/api/taxonomy/${taxonomyId}`));

/**
 * Create a taxonomy.
 *
 * Requires the "Post taxonomy" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The taxonomy to create.
 */
export const postTaxonomy = async (
    client: Http.Client,
    payload: TaxonomyPost
): Promise<TaxonomyPostResponse> =>
    Http.decode(
        TaxonomyPostResponse,
        await Http.post(
            client,
            "/api/taxonomy",
            Http.body({ isLatest: true, ...payload })
        )
    );

/**
 * Update a taxonomy.
 *
 * Only the provided fields are sent; omitted fields are left unchanged. The
 * hierarchy cannot be edited: post a new taxonomy instead. Groups the token
 * cannot access are dropped from `group_ids`. Requires the "Post taxonomy"
 * permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param taxonomyId - ID of the taxonomy to update.
 * @param payload - The fields to change.
 */
export const updateTaxonomy = async (
    client: Http.Client,
    taxonomyId: number,
    payload: TaxonomyPut
): Promise<void> => {
    await Http.put(client, `/api/taxonomy/${taxonomyId}`, Http.body(payload));
};

/**
 * Delete a taxonomy.
 *
 * Fails if any classification still references the taxonomy. Requires the
 * "Delete taxonomy" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param taxonomyId - ID of the taxonomy to delete.
 */
export const deleteTaxonomy = async (
    client: Http.Client,
    taxonomyId: number
): Promise<void> => {
    await Http.del(client, `/api/taxonomy/${taxonomyId}`);
};
