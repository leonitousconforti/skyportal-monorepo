/**
 * Typed endpoint functions for `/api/observation_plan`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    ObservationPlanRequest,
    ObservationPlanRequestsPage,
    AllocationObservationPlansPage,
    ObservationPlanIdsResponse,
    ObservationPlanManualPostResponse,
    ObservationPlanGeoJson,
    ObservationPlanSimSurveyResponse,
    DefaultObservationPlanPostResponse,
    DefaultObservationPlanRequest,
    type ObservationPlanPost,
    type ObservationPlanManualPost,
    type DefaultObservationPlanPost,
} from "skyportal-js-models/ObservationPlans";
import * as SurveyEfficiency from "skyportal-js-models/SurveyEfficiency";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/ObservationPlans";

/**
 * Submit an observation plan request.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The request to submit.
 */
export const postObservationPlan = async (
    client: Http.Client,
    payload: ObservationPlanPost
): Promise<ObservationPlanIdsResponse> =>
    Http.decode(
        ObservationPlanIdsResponse,
        await Http.post(client, "/api/observation_plan", Http.body(payload))
    );

/**
 * Options for a batch of observation plan requests.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostObservationPlansOptions {
    /** Generate the plans jointly (combined) instead of independently. */
    readonly combinePlans?: boolean | undefined;
}

/**
 * Submit several observation plan requests in one call.
 *
 * @since 1.0.0
 * @category Requests
 * @param payloads - The requests to submit. Each `payload` must contain a
 *   unique `queue_name` key and a valid `filters` key.
 */
export const postObservationPlans = async (
    client: Http.Client,
    payloads: ReadonlyArray<ObservationPlanPost>,
    options: PostObservationPlansOptions = {}
): Promise<ObservationPlanIdsResponse> =>
    Http.decode(
        ObservationPlanIdsResponse,
        await Http.post(client, "/api/observation_plan", {
            observation_plans: payloads.map((payload) => Http.body(payload)),
            combine_plans: options.combinePlans ?? false,
        })
    );

/**
 * Options for retrieving a single observation plan request.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchObservationPlanOptions {
    /**
     * Include the planned observations (with fields and rise/set times) of
     * each associated observation plan.
     */
    readonly includePlannedObservations?: boolean | undefined;
}

/**
 * Retrieve a single observation plan request by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request.
 */
export const fetchObservationPlan = async (
    client: Http.Client,
    observationPlanRequestId: number,
    options: FetchObservationPlanOptions = {}
): Promise<ObservationPlanRequest> =>
    Http.decode(
        ObservationPlanRequest,
        await Http.get(client, `/api/observation_plan/${observationPlanRequestId}`, {
            includePlannedObservations:
                options.includePlannedObservations === true ? true : undefined,
        })
    );

/**
 * Retrieve an observation plan's first plan in Rubin-compatible format.
 *
 * The response shape is defined by Rubin's scheduler rather than by SkyPortal,
 * so it is returned unmodelled.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request.
 */
export const fetchObservationPlanRubin = (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<unknown> =>
    Http.get(client, `/api/observation_plan/${observationPlanRequestId}`, {
        includePlannedObservations: true,
        rubinFormat: true,
    });

/**
 * Options for querying observation plan requests.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchObservationPlansOptions {
    /** Pagination controls; the server caps the page size. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /** Restrict to plans for the GCN event with this `dateobs`. */
    readonly dateobs?: string | undefined;
    /** Restrict to plans whose allocation uses this instrument. */
    readonly instrumentId?: number | undefined;
    /**
     * Restrict to requests created in this date range, as arrow-parseable date
     * strings, e.g. `"2020-01-01"`.
     */
    readonly startDate?: string | undefined;
    readonly endDate?: string | undefined;
    /** Restrict to requests whose status contains this string. */
    readonly status?: string | undefined;
    /** Include the planned observations of each observation plan. */
    readonly includePlannedObservations?: boolean | undefined;
}

