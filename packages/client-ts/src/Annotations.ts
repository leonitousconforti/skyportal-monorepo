/**
 * Typed endpoint functions for source annotations.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Http from "./Http.ts";
import { Annotation, AnnotationDetail, AnnotationPostResponse } from "skyportal-js-models/Annotations";
import type { AnnotationResourceType } from "skyportal-js-models/Annotations";

export * from "skyportal-js-models/Annotations";

/**
 * Options naming which annotatable resource an annotation belongs to.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AnnotationResourceOptions {
    /** What the annotation is on. Defaults to `"sources"`. */
    readonly resourceType?: AnnotationResourceType | undefined;
}

/**
 * Retrieve the annotations on an annotatable resource.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the annotated resource: an object ID for sources,
 *   otherwise an integer ID.
 */
export const fetchAnnotations = async (
    client: Http.Client,
    resourceId: string | number,
    options: AnnotationResourceOptions = {}
): Promise<Array<Annotation>> =>
    Http.decode(
        v.array(Annotation),
        await Http.get(client, `/api/${options.resourceType ?? "sources"}/${resourceId}/annotations`)
    );

/**
 * Options for posting an annotation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostAnnotationOptions {
    /** What to annotate. Defaults to `"sources"`. */
    readonly resourceType?: AnnotationResourceType | undefined;
    /**
     * Restrict the annotation's visibility to these groups. If omitted, the
     * server applies its default visibility.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Post an annotation on an annotatable resource.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the resource to annotate: an object ID for sources,
 *   otherwise an integer ID.
 * @param origin - Name of the process that produced the annotation, e.g. a
 *   pipeline or cross-match service. A source can hold one annotation per origin.
 * @param data - The annotation payload, a JSON-serializable mapping.
 */
export const postAnnotation = async (
    client: Http.Client,
    resourceId: string | number,
    origin: string,
    data: Record<string, unknown>,
    options: PostAnnotationOptions = {}
): Promise<AnnotationPostResponse> =>
    Http.decode(
        AnnotationPostResponse,
        await Http.post(
            client,
            `/api/${options.resourceType ?? "sources"}/${resourceId}/annotations`,
            Http.body({ origin, data, group_ids: options.groupIds })
        )
    );

/**
 * Options for updating an annotation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateAnnotationOptions {
    /** Rename the annotation's origin. If omitted, it is left unchanged. */
    readonly origin?: string | undefined;
    /** What the annotation is on. Defaults to `"sources"`. */
    readonly resourceType?: AnnotationResourceType | undefined;
    /**
     * Restrict the annotation's visibility to these groups. If omitted, the
     * visibility is left unchanged.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Update an annotation on an annotatable resource.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the annotated resource.
 * @param annotationId - ID of the annotation to update.
 * @param data - The new annotation payload, a JSON-serializable mapping.
 */
export const updateAnnotation = async (
    client: Http.Client,
    resourceId: string | number,
    annotationId: number,
    data: Record<string, unknown>,
    options: UpdateAnnotationOptions = {}
): Promise<void> => {
    await Http.put(
        client,
        `/api/${options.resourceType ?? "sources"}/${resourceId}/annotations/${annotationId}`,
        Http.body({ data, origin: options.origin, group_ids: options.groupIds })
    );
};

/**
 * Delete an annotation on an annotatable resource.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the annotated resource.
 * @param annotationId - ID of the annotation to delete.
 */
export const deleteAnnotation = async (
    client: Http.Client,
    resourceId: string | number,
    annotationId: number,
    options: AnnotationResourceOptions = {}
): Promise<void> => {
    await Http.del(client, `/api/${options.resourceType ?? "sources"}/${resourceId}/annotations/${annotationId}`);
};

/**
 * Retrieve a single annotation on any annotatable resource.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the annotated resource; it must match the
 *   annotation's own resource.
 * @param annotationId - ID of the annotation.
 */
export const fetchAnnotation = async (
    client: Http.Client,
    resourceId: string | number,
    annotationId: number,
    options: AnnotationResourceOptions = {}
): Promise<AnnotationDetail> =>
    Http.decode(
        AnnotationDetail,
        await Http.get(client, `/api/${options.resourceType ?? "sources"}/${resourceId}/annotations/${annotationId}`)
    );

/**
 * Options for a Gaia cross-match annotation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostGaiaAnnotationOptions {
    /**
     * Catalog key to record as the annotation origin. Defaults to
     * `"gaiadr3.gaia_source"`.
     */
    readonly catalog?: string | undefined;
    /** Cross-match radius in arcseconds. Defaults to the server config. */
    readonly crossmatchRadius?: number | undefined;
    /**
     * Ignore Gaia sources fainter than this G magnitude. Defaults to the
     * server config; pass `0` to keep sources of any magnitude.
     */
    readonly crossmatchLimmag?: number | undefined;
    /**
     * Maximum number of matches to keep, closest first after correcting for
     * proper motion. Defaults to the server config.
     */
    readonly crossmatchNumber?: number | undefined;
    /**
     * Restrict the annotations' visibility to these groups. If omitted, they
     * go to the public group.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Cross-match a source against Gaia and save the result as annotations.
 *
 * One annotation is created per Gaia match, holding the parallax, proper
 * motion, magnitudes and RUWE. Nothing is returned; read the annotations back
 * with {@link fetchAnnotations}.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source to cross-match.
 */
