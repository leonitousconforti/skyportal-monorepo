/**
 * Request and response models for `/api/skymap_trigger`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * The skymap-based triggers currently queued on a remote facility.
 *
 * There is no upstream SQLAlchemy model: the names come straight back from the
 * instrument's remote observation plan API.
 *
 * @since 1.0.0
 * @category Models
 */
export const SkymapTriggerQueue = Schemas.model(
    v.strictObject({
        trigger_names: Schemas.list(v.string()),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SkymapTriggerQueue = v.InferOutput<typeof SkymapTriggerQueue>;
