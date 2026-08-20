/**
 * Typed endpoint functions for `/api/spatial_catalog`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    SpatialCatalog,
    SpatialCatalogPostResponse,
} from "skyportal-js-models/SpatialCatalogs";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/SpatialCatalogs";

/**
 * Retrieve a single spatial catalog, including its entries.
 *
 * @since 1.0.0
 * @category Requests
 * @param catalogId - ID of the spatial catalog.
 */
export const fetchSpatialCatalog = async (
    client: Http.Client,
    catalogId: number
): Promise<SpatialCatalog> =>
    Http.decode(
        SpatialCatalog,
        await Http.get(client, `/api/spatial_catalog/${catalogId}`)
    );

/**
 * Retrieve all spatial catalogs, each with its entry count.
 *
 * The returned catalogs carry `entries_count` but not the entries themselves;
 * use {@link fetchSpatialCatalog} for the entries.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSpatialCatalogs = async (
    client: Http.Client
): Promise<Array<SpatialCatalog>> =>
    Http.decode(
        v.array(SpatialCatalog),
        await Http.get(client, "/api/spatial_catalog")
    );

/**
 * Ingest a spatial catalog.
 *
 * The entry ingestion runs asynchronously on the server; the returned ID is
 * available immediately but the entries may take a while to appear.
 *
 * @since 1.0.0
 * @category Requests
 * @param catalogName - Name of the spatial catalog. Reused if it already exists.
 * @param catalogData - Maps column names to equal-length lists. `name`, `ra`,
 *   and `dec` are required, with `ra` in `[0, 360)` degrees and `dec` in
 *   `[-90, 90]` degrees. Either `radius` (cone) or `amaj`, `amin`, and `phi`
 *   (ellipse) are also required.
 */
export const postSpatialCatalog = async (
    client: Http.Client,
    catalogName: string,
    catalogData: Record<string, ReadonlyArray<unknown>>
): Promise<SpatialCatalogPostResponse> =>
    Http.decode(
        SpatialCatalogPostResponse,
        await Http.post(client, "/api/spatial_catalog", {
            catalog_name: catalogName,
            catalog_data: catalogData,
        })
    );

/**
 * Delete a spatial catalog.
 *
 * The deletion runs asynchronously on the server; a success response only
 * means the deletion was started.
 *
 * @since 1.0.0
 * @category Requests
 * @param catalogId - ID of the spatial catalog to delete.
 */
export const deleteSpatialCatalog = async (
    client: Http.Client,
    catalogId: number
): Promise<void> => {
    await Http.del(client, `/api/spatial_catalog/${catalogId}`);
};

/**
 * Upload a spatial catalog from an ASCII file.
 *
 * Requires the Upload data ACL. The entry ingestion runs asynchronously on the
 * server; the returned ID is available immediately but the entries may take a
 * while to appear.
 *
 * @since 1.0.0
 * @category Requests
 * @param catalogName - Name of the spatial catalog. Reused if it already exists.
 * @param catalogData - File content as a comma-separated ASCII table. `name`,
 *   `ra`, and `dec` columns are required, plus either `radius` (cone) or
 *   `amaj`, `amin`, and `phi` (ellipse).
 */
export const postSpatialCatalogAscii = async (
    client: Http.Client,
    catalogName: string,
    catalogData: string
): Promise<SpatialCatalogPostResponse> =>
    Http.decode(
        SpatialCatalogPostResponse,
        await Http.post(client, "/api/spatial_catalog/ascii", {
            catalogName,
            catalogData,
        })
    );
