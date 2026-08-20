/**
 * Typed endpoint functions for `/api/analysis_service` and
 * `/api/obj/analysis`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    AnalysisService,
    AnalysisServicePostResponse,
    ObjAnalysis,
    AnalysisPostResponse,
    AnalysisUploadResponse,
    DefaultAnalysis,
    DefaultAnalysisPostResponse,
    type AnalysisServicePost,
    type AnalysisServiceUpdate,
    type AnalysisPost,
    type AnalysisUploadPost,
    type DefaultAnalysisPost,
} from "skyportal-js-models/Analysis";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Analysis";

/**
 * Retrieve a single analysis service by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service.
 */
export const fetchAnalysisService = async (
    client: Http.Client,
    analysisServiceId: number
): Promise<AnalysisService> =>
    Http.decode(
        AnalysisService,
        await Http.get(client, `/api/analysis_service/${analysisServiceId}`)
    );

/**
 * Retrieve all analysis services visible to the token.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchAnalysisServices = async (
    client: Http.Client
): Promise<Array<AnalysisService>> =>
    Http.decode(
        v.array(AnalysisService),
        await Http.get(client, "/api/analysis_service")
    );

/**
 * Register a new analysis service.
 *
 * Requires the "Manage Analysis Services" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The service to register.
 */
export const postAnalysisService = async (
    client: Http.Client,
    payload: AnalysisServicePost
): Promise<AnalysisServicePostResponse> =>
    Http.decode(
        AnalysisServicePostResponse,
        await Http.post(client, "/api/analysis_service", Http.body(payload))
    );

/**
 * Update an analysis service.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 * Requires the "Manage Analysis Services" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service to update.
 * @param payload - The fields to update.
 */
export const updateAnalysisService = async (
    client: Http.Client,
    analysisServiceId: number,
    payload: AnalysisServiceUpdate
): Promise<void> => {
    await Http.patch(
        client,
        `/api/analysis_service/${analysisServiceId}`,
        Http.body(payload)
    );
};

/**
 * Delete an analysis service.
 *
 * Requires the "Manage Analysis Services" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service to delete.
 */
export const deleteAnalysisService = async (
    client: Http.Client,
    analysisServiceId: number
): Promise<void> => {
    await Http.del(client, `/api/analysis_service/${analysisServiceId}`);
};

/**
 * Retrieve a single default analysis by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service the default analysis
 *   belongs to.
 * @param defaultAnalysisId - ID of the default analysis.
 */
export const fetchDefaultAnalysis = async (
    client: Http.Client,
    analysisServiceId: number,
    defaultAnalysisId: number
): Promise<DefaultAnalysis> =>
    Http.decode(
        DefaultAnalysis,
        await Http.get(
            client,
            `/api/analysis_service/${analysisServiceId}/default_analysis/${defaultAnalysisId}`
        )
    );

/**
 * Retrieve the default analyses of an analysis service.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service.
 */
export const fetchDefaultAnalyses = async (
    client: Http.Client,
    analysisServiceId: number
): Promise<Array<DefaultAnalysis>> =>
    Http.decode(
        v.array(DefaultAnalysis),
        await Http.get(
            client,
            `/api/analysis_service/${analysisServiceId}/default_analysis`
        )
    );

/**
 * Create a default analysis for an analysis service.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service to attach the default
 *   analysis to.
 * @param payload - The default analysis to create.
 */
export const postDefaultAnalysis = async (
    client: Http.Client,
    analysisServiceId: number,
    payload: DefaultAnalysisPost
): Promise<DefaultAnalysisPostResponse> =>
    Http.decode(
        DefaultAnalysisPostResponse,
        await Http.post(
            client,
            `/api/analysis_service/${analysisServiceId}/default_analysis`,
            Http.body(payload)
        )
    );

/**
 * Update a default analysis.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service the default analysis
 *   belongs to.
 * @param defaultAnalysisId - ID of the default analysis to update.
 * @param payload - The fields to update.
 */
export const updateDefaultAnalysis = async (
    client: Http.Client,
    analysisServiceId: number,
    defaultAnalysisId: number,
    payload: DefaultAnalysisPost
): Promise<void> => {
    await Http.patch(
        client,
        `/api/analysis_service/${analysisServiceId}/default_analysis/${defaultAnalysisId}`,
        Http.body(payload)
    );
};

/**
 * Delete a default analysis.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisServiceId - ID of the analysis service the default analysis
 *   belongs to.
 * @param defaultAnalysisId - ID of the default analysis to delete.
 */
export const deleteDefaultAnalysis = async (
    client: Http.Client,
    analysisServiceId: number,
    defaultAnalysisId: number
): Promise<void> => {
    await Http.del(
        client,
        `/api/analysis_service/${analysisServiceId}/default_analysis/${defaultAnalysisId}`
    );
};

/**
 * Start an analysis run on an object.
 *
 * Requires the "Run Analyses" permission. The server assembles the input data,
 * calls the external service asynchronously, and returns the new analysis ID
 * immediately; poll {@link fetchAnalysis} for the status.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID to analyze.
 * @param analysisServiceId - ID of the analysis service to run. Must not be an
 *   upload-only service (use {@link postAnalysisUpload} for those).
 * @param payload - Run options.
 */
