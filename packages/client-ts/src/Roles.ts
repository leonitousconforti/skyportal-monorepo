/**
 * Typed endpoint functions for `/api/roles`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Http from "./Http.ts";
import { Role } from "skyportal-js-models/Roles";

export * from "skyportal-js-models/Roles";

/**
 * Retrieve all roles, each with the IDs of its ACLs.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchRoles = async (client: Http.Client): Promise<Array<Role>> =>
    Http.decode(v.array(Role), await Http.get(client, "/api/roles"));

/**
 * Grant roles to a user (requires the "Manage users" ACL).
 *
 * @since 1.0.0
 * @category Requests
 * @param userId - ID of the user to grant the roles to.
 * @param roleIds - IDs of the roles to grant; every ID must name an existing role.
 */
export const postUserRole = async (
    client: Http.Client,
    userId: number,
    roleIds: ReadonlyArray<string>
): Promise<void> => {
    await Http.post(client, `/api/user/${userId}/roles`, { roleIds });
};

/**
 * Remove a role from a user (requires the "Manage users" ACL).
 *
 * @since 1.0.0
 * @category Requests
 * @param userId - ID of the user to remove the role from.
 * @param roleId - ID of the role to remove; the user must currently have it.
 */
export const deleteUserRole = async (client: Http.Client, userId: number, roleId: string): Promise<void> => {
    await Http.del(client, `/api/user/${userId}/roles/${roleId}`);
};
