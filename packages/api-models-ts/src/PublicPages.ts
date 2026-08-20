/**
 * Request and response models for `/api/public_pages`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Groups from "./Groups.ts";
import * as Schemas from "./Schemas.ts";

/**
 * Whether one data section of a public source page is published.
 *
 * @since 1.0.0
 * @category Models
 */
export const PublicSectionVisibility = v.picklist(["public", "private", "no data"]);

/**
 * @since 1.0.0
 * @category Models
 */
export type PublicSectionVisibility = v.InferOutput<typeof PublicSectionVisibility>;

/**
 * Visibility state of each data section of a public source page.
 *
 * @since 1.0.0
 * @category Models
 */
export const PublicSourcePageOptions = Schemas.model(
    v.strictObject({
        photometry: Schemas.nullish(PublicSectionVisibility),
        classifications: Schemas.nullish(PublicSectionVisibility),
        spectroscopy: Schemas.nullish(PublicSectionVisibility),
        summary: Schemas.nullish(PublicSectionVisibility),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PublicSourcePageOptions = v.InferOutput<typeof PublicSourcePageOptions>;

/**
 * A published snapshot of a source (upstream `PublicSourcePage`).
 *
 * Upstream overrides `to_dict` to return exactly these keys, so the `data`,
 * `is_auto_published` and `release_id` columns and the `release` relationship
 * never reach the client; `release_link_name` is derived from the release
 * instead.
 *
 * @since 1.0.0
 * @category Models
 */
export const PublicSourcePage = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        source_id: Schemas.NullishString,
        release_link_name: Schemas.NullishString,
        is_visible: Schemas.NullishBoolean,
        created_at: Schemas.NullishTimestamp,
        hash: Schemas.NullishString,
        options: Schemas.nullish(PublicSourcePageOptions),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PublicSourcePage = v.InferOutput<typeof PublicSourcePage>;

/**
 * Result of publishing a public source page.
 *
 * @since 1.0.0
 * @category Models
 */
export const PublicSourcePagePostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type PublicSourcePagePostResponse = v.InferOutput<typeof PublicSourcePagePostResponse>;

/**
 * A public release of source pages (upstream `PublicRelease`).
 *
 * `group_ids` is injected by the handler and lists only the owning groups the
 * calling user can access; `groups` and `source_pages` are relationships that
 * only appear when a handler eager-loads them.
 *
 * @since 1.0.0
 * @category Models
 */
export const PublicRelease = Schemas.model(
    v.strictObject({
        id: Schemas.Integer,
        created_at: Schemas.NullishTimestamp,
        modified: Schemas.NullishTimestamp,
        name: Schemas.NullishString,
        link_name: Schemas.NullishString,
        description: Schemas.NullishString,
        is_visible: Schemas.NullishBoolean,
        auto_publish_enabled: Schemas.NullishBoolean,
        options: Schemas.nullish(Schemas.JsonObject),
        group_ids: Schemas.list(Schemas.Integer),
        groups: Schemas.nullish(v.array(Groups.Group)),
        source_pages: Schemas.nullish(v.array(PublicSourcePage)),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type PublicRelease = v.InferOutput<typeof PublicRelease>;

/**
 * Payload for creating a public release.
 *
 * `link_name` must be URL-safe (alphanumerics, dashes, underscores, periods
 * and plus signs only) and unique across releases. `is_visible` defaults to
 * true and `auto_publish_enabled` to false.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PublicReleasePost {
    readonly name: string;
    readonly link_name: string;
    readonly group_ids: ReadonlyArray<number>;
    readonly description?: string | undefined;
    readonly options?: Record<string, unknown> | undefined;
    readonly is_visible?: boolean | undefined;
    readonly auto_publish_enabled?: boolean | undefined;
}

/**
 * Payload for updating a public release.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PublicReleaseUpdate {
    readonly name: string;
    readonly group_ids: ReadonlyArray<number>;
    readonly description?: string | undefined;
    readonly options?: Record<string, unknown> | undefined;
    readonly is_visible?: boolean | undefined;
    readonly auto_publish_enabled?: boolean | undefined;
}

/**
 * Result of creating a public release.
 *
 * @since 1.0.0
 * @category Models
 */
export const PublicReleasePostResponse = Schemas.model(v.strictObject({ id: Schemas.Integer }));

/**
 * @since 1.0.0
 * @category Models
 */
export type PublicReleasePostResponse = v.InferOutput<typeof PublicReleasePostResponse>;
