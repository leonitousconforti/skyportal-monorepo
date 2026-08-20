/**
 * Request and response models for the instance introspection endpoints.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * One parsed commit from the deployed SkyPortal git log.
 *
 * @since 1.0.0
 * @category Models
 */
export const GitLogEntry = Schemas.model(
    v.strictObject({
        time: Schemas.NullishString,
        sha: Schemas.NullishString,
        email: Schemas.NullishString,
        description: Schemas.NullishString,
        pr_nr: Schemas.NullishString,
        pr_url: Schemas.NullishString,
        commit_url: Schemas.NullishString,
        name: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type GitLogEntry = v.InferOutput<typeof GitLogEntry>;

/**
 * System and deployment information for the SkyPortal instance.
 *
 * @since 1.0.0
 * @category Models
 */
export const SysInfo = Schemas.model(
    v.strictObject({ gitlog: Schemas.list(GitLogEntry) })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type SysInfo = v.InferOutput<typeof SysInfo>;

/**
 * Basic health information about the instance's database.
 *
 * @since 1.0.0
 * @category Models
 */
export const DbInfo = Schemas.model(
    v.strictObject({
        source_table_empty: Schemas.NullishBoolean,
        postgres_version: Schemas.NullishString,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type DbInfo = v.InferOutput<typeof DbInfo>;
