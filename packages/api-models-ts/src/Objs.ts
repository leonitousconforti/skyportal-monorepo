/**
 * Request and response models for `/api/objs` and related endpoints.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * A photometry-derived position for an object (upstream `Obj`).
 *
 * @since 1.0.0
 * @category Models
 */
export const ObjPosition = Schemas.model(
    v.strictObject({
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
        gal_lon: Schemas.NullishNumber,
        gal_lat: Schemas.NullishNumber,
        ebv: Schemas.NullishNumber,
        separation: Schemas.NullishNumber,
        discovery_ra: Schemas.NullishNumber,
        discovery_dec: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type ObjPosition = v.InferOutput<typeof ObjPosition>;

/**
 * An object linked to a super-object, with its position (upstream `Obj`).
 *
 * @since 1.0.0
 * @category Models
 */
export const SuperObjMember = Schemas.model(
    v.strictObject({
        id: v.string(),
        ra: Schemas.NullishNumber,
        dec: Schemas.NullishNumber,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SuperObjMember = v.InferOutput<typeof SuperObjMember>;

/**
 * Several objects that are one astrophysical source (upstream `SuperObj`).
 *
 * The handler builds this dict by hand: `modified` and the full `Obj` rows
 * behind `objs` exist upstream but are not returned.
 *
 * @since 1.0.0
 * @category Models
 */
export const SuperObj = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        name: Schemas.NullishString,
        is_roid: Schemas.NullishBoolean,
        created_at: Schemas.NullishTimestamp,
        objs: Schemas.list(SuperObjMember),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SuperObj = v.InferOutput<typeof SuperObj>;

/**
 * Result of creating a super-object.
 *
 * @since 1.0.0
 * @category Models
 */
export const SuperObjPostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type SuperObjPostResponse = v.InferOutput<typeof SuperObjPostResponse>;
