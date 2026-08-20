/**
 * Request and response models for `/api/brokers`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";
import * as Streams from "./Streams.ts";

/**
 * The registered `BrokerAPI` provider classes (upstream `BROKERS`).
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerClassname = v.picklist([
    "GENERICBROKER",
    "LASAIRBROKER",
    "BABAMULBROKER",
    "BOOMBROKER",
    "FINKBROKER",
    "ALERCEBROKER",
    "ANTARESBROKER",
    "PITTGOOGLEBROKER",
    "AMPELBROKER",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerClassname = v.InferOutput<typeof BrokerClassname>;

/**
 * How a provider models filters, so a client can pick an editor.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilterKind = v.picklist(["pipeline", "query", "tags", "none"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilterKind = v.InferOutput<typeof BrokerFilterKind>;

/**
 * What a broker's provider class implements (upstream `implements()`).
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerCapabilities = Schemas.model(
    v.strictObject({
        query_alerts: Schemas.NullishBoolean,
        get_alert: Schemas.NullishBoolean,
        get_cutouts: Schemas.NullishBoolean,
        cone_search: Schemas.NullishBoolean,
        get_filters: Schemas.NullishBoolean,
        create_filter: Schemas.NullishBoolean,
        update_filter: Schemas.NullishBoolean,
        delete_filter: Schemas.NullishBoolean,
        test_filter: Schemas.NullishBoolean,
        validate_filter: Schemas.NullishBoolean,
        filter_modules: Schemas.NullishBoolean,
        run_ingestion: Schemas.NullishBoolean,
        validate_config: Schemas.NullishBoolean,
        test_connection: Schemas.NullishBoolean,
        save_as_source: Schemas.NullishBoolean,
        get_photometry: Schemas.NullishBoolean,
        /**
         * Whether `cone_search` returns reference catalogs. A data-semantics flag
         * rather than a method.
         */
        cross_match_catalogs: Schemas.NullishBoolean,
        /**
         * The dialect `test_filter` expects its pipeline in; null when the
         * provider takes no pipeline at all.
         */
        filter_pipeline: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerCapabilities = v.InferOutput<typeof BrokerCapabilities>;

/**
 * A configured connection to an external alert broker (upstream `Broker`).
 *
 * The endpoints hand-build this dict rather than calling `to_dict()`, so
 * `created_at`/`modified` are never returned even though the upstream row
 * carries them. `altdata` is only present for system admins, with the
 * provider's secret config fields stripped out.
 *
 * @since 1.0.0
 * @category Models
 */
export const Broker = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        name: Schemas.NullishString,
        broker_classname: Schemas.nullish(BrokerClassname),
        active: Schemas.NullishBoolean,
        default_alert_search: Schemas.NullishBoolean,
        default_crossmatch: Schemas.NullishBoolean,
        capabilities: Schemas.nullish(BrokerCapabilities),
        surveys: Schemas.list(v.string()),
        filter_kind: Schemas.nullish(BrokerFilterKind),
        /** Free-form per-instance provider configuration (endpoints, credentials). */
        altdata: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Broker = v.InferOutput<typeof Broker>;

/**
 * Payload for registering a broker.
 *
 * `broker_classname` must be a registered provider class name.
 *
 * @since 1.0.0
 * @category Models
 */
export interface BrokerPost {
    readonly name: string;
    readonly broker_classname: BrokerClassname;
    readonly altdata?: Record<string, unknown> | undefined;
    readonly active?: boolean | undefined;
    readonly default_alert_search?: boolean | undefined;
    readonly default_crossmatch?: boolean | undefined;
}

/**
 * Result of registering a broker.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerPostResponse = v.InferOutput<typeof BrokerPostResponse>;

/**
 * One editable version of a broker filter, as stored on the filter row.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilterVersion = Schemas.model(
    v.strictObject({
        fid: Schemas.nullish(v.union([v.string(), Schemas.Integer])),
        /**
         * The version tree the broker's own filter language defines; SkyPortal
         * stores it verbatim, so its shape is the provider's, not SkyPortal's.
         */
        version: Schemas.nullish(Schemas.Json),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilterVersion = v.InferOutput<typeof BrokerFilterVersion>;

/**
 * A SkyPortal `Filter` as listed by the broker endpoints.
 *
 * The handlers hand-build this dict, so it carries a strict subset of the
 * upstream `Filter` columns and never `created_at`/`modified`. `altdata` stays
 * free-form: it holds the broker-side ids and the compiled native filter,
 * whose shape the broker defines.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilter = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        name: Schemas.NullishString,
        group_id: Schemas.NullishInteger,
        stream_id: Schemas.NullishInteger,
        broker_id: Schemas.NullishInteger,
        autosave: Schemas.NullishBoolean,
        altdata: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilter = v.InferOutput<typeof BrokerFilter>;

/**
 * A broker filter enriched with its broker-side versions and state.
 *
 * `stream` is trimmed by the handler to the stream's `id` and `name`. `fv`
 * comes straight back from the broker, so its entries are shaped by the
 * provider rather than by SkyPortal. The `fv`/`active_fid`/`active`/`filters`
 * block is dropped entirely when the broker is unreachable or the filter has
 * no broker-side counterpart.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilterDetail = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        name: Schemas.NullishString,
        group_id: Schemas.NullishInteger,
        broker_id: Schemas.NullishInteger,
        autosave: Schemas.NullishBoolean,
        stream: Schemas.nullish(Streams.Stream),
        altdata: Schemas.nullish(Schemas.JsonObject),
        fv: Schemas.nullish(v.array(Schemas.JsonObject)),
        active_fid: Schemas.nullish(v.union([v.string(), Schemas.Integer])),
        active: Schemas.NullishBoolean,
        filters: Schemas.nullish(v.array(BrokerFilterVersion)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilterDetail = v.InferOutput<typeof BrokerFilterDetail>;

/**
 * One page of results from the broker filter catalog.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFiltersPage = Schemas.model(
    v.strictObject({
        filters: Schemas.list(BrokerFilter),
        totalMatches: v.optional(Schemas.Integer, 0),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFiltersPage = v.InferOutput<typeof BrokerFiltersPage>;

/**
 * A saved query for a broker whose `filter_kind` is `"query"`.
 *
 * @since 1.0.0
 * @category Models
 */
export interface BrokerFilterQuery {
    readonly selected: string;
    readonly tables: string;
    readonly conditions?: string | undefined;
}

/**
 * Result of creating a broker filter version.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilterPostResponse = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        altdata: Schemas.nullish(Schemas.JsonObject),
        autosave: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilterPostResponse = v.InferOutput<typeof BrokerFilterPostResponse>;

/**
 * Result of attaching a filter to a broker.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilterAttachResponse = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        broker_id: Schemas.NullishInteger,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilterAttachResponse = v.InferOutput<typeof BrokerFilterAttachResponse>;

/**
 * Verdict of a broker filter version validation.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerFilterValidation = Schemas.model(
    v.strictObject({
        fid: Schemas.nullish(v.union([v.string(), Schemas.Integer])),
        passed: Schemas.NullishBoolean,
        message: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerFilterValidation = v.InferOutput<typeof BrokerFilterValidation>;

/**
 * Result of saving a broker alert as a source.
 *
 * @since 1.0.0
 * @category Models
 */
export const BrokerAlertSaveResponse = Schemas.model(v.strictObject({ id: v.string() }));

/**
 * @since 1.0.0
 * @category Models
 */
export type BrokerAlertSaveResponse = v.InferOutput<typeof BrokerAlertSaveResponse>;
