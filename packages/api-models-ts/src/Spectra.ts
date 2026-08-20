/**
 * Request and response models for spectra.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Annotations from "./Annotations.ts";
import * as Comments from "./Comments.ts";
import * as Groups from "./Groups.ts";
import * as Instruments from "./Instruments.ts";
import * as Schemas from "./Schemas.ts";
import * as Users from "./Users.ts";

/**
 * The fields of a spectrum of a source (upstream `Spectrum`).
 *
 * `obj` stays free-form: typing it as {@link skyportal-js/Sources!Source}
 * would make spectra -> sources -> spectra a circular import.
 * `instrument_name`, `telescope_id`, `telescope_name`, `comments`,
 * `annotations` and the `external_*` names are injected by the handlers rather
 * than being columns, and the `external_*` keys are only present when the
 * spectrum records an external PI/reducer/observer. `original_file_string` is
 * deferred server-side and only returned when explicitly requested.
 *
 * @since 1.0.0
 * @category Models
 */
export const SpectrumEntries = {
    id: Schemas.Integer,
    created_at: Schemas.NullishTimestamp,
    modified: Schemas.NullishTimestamp,
    obj_id: Schemas.NullishString,
    obj: Schemas.nullish(Schemas.JsonObject),
    observed_at: Schemas.NullishTimestamp,
    wavelengths: Schemas.list(v.number()),
    fluxes: Schemas.list(v.number()),
    errors: Schemas.nullish(v.array(v.number())),
    units: Schemas.NullishString,
    origin: Schemas.NullishString,
    type: Schemas.NullishString,
    label: Schemas.NullishString,
    instrument_id: Schemas.NullishInteger,
    instrument: Schemas.nullish(Instruments.Instrument),
    instrument_name: Schemas.NullishString,
    telescope_id: Schemas.NullishInteger,
    telescope_name: Schemas.NullishString,
    followup_request_id: Schemas.NullishInteger,
    assignment_id: Schemas.NullishInteger,
    altdata: Schemas.nullish(Schemas.JsonObject),
    original_file_string: Schemas.NullishString,
    original_file_filename: Schemas.NullishString,
    owner_id: Schemas.NullishInteger,
    owner: Schemas.nullish(Users.User),
    groups: Schemas.list(Groups.Group),
    pis: Schemas.list(Users.User),
    reducers: Schemas.list(Users.User),
    observers: Schemas.list(Users.User),
    external_pi: Schemas.NullishString,
    external_reducer: Schemas.NullishString,
    external_observer: Schemas.NullishString,
    comments: Schemas.list(Comments.CommentDetail),
    annotations: Schemas.list(Annotations.AnnotationDetail),
};

/**
 * A spectrum of a source (upstream `Spectrum`).
 *
 * Returned by `GET /api/spectrum/{id}` and by
 * `GET /api/sources/{objId}/spectra`; the latter additionally injects
 * `observed_at_mjd` and adds a `gravatar_url` to each comment's author.
 *
 * @since 1.0.0
 * @category Models
 */