/**
 * Query observation plan requests, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchObservationPlans = async (
    client: Http.Client,
    options: FetchObservationPlansOptions = {}
): Promise<ObservationPlanRequestsPage> =>
    Http.decode(
        ObservationPlanRequestsPage,
        await Http.get(client, "/api/observation_plan", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 100,
            dateobs: options.dateobs,
            instrumentID: options.instrumentId,
            startDate: options.startDate,
            endDate: options.endDate,
            status: options.status,
            includePlannedObservations:
                options.includePlannedObservations === true ? true : undefined,
        })
    );

/**
 * Delete an observation plan request.
 *
 * Plans already submitted to the telescope queue cannot be deleted.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   delete.
 */
export const deleteObservationPlan = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<void> => {
    await Http.del(client, `/api/observation_plan/${observationPlanRequestId}`);
};

/**
 * Submit a manually-built observation plan.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The plan to submit.
 */
export const postObservationPlanManual = async (
    client: Http.Client,
    payload: ObservationPlanManualPost
): Promise<ObservationPlanManualPostResponse> =>
    Http.decode(
        ObservationPlanManualPostResponse,
        await Http.post(client, "/api/observation_plan/manual", Http.body(payload))
    );

/**
 * Retrieve all distinct observation plan names.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchObservationPlanNames = async (
    client: Http.Client
): Promise<Array<string>> =>
    Http.decode(
        v.array(v.string()),
        await Http.get(client, "/api/observation_plan/plan_names")
    );

/** @internal */
const PlanNameExists = v.object({ exists: v.boolean() });

/**
 * Check whether an observation plan name is already in use.
 *
 * Also matches queue names of pending observation plan requests.
 *
 * @since 1.0.0
 * @category Requests
 * @param name - The plan name to check.
 */
export const fetchObservationPlanNameExists = async (
    client: Http.Client,
    name: string
): Promise<boolean> =>
    Http.decode(
        PlanNameExists,
        await Http.get(client, "/api/observation_plan/plan_names", { name })
    ).exists;

/**
 * Submit an observation plan's pointings to treasuremap.space.
 *
 * Requires a `TREASUREMAP_API_TOKEN` in the allocation's `altdata` and a
 * TreasureMap instrument ID on the instrument.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   submit.
 */
export const postObservationPlanTreasuremap = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<void> => {
    await Http.post(
        client,
        `/api/observation_plan/${observationPlanRequestId}/treasuremap`
    );
};

/**
 * Remove an observation plan's pointings from treasuremap.space.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request whose
 *   pointings to cancel.
 */
export const deleteObservationPlanTreasuremap = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<void> => {
    await Http.del(
        client,
        `/api/observation_plan/${observationPlanRequestId}/treasuremap`
    );
};

/**
 * Retrieve a GCN-circular-style text summary of an observation plan.
 *
 * Requires the plan to have computed statistics.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   summarize.
 */
export const fetchObservationPlanGcn = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<string> =>
    Http.decode(
        v.string(),
        await Http.get(client, `/api/observation_plan/${observationPlanRequestId}/gcn`)
    );

/**
 * Submit an observation plan request to the telescope queue.
 *
 * The plan must have status `"complete"` and at least one planned observation;
 * otherwise the server returns no data and this resolves to `null`.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   submit.
 */
export const postObservationPlanQueue = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<ObservationPlanRequest | null> => {
    const data = await Http.post(
        client,
        `/api/observation_plan/${observationPlanRequestId}/queue`
    );
    return data === null || data === undefined
        ? null
        : Http.decode(ObservationPlanRequest, data);
};

/**
 * Remove an observation plan request from the telescope queue.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   remove from the queue.
 */
export const deleteObservationPlanQueue = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<ObservationPlanRequest> =>
    Http.decode(
        ObservationPlanRequest,
        await Http.del(
            client,
            `/api/observation_plan/${observationPlanRequestId}/queue`
        )
    );

/**
 * Download an animated GIF of an observation plan's coverage.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   animate.
 */
