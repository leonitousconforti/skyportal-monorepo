/**
 * Request and response models for `/api/catalog_queries` and `/api/catalogs`.
 *
 * @since 1.0.0
 */


/**
 * Payload for submitting a catalog query (upstream `CatalogQueryPost`).
 *
 * `requester_id` is filled in server-side from the token's user. The created
 * `CatalogQuery` is not returned here; it is read back through
 * {@link skyportal-js/GcnEvents!fetchGcnEventCatalogQueries}.
 *
 * `payload` must contain `catalogName` (one of `ZTF-Fink`, `LSXPS`, `Gaia`, or
 * `TESS`), `localizationDateobs`, `localizationName`, `startDate`, `endDate`,
 * and (for `ZTF-Fink`) `localizationCumprob`.
 *
 * @since 1.0.0
 * @category Models
 */
export interface CatalogQueryPost {
    readonly allocation_id: number;
    readonly payload: Record<string, unknown>;
    readonly status?: string | undefined;
    readonly target_group_ids?: ReadonlyArray<number> | undefined;
}