export const Spectrum = Schemas.model(
    v.strictObject({
        ...SpectrumEntries,
        observed_at_mjd: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Spectrum = v.InferOutput<typeof Spectrum>;

/**
 * A spectrum with the full payload the server can attach to it.
 *
 * Returned by `GET /api/spectra` and `GET /api/spectra/range`. The range
 * endpoint serializes the spectrum row on its own, so only the columns are
 * present there, and `minimalPayload` on `GET /api/spectra` strips everything
 * but the metadata columns.
 *
 * @since 1.0.0
 * @category Models
 */
export const SpectrumDetail = Schemas.model(v.strictObject(SpectrumEntries));

/**
 * @since 1.0.0
 * @category Models
 */
export type SpectrumDetail = v.InferOutput<typeof SpectrumDetail>;

/**
 * Payload for posting a spectrum.
 *
 * `observed_at` is an ISO-format (UTC) timestamp. If `group_ids` is omitted,
 * the server applies its default visibility; the string `"all"` shares the
 * spectrum with every group the token can access. Setting `external_pi`,
 * `external_reducer` or `external_observer` requires the matching `pi`,
 * `reduced_by` or `observed_by` list of user IDs.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SpectrumPost {
    readonly obj_id: string;
    readonly instrument_id: number;
    readonly observed_at: string;
    readonly wavelengths: ReadonlyArray<number>;
    readonly fluxes: ReadonlyArray<number>;
    readonly errors?: ReadonlyArray<number> | undefined;
    readonly units?: string | undefined;
    readonly origin?: string | undefined;
    readonly type?: string | undefined;
    readonly label?: string | undefined;
    readonly altdata?: Record<string, unknown> | undefined;
    readonly followup_request_id?: number | undefined;
    readonly assignment_id?: number | undefined;
    readonly group_ids?: ReadonlyArray<number> | "all" | undefined;
    readonly pi?: ReadonlyArray<number> | undefined;
    readonly external_pi?: string | undefined;
    readonly reduced_by?: ReadonlyArray<number> | undefined;
    readonly external_reducer?: string | undefined;
    readonly observed_by?: ReadonlyArray<number> | undefined;
    readonly external_observer?: string | undefined;
}

/**
 * Result of posting a spectrum.
 *
 * @since 1.0.0
 * @category Models
 */
export const SpectrumPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type SpectrumPostResponse = v.InferOutput<typeof SpectrumPostResponse>;

/**
 * A spectrum parsed from ASCII but not saved to the database.
 *
 * The parse endpoint returns an unsaved `Spectrum`, so only the attributes the
 * parser set are present: no `id`, `created_at` or `modified`, and no
 * `units`/`origin`/`followup_request_id`/`assignment_id`, which are only set
 * when a spectrum is saved.
 *
 * @since 1.0.0
 * @category Models
 */
export const ParsedSpectrum = Schemas.model(
    v.strictObject({
        id: Schemas.NullishInteger,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        obj_id: Schemas.NullishString,
        observed_at: Schemas.NullishTimestamp,
        wavelengths: Schemas.list(v.number()),
        fluxes: Schemas.list(v.number()),
        errors: Schemas.nullish(v.array(v.number())),
        units: Schemas.NullishString,
        origin: Schemas.NullishString,
        type: Schemas.NullishString,
        label: Schemas.NullishString,
        instrument_id: Schemas.NullishInteger,
        followup_request_id: Schemas.NullishInteger,
        assignment_id: Schemas.NullishInteger,
        altdata: Schemas.nullish(Schemas.JsonObject),
        original_file_string: Schemas.NullishString,
        original_file_filename: Schemas.NullishString,
        owner_id: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ParsedSpectrum = v.InferOutput<typeof ParsedSpectrum>;

/**
 * Payload for updating a spectrum; every field is optional.
 *
 * Omitted fields are left unchanged. `group_ids` only ever adds groups (it
 * never removes them) and accepts the string `"all"` to share with every group
 * the token can access. Setting `external_pi`, `external_reducer` or
 * `external_observer` requires the matching `pi`, `reduced_by` or
 * `observed_by` list of user IDs.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SpectrumUpdate {
    readonly obj_id?: string | undefined;
    readonly instrument_id?: number | undefined;
    readonly observed_at?: string | undefined;
    readonly wavelengths?: ReadonlyArray<number> | undefined;
    readonly fluxes?: ReadonlyArray<number> | undefined;
    readonly errors?: ReadonlyArray<number> | undefined;
    readonly units?: string | undefined;
    readonly origin?: string | undefined;
    readonly type?: string | undefined;
    readonly label?: string | undefined;
    readonly altdata?: Record<string, unknown> | undefined;
    readonly followup_request_id?: number | undefined;
    readonly assignment_id?: number | undefined;
    readonly group_ids?: ReadonlyArray<number> | "all" | undefined;
    readonly pi?: ReadonlyArray<number> | undefined;
    readonly external_pi?: string | undefined;
    readonly reduced_by?: ReadonlyArray<number> | undefined;
    readonly external_reducer?: string | undefined;
    readonly observed_by?: ReadonlyArray<number> | undefined;
    readonly external_observer?: string | undefined;
}

/**
 * Payload for parsing an ASCII spectrum without saving it.
 *
 * The file must hold at least two columns and be smaller than 10MB; a leading
 * `#` header is parsed into `altdata`. Column indices are 0-based and default
 * to 0 for wavelengths and 1 for fluxes, with no error column.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SpectrumAsciiParse {
    readonly ascii: string;
    readonly wave_column?: number | undefined;
    readonly flux_column?: number | undefined;
    readonly fluxerr_column?: number | undefined;
}

/**
 * Payload for uploading a spectrum from an ASCII file.
 *
 * If `group_ids` is omitted, the server applies its default visibility; the
 * string `"all"` shares the spectrum with the public group. Setting
 * `external_pi`, `external_reducer` or `external_observer` requires the
 * matching `pi`, `reduced_by` or `observed_by` list of user IDs.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SpectrumAsciiPost {
    readonly ascii: string;
    readonly obj_id: string;
    readonly instrument_id: number;
    readonly observed_at: string;
    /** The original file name, kept for bookkeeping. */
    readonly filename: string;
    readonly wave_column?: number | undefined;
    readonly flux_column?: number | undefined;
    readonly fluxerr_column?: number | undefined;
    readonly type?: string | undefined;
    readonly label?: string | undefined;
    readonly group_ids?: ReadonlyArray<number> | "all" | undefined;
    readonly pi?: ReadonlyArray<number> | undefined;
    readonly external_pi?: string | undefined;
    readonly reduced_by?: ReadonlyArray<number> | undefined;
    readonly external_reducer?: string | undefined;
    readonly observed_by?: ReadonlyArray<number> | undefined;
    readonly external_observer?: string | undefined;
    readonly followup_request_id?: number | undefined;
    readonly assignment_id?: number | undefined;
}

/**
 * Phase anchors for one source in a bulk spectra response.
 *
 * @since 1.0.0
 * @category Models
 */
export const BulkSpectraSource = Schemas.model(
    v.strictObject({
        id: v.string(),
        redshift: Schemas.NullishNumber,
        first_detected_mjd: Schemas.NullishNumber,
        peak_mjd: Schemas.NullishNumber,
        tns_discovery_date: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BulkSpectraSource = v.InferOutput<typeof BulkSpectraSource>;

/**
 * A slim spectrum returned by the bulk spectra endpoint.
 *
 * @since 1.0.0
 * @category Models
 */
export const BulkSpectrum = Schemas.model(
    v.strictObject({
        obj_id: Schemas.NullishString,
        observed_at: Schemas.NullishString,
        wavelengths: Schemas.list(v.number()),
        fluxes: Schemas.list(v.number()),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BulkSpectrum = v.InferOutput<typeof BulkSpectrum>;

/**
 * Result of a bulk spectra query.
 *
 * @since 1.0.0
 * @category Models
 */
export const BulkSpectraResponse = Schemas.model(
    v.strictObject({
        sources: Schemas.list(BulkSpectraSource),
        spectra: Schemas.list(BulkSpectrum),
        truncated: v.optional(v.boolean(), false),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BulkSpectraResponse = v.InferOutput<typeof BulkSpectraResponse>;