export const fetchObservationPlanMovie = (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<Uint8Array> =>
    Http.getContent(client, `/api/observation_plan/${observationPlanRequestId}/movie`);

/**
 * Options for a simsurvey efficiency analysis of an observation plan.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchObservationPlanSimSurveyOptions {
    /** Number of simulated transients to inject. Defaults to 1000. */
    readonly numberOfInjections?: number | undefined;
    /**
     * Number of detections required to count a transient as detected. Defaults
     * to 1.
     */
    readonly numberOfDetections?: number | undefined;
    /** Detection threshold in sigmas. Defaults to 5. */
    readonly detectionThreshold?: number | undefined;
    /**
     * Phase range (days post event) in which to consider detections. Defaults
     * to 0 and 3.
     */
    readonly minimumPhase?: number | undefined;
    readonly maximumPhase?: number | undefined;
    /**
     * Model to simulate; one of `"kilonova"` (the default), `"afterglow"` or
     * `"linear"`.
     */
    readonly modelName?: string | undefined;
    /**
     * Extra model-specific injection parameters, JSON-encoded into the query
     * string.
     */
    readonly optionalInjectionParameters?: Record<string, unknown> | undefined;
    /**
     * Groups that may view the analysis. Defaults to all of the token's
     * groups.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Start a simsurvey efficiency analysis for an observation plan.
 *
 * The analysis runs asynchronously server-side; the returned ID identifies the
 * resulting survey efficiency analysis.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request to
 *   analyze.
 */
export const fetchObservationPlanSimSurvey = async (
    client: Http.Client,
    observationPlanRequestId: number,
    options: FetchObservationPlanSimSurveyOptions = {}
): Promise<ObservationPlanSimSurveyResponse> =>
    Http.decode(
        ObservationPlanSimSurveyResponse,
        await Http.get(
            client,
            `/api/observation_plan/${observationPlanRequestId}/simsurvey`,
            {
                numberInjections: options.numberOfInjections ?? 1000,
                numberDetections: options.numberOfDetections ?? 1,
                detectionThreshold: options.detectionThreshold ?? 5,
                minimumPhase: options.minimumPhase ?? 0,
                maximumPhase: options.maximumPhase ?? 3,
                modelName: options.modelName ?? "kilonova",
                optionalInjectionParameters:
                    options.optionalInjectionParameters === undefined
                        ? undefined
                        : JSON.stringify(options.optionalInjectionParameters),
                group_ids: Http.commaSeparated(options.groupIds),
            }
        )
    );

/**
 * Delete a simsurvey efficiency analysis.
 *
 * @since 1.0.0
 * @category Requests
 * @param surveyEfficiencyAnalysisId - ID of the survey efficiency analysis (not
 *   the observation plan request) to delete.
 */
export const deleteObservationPlanSimSurvey = async (
    client: Http.Client,
    surveyEfficiencyAnalysisId: number
): Promise<void> => {
    await Http.del(
        client,
        `/api/observation_plan/${surveyEfficiencyAnalysisId}/simsurvey`
    );
};

/**
 * Download a PDF summary plot of a simsurvey efficiency analysis.
 *
 * The analysis must have completed (light curves available).
 *
 * @since 1.0.0
 * @category Requests
 * @param surveyEfficiencyAnalysisId - ID of the survey efficiency analysis (not
 *   the observation plan request) to plot.
 */
export const fetchObservationPlanSimSurveyPlot = (
    client: Http.Client,
    surveyEfficiencyAnalysisId: number
): Promise<Uint8Array> =>
    Http.getContent(
        client,
        `/api/observation_plan/${surveyEfficiencyAnalysisId}/simsurvey/plot`
    );

/**
 * Retrieve the GeoJSON field contours of an observation plan.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request.
 */
export const fetchObservationPlanGeoJson = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<ObservationPlanGeoJson> =>
    Http.decode(
        ObservationPlanGeoJson,
        await Http.get(
            client,
            `/api/observation_plan/${observationPlanRequestId}/geojson`
        )
    );

/**
 * Retrieve the survey efficiency analyses of an observation plan.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request.
 */
export const fetchObservationPlanSurveyEfficiency = async (
    client: Http.Client,
    observationPlanRequestId: number
): Promise<Array<SurveyEfficiency.SurveyEfficiencyForObservationPlan>> =>
    Http.decode(
        v.array(SurveyEfficiency.SurveyEfficiencyForObservationPlan),
        await Http.get(
            client,
            `/api/observation_plan/${observationPlanRequestId}/survey_efficiency`
        )
    );

/**
 * Options for creating an observing run from an observation plan.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostObservationPlanObservingRunOptions {
    /**
     * Groups to save the field sources to. Defaults to the allocation's group.
     */
    readonly groupIds?: ReadonlyArray<number> | undefined;
}

