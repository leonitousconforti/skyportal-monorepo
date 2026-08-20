/**
 * Request and response models for `/api/instrument`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";
import * as Telescopes from "./Telescopes.ts";

/**
 * One field (pointing) of an instrument (upstream `InstrumentField`).
 *
 * `contour` and `contour_summary` are deferred server-side and only present
 * when the request asked for GeoJSON. `airmass` is injected by the instrument
 * endpoint when the fields are sliced by a localization.
 *
 * @since 1.0.0
 * @category Models
 */
export const InstrumentField = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        instrument_id: Schemas.NullishInteger,
        field_id: Schemas.NullishInteger,
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        contour: Schemas.nullish(Schemas.JsonObject),
        contour_summary: Schemas.nullish(Schemas.JsonObject),
        reference_filters: Schemas.nullish(v.array(v.string())),
        reference_filter_mags: Schemas.nullish(v.array(v.number())),
        tiles: Schemas.nullish(v.array(Schemas.JsonObject)),
        airmass: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type InstrumentField = v.InferOutput<typeof InstrumentField>;

/**
 * The kind of instrument.
 *
 * @since 1.0.0
 * @category Models
 */
export const InstrumentType = v.picklist(["imager", "spectrograph", "imaging spectrograph"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type InstrumentType = v.InferOutput<typeof InstrumentType>;

/**
 * A SkyPortal instrument (upstream `Instrument`).
 *
 * `allocations` stays untyped: {@link skyportal-js/Allocations!Allocation}
 * points back at `Instrument`, so typing it here would create an import cycle.
 * `log_exists`, `number_of_fields` and `region_summary` are injected by the
 * instrument endpoints rather than being columns.
 *
 * @since 1.0.0
 * @category Models
 */
export const Instrument = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        type: Schemas.nullish(InstrumentType),
        band: Schemas.NullishString,
        telescope_id: Schemas.NullishInteger,
        telescope: Schemas.nullish(Telescopes.Telescope),
        filters: Schemas.list(v.string()),
        sensitivity_data: Schemas.nullish(Schemas.JsonObject),
        configuration_data: Schemas.nullish(Schemas.JsonObject),
        status: Schemas.nullish(Schemas.JsonObject),
        last_status_update: Schemas.NullishTimestamp,
        api_classname: Schemas.NullishString,
        api_classname_obsplan: Schemas.NullishString,
        listener_classname: Schemas.NullishString,
        treasuremap_id: Schemas.NullishInteger,
        tns_id: Schemas.NullishInteger,
        across_id: Schemas.NullishString,
        region: Schemas.NullishString,
        has_fields: Schemas.NullishBoolean,
        has_region: Schemas.NullishBoolean,
        fields: Schemas.nullish(v.array(InstrumentField)),
        allocations: Schemas.nullish(v.array(Schemas.JsonObject)),
        log_exists: Schemas.NullishBoolean,
        number_of_fields: Schemas.NullishInteger,
        region_summary: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Instrument = v.InferOutput<typeof Instrument>;

/**
 * A log uploaded for an instrument (upstream `InstrumentLog`).
 *
 * @since 1.0.0
 * @category Models
 */
export const InstrumentLog = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        instrument_id: Schemas.NullishInteger,
        instrument: Schemas.nullish(Instrument),
        start_date: Schemas.NullishTimestamp,
        end_date: Schemas.NullishTimestamp,
        log: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type InstrumentLog = v.InferOutput<typeof InstrumentLog>;

/**
 * Per-field data for an instrument, mapping `ID`, `RA` and `Dec` to per-field
 * lists, or the equivalent as a CSV string.
 *
 * @since 1.0.0
 * @category Models
 */
export type FieldData = Record<string, ReadonlyArray<unknown>> | string;

/**
 * Payload for creating an instrument.
 *
 * `type` must be one of `"imager"`, `"spectrograph"`, or `"imaging
 * spectrograph"`, and the instrument name must be unique for the telescope.
 * `sensitivity_data` and `configuration_data` are keyed by filter name, and
 * `sensitivity_data` filters must be a subset of `filters`. Supply at most one
 * of `field_region` (a serialized ds9 region) or `field_fov_type` (`"circle"`
 * or `"rectangle"`, which requires `field_fov_attributes`: a radius, or a
 * width and a height, in degrees). `field_data` requires one of the two region
 * options; the fields themselves are generated asynchronously after the
 * response is returned. `references` maps `field` and `filter` (and optionally
 * `limmag`) to per-reference lists.
 *
 * @since 1.0.0
 * @category Models
 */
export interface InstrumentPost {
    readonly name: string;
    readonly type: string;
    readonly telescope_id: number;
    readonly band?: string | undefined;
    readonly filters?: ReadonlyArray<string> | undefined;
    readonly sensitivity_data?: Record<string, unknown> | undefined;
    readonly configuration_data?: Record<string, unknown> | undefined;
    readonly api_classname?: string | undefined;
    readonly api_classname_obsplan?: string | undefined;
    readonly listener_classname?: string | undefined;
    readonly treasuremap_id?: number | undefined;
    readonly tns_id?: number | undefined;
    readonly across_id?: string | undefined;
    readonly region?: string | undefined;
    readonly field_data?: FieldData | undefined;
    readonly field_region?: string | undefined;
    readonly field_fov_type?: string | undefined;
    readonly field_fov_attributes?: ReadonlyArray<number> | number | undefined;
    readonly references?: FieldData | undefined;
}

/**
 * Payload for updating an instrument.
 *
 * @since 1.0.0
 * @category Models
 */
export interface InstrumentPut {
    readonly name?: string | undefined;
    readonly type?: string | undefined;
    readonly telescope_id?: number | undefined;
    readonly band?: string | undefined;
    readonly filters?: ReadonlyArray<string> | undefined;
    readonly sensitivity_data?: Record<string, unknown> | undefined;
    readonly configuration_data?: Record<string, unknown> | undefined;
    readonly api_classname?: string | undefined;
    readonly api_classname_obsplan?: string | undefined;
    readonly listener_classname?: string | undefined;
    readonly treasuremap_id?: number | undefined;
    readonly tns_id?: number | undefined;
    readonly across_id?: string | undefined;
    readonly region?: string | undefined;
    readonly field_data?: FieldData | undefined;
    readonly field_region?: string | undefined;
    readonly field_fov_type?: string | undefined;
    readonly field_fov_attributes?: ReadonlyArray<number> | number | undefined;
    readonly references?: FieldData | undefined;
}

/**
 * Result of creating an instrument.
 *
 * @since 1.0.0
 * @category Models
 */
export const InstrumentPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type InstrumentPostResponse = v.InferOutput<typeof InstrumentPostResponse>;

/**
 * Result of uploading an instrument log.
 *
 * @since 1.0.0
 * @category Models
 */
export const InstrumentLogPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type InstrumentLogPostResponse = v.InferOutput<typeof InstrumentLogPostResponse>;