export const postGaiaAnnotation = async (
    client: Http.Client,
    objId: string,
    options: PostGaiaAnnotationOptions = {}
): Promise<void> => {
    await Http.post(
        client,
        `/api/sources/${objId}/annotations/gaia`,
        Http.body({
            catalog: options.catalog,
            crossmatchRadius: options.crossmatchRadius,
            crossmatchLimmag: options.crossmatchLimmag,
            crossmatchNumber: options.crossmatchNumber,
            group_ids: options.groupIds,
        })
    );
};

/**
 * Options for a catalog cross-match annotation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostCrossmatchAnnotationOptions {
    /** Catalog to query. */
    readonly catalog?: string | undefined;
    /** Cross-match radius in arcseconds. Defaults to 2. */
    readonly crossmatchRadius?: number | undefined;
    /**
     * Restrict the annotations' visibility to these groups. If omitted, they
     * go to the public group.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/** @internal */
const postCrossmatch = async (
    client: Http.Client,
    objId: string,
    service: string,
    options: PostCrossmatchAnnotationOptions
): Promise<void> => {
    await Http.post(
        client,
        `/api/sources/${objId}/annotations/${service}`,
        Http.body({
            catalog: options.catalog,
            crossmatchRadius: options.crossmatchRadius,
            group_ids: options.groupIds,
        })
    );
};

/**
 * Cross-match a source against an IRSA WISE catalog as annotations.
 *
 * One annotation is created per WISE match, holding the W1-W4 profile
 * magnitudes and their uncertainties. `catalog` defaults to
 * `"allwise_p3as_psd"`.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source to cross-match.
 */
export const postIrsaAnnotation = (
    client: Http.Client,
    objId: string,
    options: PostCrossmatchAnnotationOptions = {}
): Promise<void> => postCrossmatch(client, objId, "irsa", options);

/**
 * Cross-match a source against a Vizier catalog as annotations.
 *
 * `catalog` defaults to `"VII/290"`, the million quasar catalog. The query
 * must resolve to exactly one table.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source to cross-match.
 */
export const postVizierAnnotation = (
    client: Http.Client,
    objId: string,
    options: PostCrossmatchAnnotationOptions = {}
): Promise<void> => postCrossmatch(client, objId, "vizier", options);

/**
 * Cross-match a source against an Astro Data Lab catalog.
 *
 * One annotation is created per match, holding photometric redshifts, or
 * spectroscopic redshifts for DESI catalogs (any `catalog` starting with
 * `"desi_"`, which use a different schema). `catalog` defaults to
 * `"ls_dr10"`.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source to cross-match.
 */
export const postDatalabAnnotation = (
    client: Http.Client,
    objId: string,
    options: PostCrossmatchAnnotationOptions = {}
): Promise<void> => postCrossmatch(client, objId, "datalab", options);

/**
 * Options for a Pan-STARRS1 cross-match annotation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostPs1AnnotationOptions {
    /**
     * Catalog key to record as the annotation origin. Defaults to `"ps1.dr2"`;
     * the query itself always runs against DR2.
     */
    readonly catalog?: string | undefined;
    /** Cross-match radius in arcseconds. Defaults to 2 and must be between 0 and 5. */
    readonly crossmatchRadius?: number | undefined;
    /**
     * Ignore PS1 sources with fewer detections than this. Defaults to 1 and
     * must be at least 1.
     */
    readonly crossmatchMinDetections?: number | undefined;
    /**
     * Maximum number of matches to keep. Defaults to 5 and must be between 1
     * and 5.
     */
    readonly crossmatchNumber?: number | undefined;
    /**
     * Restrict the annotations' visibility to these groups. If omitted, they
     * go to the public group.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Cross-match a source against Pan-STARRS1 DR2 as annotations.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID of the source to cross-match.
 */
export const postPs1Annotation = async (
    client: Http.Client,
    objId: string,
    options: PostPs1AnnotationOptions = {}
): Promise<void> => {
    await Http.post(
        client,
        `/api/sources/${objId}/annotations/ps1`,
        Http.body({
            catalog: options.catalog,
            crossmatchRadius: options.crossmatchRadius,
            crossmatchMinDetections: options.crossmatchMinDetections,
            crossmatchNumber: options.crossmatchNumber,
            group_ids: options.groupIds,
        })
    );
};