/**
 * Create an observing run from an observation plan's fields.
 *
 * Each planned field is saved as a source and assigned to a new observing run
 * on the allocation's instrument.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request.
 */
export const postObservationPlanObservingRun = async (
    client: Http.Client,
    observationPlanRequestId: number,
    options: PostObservationPlanObservingRunOptions = {}
): Promise<void> => {
    await Http.post(
        client,
        `/api/observation_plan/${observationPlanRequestId}/observing_run`,
        Http.body({ groupIds: options.groupIds })
    );
};

/**
 * Delete selected fields from an observation plan.
 *
 * @since 1.0.0
 * @category Requests
 * @param observationPlanRequestId - ID of the observation plan request.
 * @param fieldIds - Database IDs of the fields whose planned observations to
 *   remove.
 */
export const deleteObservationPlanFields = async (
    client: Http.Client,
    observationPlanRequestId: number,
    fieldIds: ReadonlyArray<number>
): Promise<void> => {
    await Http.del(client, `/api/observation_plan/${observationPlanRequestId}/fields`, {
        fieldIds,
    });
};

/**
 * Create a default observation plan request.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The default plan to create.
 */
export const postDefaultObservationPlan = async (
    client: Http.Client,
    payload: DefaultObservationPlanPost
): Promise<DefaultObservationPlanPostResponse> =>
    Http.decode(
        DefaultObservationPlanPostResponse,
        await Http.post(client, "/api/default_observation_plan", Http.body(payload))
    );

/**
 * Retrieve a single default observation plan request by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultObservationPlanId - ID of the default observation plan request.
 */
export const fetchDefaultObservationPlan = async (
    client: Http.Client,
    defaultObservationPlanId: number
): Promise<DefaultObservationPlanRequest> =>
    Http.decode(
        DefaultObservationPlanRequest,
        await Http.get(
            client,
            `/api/default_observation_plan/${defaultObservationPlanId}`
        )
    );

/**
 * Retrieve all default observation plan requests.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchDefaultObservationPlans = async (
    client: Http.Client
): Promise<Array<DefaultObservationPlanRequest>> =>
    Http.decode(
        v.array(DefaultObservationPlanRequest),
        await Http.get(client, "/api/default_observation_plan")
    );

/**
 * Delete a default observation plan request.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultObservationPlanId - ID of the default observation plan request
 *   to delete.
 */
export const deleteDefaultObservationPlan = async (
    client: Http.Client,
    defaultObservationPlanId: number
): Promise<void> => {
    await Http.del(client, `/api/default_observation_plan/${defaultObservationPlanId}`);
};

/**
 * Options for listing an allocation's observation plan requests.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAllocationObservationPlansOptions {
    /** Pagination controls; the server caps the page size. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /**
     * Field to sort by; one of `"created_at"`, `"modified"`, `"status"` or
     * `"gcnevent_id"`.
     */
    readonly sortBy?: string | undefined;
    /** `"asc"` or `"desc"`. */
    readonly sortOrder?: string | undefined;
}

/**
 * Retrieve the observation plan requests under an allocation.
 *
 * @since 1.0.0
 * @category Requests
 * @param allocationId - ID of the allocation.
 */
export const fetchAllocationObservationPlans = async (
    client: Http.Client,
    allocationId: number,
    options: FetchAllocationObservationPlansOptions = {}
): Promise<AllocationObservationPlansPage> =>
    Http.decode(
        AllocationObservationPlansPage,
        await Http.get(client, `/api/allocation/observation_plans/${allocationId}`, {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 50,
            sortBy: options.sortBy ?? "created_at",
            sortOrder: options.sortOrder ?? "asc",
        })
    );
