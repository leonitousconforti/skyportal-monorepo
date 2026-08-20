/**
 * Request and response models for `/api/analysis_service` and
 * `/api/obj/analysis`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * What an analysis service computes.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnalysisType = v.picklist([
    "lightcurve_fitting",
    "spectrum_fitting",
    "meta_analysis",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type AnalysisType = v.InferOutput<typeof AnalysisType>;

/**
 * A kind of input an analysis service consumes.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnalysisInputType = v.picklist([
    "photometry",
    "spectra",
    "redshift",
    "annotations",
    "comments",
    "classifications",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type AnalysisInputType = v.InferOutput<typeof AnalysisInputType>;

/**
 * How SkyPortal authenticates against an analysis service.
 *
 * @since 1.0.0
 * @category Models
 */
export const AuthenticationType = v.picklist([
    "none",
    "header_token",
    "api_key",
    "HTTPBasicAuth",
    "HTTPDigestAuth",
    "OAuth1",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type AuthenticationType = v.InferOutput<typeof AuthenticationType>;

/**
 * The lifecycle state of an analysis run.
 *
 * @since 1.0.0
 * @category Models
 */
export const WebhookStatus = v.picklist([
    "queued",
    "pending",
    "completed",
    "failure",
    "cancelled",
    "timed_out",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type WebhookStatus = v.InferOutput<typeof WebhookStatus>;

/**
 * An external analysis service (upstream `AnalysisService`).
 *
 * `_authinfo` is an underscore-prefixed column and so is never part of
 * `to_dict()`; the `obj_analyses` and `default_analyses` backrefs are never
 * eager-loaded by the handlers.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnalysisService = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        display_name: Schemas.NullishString,
        description: Schemas.NullishString,
        version: Schemas.NullishString,
        contact_name: Schemas.NullishString,
        contact_email: Schemas.NullishString,
        url: Schemas.NullishString,
        optional_analysis_parameters: Schemas.nullish(
            v.union([Schemas.JsonObject, v.string()])
        ),
        authentication_type: Schemas.nullish(AuthenticationType),
        enabled: Schemas.NullishBoolean,
        analysis_type: Schemas.nullish(AnalysisType),
        input_data_types: Schemas.list(AnalysisInputType),
        timeout: Schemas.NullishNumber,
        upload_only: Schemas.NullishBoolean,
        display_on_resource_dropdown: Schemas.NullishBoolean,
        is_summary: Schemas.NullishBoolean,
        groups: Schemas.list(Groups.Group),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AnalysisService = v.InferOutput<typeof AnalysisService>;

/**
 * Payload for registering a new analysis service.
 *
 * `optional_analysis_parameters` and `_authinfo` must be JSON-encoded strings;
 * `_authinfo` is required unless `authentication_type` is `"none"`. If
 * `group_ids` is omitted, the service is made accessible to all of the token's
 * groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AnalysisServicePost {
    readonly name: string;
    readonly url: string;
    readonly authentication_type: AuthenticationType;
    readonly analysis_type: AnalysisType;
    readonly input_data_types: ReadonlyArray<AnalysisInputType>;
    readonly display_name?: string | undefined;
    readonly description?: string | undefined;
    readonly version?: string | undefined;
    readonly contact_name?: string | undefined;
    readonly contact_email?: string | undefined;
    readonly optional_analysis_parameters?: string | undefined;
    readonly _authinfo?: string | undefined;
    readonly enabled?: boolean | undefined;
    readonly timeout?: number | undefined;
    readonly upload_only?: boolean | undefined;
    readonly is_summary?: boolean | undefined;
    readonly display_on_resource_dropdown?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Payload for a partial update of an analysis service.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AnalysisServiceUpdate {
    readonly name?: string | undefined;
    readonly url?: string | undefined;
    readonly authentication_type?: AuthenticationType | undefined;
    readonly analysis_type?: AnalysisType | undefined;
    readonly input_data_types?: ReadonlyArray<AnalysisInputType> | undefined;
    readonly display_name?: string | undefined;
    readonly description?: string | undefined;
    readonly version?: string | undefined;
    readonly contact_name?: string | undefined;
    readonly contact_email?: string | undefined;
    readonly optional_analysis_parameters?: string | undefined;
    readonly authinfo?: Record<string, unknown> | undefined;
    readonly enabled?: boolean | undefined;
    readonly timeout?: number | undefined;
    readonly upload_only?: boolean | undefined;
    readonly is_summary?: boolean | undefined;
    readonly display_on_resource_dropdown?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of registering an analysis service.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnalysisServicePostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AnalysisServicePostResponse = v.InferOutput<
    typeof AnalysisServicePostResponse
>;

/**
 * An analysis run on an object (upstream `ObjAnalysis`).
 *
 * `_unique_id` and `_full_name` are underscore-prefixed columns and so never
 * appear in `to_dict()`; `_full_name` is surfaced separately as `filename`
 * when `includeFilename` is set.
 *
 * `analysis_service_name`, `analysis_service_description`, `num_plots`,
 * `filename`, `data`, `model_lightcurve`, `model_lightcurves`, `model_name`
 * and `n_detections` are injected by the handler rather than being columns.
 * The listing endpoint without `objID` returns only `id`, `obj_id`, `status`,
 * `status_message`, `created_at`, `last_activity` and `analysis_service_id`
 * (plus the two service-name keys).
 *
 * @since 1.0.0
 * @category Models
 */
export const ObjAnalysis = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        author_id: Schemas.NullishInteger,
        analysis_service_id: Schemas.NullishInteger,
        hash: Schemas.NullishString,
        show_parameters: Schemas.NullishBoolean,
        show_plots: Schemas.NullishBoolean,
        show_corner: Schemas.NullishBoolean,
        analysis_parameters: Schemas.nullish(Schemas.JsonObject),
        input_filters: Schemas.nullish(Schemas.JsonObject),
        invalid_after: Schemas.NullishTimestamp,
        token: Schemas.NullishString,
        handled_by_url: Schemas.NullishString,
        status: Schemas.nullish(WebhookStatus),
        status_message: Schemas.NullishString,
        duration: Schemas.NullishNumber,
        last_activity: Schemas.NullishTimestamp,
        analysis_service_name: Schemas.NullishString,
        analysis_service_description: Schemas.NullishString,
        num_plots: Schemas.NullishInteger,
        filename: Schemas.NullishString,
        groups: Schemas.list(Groups.Group),
        data: Schemas.nullish(Schemas.JsonObject),
        model_lightcurve: Schemas.nullish(Schemas.Json),
        model_lightcurves: Schemas.nullish(Schemas.Json),
        model_name: Schemas.NullishString,
        n_detections: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObjAnalysis = v.InferOutput<typeof ObjAnalysis>;

/**
 * Payload for starting an analysis run.
 *
 * `analysis_parameters` keys must be declared by the service's
 * `optional_analysis_parameters`. If `group_ids` is omitted, results are
 * visible to all of the token's groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AnalysisPost {
    readonly analysis_parameters?: Record<string, unknown> | undefined;
    readonly show_parameters?: boolean | undefined;
    readonly show_plots?: boolean | undefined;
    readonly show_corner?: boolean | undefined;
    readonly input_filters?: Record<string, unknown> | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of starting an analysis run.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnalysisPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AnalysisPostResponse = v.InferOutput<typeof AnalysisPostResponse>;

/**
 * Payload for uploading results to an upload-only analysis service.
 *
 * `analysis` holds the results data (e.g. `{ results: ... }`); `message`
 * becomes the status message. If `group_ids` is omitted, results are visible
 * to all of the token's groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AnalysisUploadPost {
    readonly analysis?: Record<string, unknown> | undefined;
    readonly message?: string | undefined;
    readonly show_parameters?: boolean | undefined;
    readonly show_plots?: boolean | undefined;
    readonly show_corner?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of uploading an upload-only analysis.
 *
 * @since 1.0.0
 * @category Models
 */
export const AnalysisUploadResponse = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        message: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AnalysisUploadResponse = v.InferOutput<typeof AnalysisUploadResponse>;

/**
 * A default analysis (upstream `DefaultAnalysis`).
 *
 * The handler eager-loads `groups`, `author` and `analysis_service`.
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultAnalysis = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        analysis_service_id: Schemas.NullishInteger,
        author_id: Schemas.NullishInteger,
        show_parameters: Schemas.NullishBoolean,
        show_plots: Schemas.NullishBoolean,
        show_corner: Schemas.NullishBoolean,
        default_analysis_parameters: Schemas.nullish(Schemas.JsonObject),
        source_filter: Schemas.nullish(Schemas.JsonObject),
        stats: Schemas.nullish(Schemas.JsonObject),
        groups: Schemas.list(Groups.Group),
        author: Schemas.nullish(Users.User),
        analysis_service: Schemas.nullish(AnalysisService),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultAnalysis = v.InferOutput<typeof DefaultAnalysis>;

/**
 * Payload for creating or updating a default analysis.
 *
 * `daily_limit` defaults to 10 and must be between 1 and 1000. If `group_ids`
 * is omitted, the server uses all of the token's groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface DefaultAnalysisPost {
    readonly default_analysis_parameters?: Record<string, unknown> | undefined;
    readonly source_filter?: Record<string, unknown> | undefined;
    readonly daily_limit?: number | undefined;
    readonly show_parameters?: boolean | undefined;
    readonly show_plots?: boolean | undefined;
    readonly show_corner?: boolean | undefined;
    readonly group_ids?: ReadonlyArray<number> | undefined;
}

/**
 * Result of creating a default analysis.
 *
 * @since 1.0.0
 * @category Models
 */
export const DefaultAnalysisPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DefaultAnalysisPostResponse = v.InferOutput<
    typeof DefaultAnalysisPostResponse
>;
