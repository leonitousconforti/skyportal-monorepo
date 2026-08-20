/**
 * Request and response models for `/api/allocation`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Instruments from "./Instruments.ts";
import * as Schemas from "./Schemas.ts";
import * as Telescopes from "./Telescopes.ts";
import * as Users from "./Users.ts";

/**
 * A join row mapping a user to an allocation (upstream `AllocationUser`).
 *
 * `allocation` stays untyped to avoid a recursive model.
 *
 * @since 1.0.0
 * @category Models
 */
export const AllocationUser = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        allocation_id: Schemas.NullishInteger,
        user_id: Schemas.NullishInteger,
        user: Schemas.nullish(Users.User),
        allocation: Schemas.nullish(Schemas.JsonObject),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AllocationUser = v.InferOutput<typeof AllocationUser>;

/**
 * What an allocation may be used for.
 *
 * @since 1.0.0
 * @category Models
 */
export const AllocationType = v.picklist([
    "triggered",
    "forced_photometry",
    "observation_plan",
]);

/**
 * @since 1.0.0
 * @category Models
 */
export type AllocationType = v.InferOutput<typeof AllocationType>;

/**
 * An observing-time allocation on an instrument (upstream `Allocation`).
 *
 * `allocation_users` is a list of plain users on the allocation endpoints (the
 * handlers substitute `allocation_user.user`) but a list of join rows when it
 * arrives nested inside a telescope payload, so both are accepted. `requests`,
 * `default_requests`, `default_observation_plans`, `catalog_queries`,
 * `observation_plans`, `gcn_triggers` and `group` stay untyped: those upstream
 * models point back at `Allocation`, so typing them would risk an import
 * cycle. `requests`, `ephemeris` and `telescope` are injected by the
 * single-allocation endpoint. The encrypted `_altdata` column is never
 * serialized.
 *
 * @since 1.0.0
 * @category Models
 */
export const Allocation = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        pi: Schemas.NullishString,
        proposal_id: Schemas.NullishString,
        hours_allocated: Schemas.NullishNumber,
        validity_ranges: Schemas.nullish(v.array(Schemas.JsonObject)),
        default_share_group_ids: Schemas.nullish(v.array(Schemas.Integer)),
        types: Schemas.nullish(v.array(AllocationType)),
        group_id: Schemas.NullishInteger,
        instrument_id: Schemas.NullishInteger,
        instrument: Schemas.nullish(Instruments.Instrument),
        allocation_users: Schemas.nullish(
            v.array(v.union([Users.User, AllocationUser]))
        ),
        group: Schemas.nullish(Schemas.JsonObject),
        requests: Schemas.nullish(v.array(Schemas.JsonObject)),
        default_requests: Schemas.nullish(v.array(Schemas.JsonObject)),
        default_observation_plans: Schemas.nullish(v.array(Schemas.JsonObject)),
        catalog_queries: Schemas.nullish(v.array(Schemas.JsonObject)),
        observation_plans: Schemas.nullish(v.array(Schemas.JsonObject)),
        gcn_triggers: Schemas.nullish(v.array(Schemas.JsonObject)),
        ephemeris: Schemas.nullish(Telescopes.Ephemeris),
        telescope: Schemas.nullish(Telescopes.Telescope),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type Allocation = v.InferOutput<typeof Allocation>;

/**
 * Payload for creating an allocation.
 *
 * `_altdata` holds the instrument API credentials and is validated by the
 * instrument's API class when it implements `validate_altdata`.
 * `allocation_admin_ids` lists the users allowed to administer the allocation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AllocationPost {
    readonly instrument_id: number;
    readonly group_id: number;
    readonly hours_allocated: number;
    readonly pi?: string | undefined;
    readonly proposal_id?: string | undefined;
    readonly types?: ReadonlyArray<string> | undefined;
    readonly validity_ranges?: ReadonlyArray<Record<string, unknown>> | undefined;
    readonly default_share_group_ids?: ReadonlyArray<number> | undefined;
    readonly allocation_admin_ids?: ReadonlyArray<number> | undefined;
    readonly _altdata?: Record<string, unknown> | undefined;
}

/**
 * Payload for updating an allocation; every field is optional.
 *
 * `_altdata` is merged into the stored value rather than replacing it.
 * `allocation_admin_ids` is authoritative: any admin not listed is removed, so
 * omitting it clears them all.
 *
 * @since 1.0.0
 * @category Models
 */
export interface AllocationUpdate {
    readonly instrument_id?: number | undefined;
    readonly group_id?: number | undefined;
    readonly hours_allocated?: number | undefined;
    readonly pi?: string | undefined;
    readonly proposal_id?: string | undefined;
    readonly types?: ReadonlyArray<string> | undefined;
    readonly validity_ranges?: ReadonlyArray<Record<string, unknown>> | undefined;
    readonly default_share_group_ids?: ReadonlyArray<number> | undefined;
    readonly allocation_admin_ids?: ReadonlyArray<number> | undefined;
    readonly _altdata?: Record<string, unknown> | undefined;
    readonly replace_altdata?: boolean | undefined;
}

/**
 * Result of creating an allocation.
 *
 * @since 1.0.0
 * @category Models
 */
export const AllocationPostResponse = Schemas.model(
    v.strictObject({ id: Schemas.Integer })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type AllocationPostResponse = v.InferOutput<typeof AllocationPostResponse>;
