/**
 * Typed endpoint functions for `/api/moving_object`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Http from "./Http.ts";
import { MovingObjectObservation } from "skyportal-js-models/MovingObjects";
import type { MovingObjectFollowupPost } from "skyportal-js-models/MovingObjects";

export * from "skyportal-js-models/MovingObjects";

/**
 * Find a continuous sequence of observations for a moving object.
 *
 * The object's ephemeris is looked up by name and matched against the
 * instrument's fields; `exposure_count` exposures are then scheduled at the
 * optimal times inside the requested window. An empty list is returned when no
 * observable sequence long enough exists.
 *
 * @since 1.0.0
 * @category Requests
 * @param objName - Name of the moving object, e.g. `"2024 YR4"`.
 * @param payload - The request.
 */
export const postMovingObjectFollowup = async (
    client: Http.Client,
    objName: string,
    payload: MovingObjectFollowupPost
): Promise<Array<MovingObjectObservation>> =>
    Http.decode(
        v.array(MovingObjectObservation),
        await Http.post(client, `/api/moving_object/${objName}/followup`, Http.body(payload))
    );
