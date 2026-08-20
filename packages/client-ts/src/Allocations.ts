/**
 * Typed endpoint functions for `/api/allocation`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Allocation,
    AllocationPostResponse,
    type AllocationPost,
    type AllocationUpdate,
} from "skyportal-js-models/Allocations";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Allocations";

/**
 * Options for listing allocations.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAllocationsOptions {
    /** Restrict to allocations on this instrument. */
    readonly instrumentId?: number | undefined;
    /**
     * Restrict to allocations whose instrument has the given API type set:
     * `"api_classname"` or `"api_classname_obsplan"`.
     */
    readonly apiType?: string | undefined;
    /**
     * Restrict to allocations whose instrument API implements this method,
     * e.g. `"submit"` or `"retrieve"`. Requires `apiType`.
     */
    readonly apiImplements?: string | undefined;
}

/**
 * Retrieve the allocations visible to the token.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchAllocations = async (
    client: Http.Client,
    options: FetchAllocationsOptions = {}
): Promise<Array<Allocation>> =>
    Http.decode(
        v.array(Allocation),
        await Http.get(client, "/api/allocation", {
            instrument_id: options.instrumentId,
            apiType: options.apiType,
            apiImplements: options.apiImplements,
        })
    );

/**
 * Options for retrieving a single allocation.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAllocationOptions {
    /** Pagination controls over `requests`; the server caps the page size. */
    readonly pageNumber?: number | undefined;
    readonly numPerPage?: number | undefined;
    /**
     * Field to sort `requests` by; one of `"created_at"`, `"modified"`,
     * `"status"` or `"obj"`.
     */
    readonly sortBy?: string | undefined;
    /** `"asc"` or `"desc"`. */
    readonly sortOrder?: string | undefined;
}

/** @internal */
const AllocationEnvelope = v.object({ allocation: Allocation });

/**
 * Retrieve a single allocation by ID.
 *
 * The response embeds the allocation's follow-up requests in `requests`; the
 * pagination and sort parameters apply to that list. (The wire response also
 * carries the total request count in a `totalMatches` sibling key, which this
 * function drops.)
 *
 * @since 1.0.0
 * @category Requests
 * @param allocationId - ID of the allocation.
 */
export const fetchAllocation = async (
    client: Http.Client,
    allocationId: number,
    options: FetchAllocationOptions = {}
): Promise<Allocation> =>
    Http.decode(
        AllocationEnvelope,
        await Http.get(client, `/api/allocation/${allocationId}`, {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage ?? 50,
            sortBy: options.sortBy ?? "created_at",
            sortOrder: options.sortOrder ?? "asc",
        })
    ).allocation;

/**
 * Create an allocation on a robotic instrument.
 *
 * Requires the "Manage allocations" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The allocation to create.
 */
export const postAllocation = async (
    client: Http.Client,
    payload: AllocationPost
): Promise<AllocationPostResponse> =>
    Http.decode(
        AllocationPostResponse,
        await Http.post(client, "/api/allocation", Http.body(payload))
    );

/**
 * Update an allocation.
 *
 * Requires the "Manage allocations" permission.
 *
 * @since 1.0.0
 * @category Requests
 * @param allocationId - ID of the allocation to update.
 * @param payload - Fields to change.
 */
export const updateAllocation = async (
    client: Http.Client,
    allocationId: number,
    payload: AllocationUpdate
): Promise<void> => {
    await Http.put(client, `/api/allocation/${allocationId}`, Http.body(payload));
};

/**
 * Delete an allocation.
 *
 * @since 1.0.0
 * @category Requests
 * @param allocationId - ID of the allocation to delete. Requires the "Manage
 *   allocations" permission.
 */
export const deleteAllocation = async (
    client: Http.Client,
    allocationId: number
): Promise<void> => {
    await Http.del(client, `/api/allocation/${allocationId}`);
};

/**
 * Options for an allocation report.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchAllocationReportOptions {
    /** `"pdf"` (the server default) or `"png"`. */
    readonly outputFormat?: string | undefined;
}

/**
 * Retrieve a plotted report on an instrument's allocations.
 *
 * The report charts allocated hours, requests made, requests completed and the
 * moon-phase distribution of completed requests, per allocation.
 *
 * @since 1.0.0
 * @category Requests
 * @param instrumentId - ID of the instrument to report on. The server errors
 *   unless it has at least one accessible allocation.
 */
export const fetchAllocationReport = (
    client: Http.Client,
    instrumentId: number,
    options: FetchAllocationReportOptions = {}
): Promise<Uint8Array> =>
    Http.getContent(client, `/api/allocation/report/${instrumentId}`, {
        output_format: options.outputFormat,
    });
