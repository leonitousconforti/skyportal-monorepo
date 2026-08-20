/**
 * Typed endpoint functions for `/api/user`.
 *
 * @since 1.0.0
 */

import * as Http from "./Http.ts";
import { User, UsersPage, UserPostResponse } from "skyportal-js-models/Users";
import type { UserPost } from "skyportal-js-models/Users";

export * from "skyportal-js-models/Users";

/**
 * Options for querying users.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchUsersOptions {
    /** Pagination controls. */
    readonly pageNumber?: number | undefined;
    /** Page size; defaults to the server's page size. */
    readonly numPerPage?: number | undefined;
    readonly firstName?: string | undefined;
    readonly lastName?: string | undefined;
    readonly username?: string | undefined;
    readonly email?: string | undefined;
    /** Keep users holding this role. */
    readonly role?: string | undefined;
    /** Keep users holding this ACL. */
    readonly acl?: string | undefined;
    /** Keep users belonging to the group with this name. */
    readonly group?: string | undefined;
    /** Keep users belonging to the stream with this name. */
    readonly stream?: string | undefined;
    /** Also include deactivated (expired) accounts. */
    readonly includeExpired?: boolean | undefined;
    /**
     * Column to sort on; one of "username", "firstName", "lastName",
     * "contactEmail", or "createdAt".
     */
    readonly sortBy?: string | undefined;
    /** "asc" or "desc". */
    readonly sortOrder?: string | undefined;
}

/**
 * Query users, one page at a time.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchUsers = async (client: Http.Client, options: FetchUsersOptions = {}): Promise<UsersPage> =>
    Http.decode(
        UsersPage,
        await Http.get(client, "/api/user", {
            pageNumber: options.pageNumber ?? 1,
            numPerPage: options.numPerPage,
            firstName: options.firstName,
            lastName: options.lastName,
            username: options.username,
            email: options.email,
            role: options.role,
            acl: options.acl,
            group: options.group,
            stream: options.stream,
            includeExpired: options.includeExpired ?? false,
            sortBy: options.sortBy ?? "username",
            sortOrder: options.sortOrder ?? "asc",
        })
    );

/**
 * Retrieve a single user by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param userId - ID of the user.
 */
export const fetchUser = async (client: Http.Client, userId: number): Promise<User> =>
    Http.decode(User, await Http.get(client, `/api/user/${userId}`));

/**
 * Add a new user (requires the "Manage users" ACL).
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The user to add.
 */
export const postUser = async (client: Http.Client, payload: UserPost): Promise<UserPostResponse> =>
    Http.decode(UserPostResponse, await Http.post(client, "/api/user", Http.body(payload)));

/**
 * Options for updating a user record.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateUserOptions {
    /**
     * Arrow-parseable date string (e.g. `"2020-01-01"`). After this date the
     * account is deactivated and cannot access the application. Pass `null`
     * explicitly to clear an existing expiration date; omit it to leave the
     * current value alone.
     */
    readonly expirationDate?: string | null | undefined;
}

/**
 * Update a user record (requires the "Manage users" ACL).
 *
 * @since 1.0.0
 * @category Requests
 * @param userId - ID of the user to update.
 */
export const updateUser = async (
    client: Http.Client,
    userId: number,
    options: UpdateUserOptions = {}
): Promise<void> => {
    await Http.patch(client, `/api/user/${userId}`, Http.body(options));
};

/**
 * Delete a user (requires the "Manage users" ACL).
 *
 * @since 1.0.0
 * @category Requests
 * @param userId - ID of the user to delete.
 */
export const deleteUser = async (client: Http.Client, userId: number): Promise<void> => {
    await Http.del(client, `/api/user/${userId}`);
};
