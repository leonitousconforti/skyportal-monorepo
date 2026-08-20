/**
 * Typed endpoint functions for `/api/survey_efficiency`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    SurveyEfficiencyForObservations,
    SurveyEfficiencyForObservationPlan,
    DefaultSurveyEfficiencyRequest,
    DefaultSurveyEfficiencyPostResponse,
} from "skyportal-js-models/SurveyEfficiency";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/SurveyEfficiency";

/**
 * Retrieve a single survey efficiency analysis of executed observations.
 *
 * @since 1.0.0
 * @category Requests
 * @param surveyEfficiencyAnalysisId - ID of the analysis, as returned by
 *   {@link skyportal-js/Observations!fetchObservationSimSurvey}.
 */
export const fetchSurveyEfficiencyForObservations = async (
    client: Http.Client,
    surveyEfficiencyAnalysisId: number
): Promise<SurveyEfficiencyForObservations> =>
    Http.decode(
        SurveyEfficiencyForObservations,
        await Http.get(
            client,
            `/api/survey_efficiency/observations/${surveyEfficiencyAnalysisId}`
        )
    );

/**
 * Options for listing observation-based efficiency analyses.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSurveyEfficienciesForObservationsOptions {
    /**
     * Only return analyses for this GCN event. If omitted, analyses for all
     * accessible events are returned.
     */
    readonly gcneventId?: number | undefined;
}

/**
 * Retrieve the survey efficiency analyses of executed observations.
 *
 * Only analyses visible to the requesting user's groups are returned.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSurveyEfficienciesForObservations = async (
    client: Http.Client,
    options: FetchSurveyEfficienciesForObservationsOptions = {}
): Promise<Array<SurveyEfficiencyForObservations>> =>
    Http.decode(
        v.array(SurveyEfficiencyForObservations),
        await Http.get(client, "/api/survey_efficiency/observations", {
            gcnevent_id: options.gcneventId,
        })
    );

/**
 * Retrieve a single survey efficiency analysis of an observation plan.
 *
 * @since 1.0.0
 * @category Requests
 * @param surveyEfficiencyAnalysisId - ID of the analysis, as returned by
 *   {@link skyportal-js/ObservationPlans!fetchObservationPlanSimSurvey}.
 */
export const fetchSurveyEfficiencyForObservationPlan = async (
    client: Http.Client,
    surveyEfficiencyAnalysisId: number
): Promise<SurveyEfficiencyForObservationPlan> =>
    Http.decode(
        SurveyEfficiencyForObservationPlan,
        await Http.get(
            client,
            `/api/survey_efficiency/observation_plan/${surveyEfficiencyAnalysisId}`
        )
    );

/**
 * Options for listing plan-based efficiency analyses.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchSurveyEfficienciesForObservationPlanOptions {
    /**
     * Only return analyses for this event observation plan (the generated
     * plan, not the observation plan request). If omitted, all accessible
     * analyses are returned.
     */
    readonly observationPlanId?: number | undefined;
}

/**
 * Retrieve the survey efficiency analyses of observation plans.
 *
 * Only analyses visible to the requesting user's groups are returned.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchSurveyEfficienciesForObservationPlan = async (
    client: Http.Client,
    options: FetchSurveyEfficienciesForObservationPlanOptions = {}
): Promise<Array<SurveyEfficiencyForObservationPlan>> =>
    Http.decode(
        v.array(SurveyEfficiencyForObservationPlan),
        await Http.get(client, "/api/survey_efficiency/observation_plan", {
            observation_plan_id: options.observationPlanId,
        })
    );

/**
 * Options for a default survey efficiency request.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostDefaultSurveyEfficiencyOptions {
    /**
     * Content of the survey efficiency analysis (simulation parameters such as
     * `numberInjections`, `numberDetections`, `detectionThreshold` and
     * `modelName`).
     */
    readonly payload?: Record<string, unknown> | undefined;
}

/**
 * Create a default survey efficiency request.
 *
 * The analysis is run automatically whenever the referenced default
 * observation plan generates a plan.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultObservationplanRequestId - ID of the default observation plan
 *   request to attach the analysis to. It must be readable by the requesting
 *   user.
 */
export const postDefaultSurveyEfficiency = async (
    client: Http.Client,
    defaultObservationplanRequestId: number,
    options: PostDefaultSurveyEfficiencyOptions = {}
): Promise<DefaultSurveyEfficiencyPostResponse> =>
    Http.decode(
        DefaultSurveyEfficiencyPostResponse,
        await Http.post(
            client,
            "/api/default_survey_efficiency",
            Http.body({
                default_observationplan_request_id: defaultObservationplanRequestId,
                payload: options.payload,
            })
        )
    );

/**
 * Retrieve a single default survey efficiency request by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultSurveyEfficiencyId - ID of the default survey efficiency
 *   request.
 */
export const fetchDefaultSurveyEfficiency = async (
    client: Http.Client,
    defaultSurveyEfficiencyId: number
): Promise<DefaultSurveyEfficiencyRequest> =>
    Http.decode(
        DefaultSurveyEfficiencyRequest,
        await Http.get(
            client,
            `/api/default_survey_efficiency/${defaultSurveyEfficiencyId}`
        )
    );

/**
 * Retrieve all accessible default survey efficiency requests.
 *
 * Each request includes its parent default observation plan request under
 * `default_observationplan_request`.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchDefaultSurveyEfficiencies = async (
    client: Http.Client
): Promise<Array<DefaultSurveyEfficiencyRequest>> =>
    Http.decode(
        v.array(DefaultSurveyEfficiencyRequest),
        await Http.get(client, "/api/default_survey_efficiency")
    );

/**
 * Delete a default survey efficiency request.
 *
 * @since 1.0.0
 * @category Requests
 * @param defaultSurveyEfficiencyId - ID of the default survey efficiency
 *   request to delete.
 */
export const deleteDefaultSurveyEfficiency = async (
    client: Http.Client,
    defaultSurveyEfficiencyId: number
): Promise<void> => {
    await Http.del(
        client,
        `/api/default_survey_efficiency/${defaultSurveyEfficiencyId}`
    );
};