export const postAnalysis = async (
    client: Http.Client,
    objId: string,
    analysisServiceId: number,
    payload: AnalysisPost = {}
): Promise<AnalysisPostResponse> =>
    Http.decode(
        AnalysisPostResponse,
        await Http.post(
            client,
            `/api/obj/${objId}/analysis/${analysisServiceId}`,
            Http.body(payload)
        )
    );

/**
 * Options for retrieving a single analysis.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAnalysisOptions {
    /** Include the analysis data in the response; can be large. */
    readonly includeAnalysisData?: boolean | undefined;
    /** Include the server-side filename of the analysis data. */
    readonly includeFilename?: boolean | undefined;
}

/**
 * Retrieve a single analysis by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisId - ID of the analysis.
 */
export const fetchAnalysis = async (
    client: Http.Client,
    analysisId: number,
    options: FetchAnalysisOptions = {}
): Promise<ObjAnalysis> =>
    Http.decode(
        ObjAnalysis,
        await Http.get(client, `/api/obj/analysis/${analysisId}`, {
            includeAnalysisData: options.includeAnalysisData ?? false,
            includeFilename: options.includeFilename ?? false,
        })
    );

/**
 * Options for listing analyses.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAnalysesOptions {
    /** Restrict to analyses whose object ID contains this string. */
    readonly objId?: string | undefined;
    /** Restrict to analyses run with this analysis service. */
    readonly analysisServiceId?: number | undefined;
    /** Only return analyses from services with `is_summary` set. */
    readonly summaryOnly?: boolean | undefined;
    /**
     * Include the server-side filename of the analysis data. Only applies when
     * `objId` is provided.
     */
    readonly includeFilename?: boolean | undefined;
}

/**
 * Retrieve analyses, optionally restricted to one object.
 *
 * Without `objId`, the server returns a minimal record per analysis (IDs,
 * status, and timestamps only).
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchAnalyses = async (
    client: Http.Client,
    options: FetchAnalysesOptions = {}
): Promise<Array<ObjAnalysis>> =>
    Http.decode(
        v.array(ObjAnalysis),
        await Http.get(client, "/api/obj/analysis", {
            summaryOnly: options.summaryOnly ?? false,
            includeFilename: options.includeFilename ?? false,
            objID: options.objId,
            analysisServiceID: options.analysisServiceId,
        })
    );

/**
 * Delete an analysis and its stored data.
 *
 * Requires the "Run Analyses" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisId - ID of the analysis to delete.
 */
export const deleteAnalysis = async (
    client: Http.Client,
    analysisId: number
): Promise<void> => {
    await Http.del(client, `/api/obj/analysis/${analysisId}`);
};

/**
 * Upload results for an upload-only analysis service.
 *
 * Requires the "Run Analyses" permission. The analysis is stored as completed
 * without calling any external service.
 *
 * @since 1.0.0
 * @category Requests
 * @param objId - Object ID the analysis belongs to.
 * @param analysisServiceId - ID of the analysis service; must be an upload-only
 *   service.
 * @param payload - The results to store.
 */
export const postAnalysisUpload = async (
    client: Http.Client,
    objId: string,
    analysisServiceId: number,
    payload: AnalysisUploadPost
): Promise<AnalysisUploadResponse> =>
    Http.decode(
        AnalysisUploadResponse,
        await Http.post(
            client,
            `/api/obj/${objId}/analysis_upload/${analysisServiceId}`,
            Http.body(payload)
        )
    );

/**
 * Retrieve the results data of a completed analysis.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisId - ID of the analysis.
 */
export const fetchAnalysisResults = (
    client: Http.Client,
    analysisId: number
): Promise<unknown> => Http.get(client, `/api/obj/analysis/${analysisId}/results`);

/**
 * Download the results data of a completed analysis as a JSON file.
 *
 * Unlike {@link fetchAnalysisResults}, the server sends the results as a file
 * rather than inside the usual response envelope.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisId - ID of the analysis.
 */
export const fetchAnalysisResultsFile = (
    client: Http.Client,
    analysisId: number
): Promise<Uint8Array> =>
    Http.getContent(client, `/api/obj/analysis/${analysisId}/results`, {
        download: "true",
    });

/**
 * Options for downloading an analysis plot.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAnalysisPlotOptions {
    /**
     * Which plot to download, starting at 0. The number of available plots is
     * the `num_plots` field of {@link fetchAnalysis}.
     */
    readonly plotNumber?: number | undefined;
}

/**
 * Download one plot produced by an analysis.
 *
 * @since 1.0.0
 * @category Requests
 * @param analysisId - ID of the analysis.
 */
export const fetchAnalysisPlot = (
    client: Http.Client,
    analysisId: number,
    options: FetchAnalysisPlotOptions = {}
): Promise<Uint8Array> =>
    Http.getContent(
        client,
        `/api/obj/analysis/${analysisId}/plots/${options.plotNumber ?? 0}`
    );
