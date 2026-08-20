/**
 * Typed endpoint functions for `/api/internal/profile`.
 *
 * @since 1.0.0
 */

import { UserProfile, type ProfilePatch } from "skyportal-js-models/Profile";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Profile";

/**
 * Retrieve the profile of the user associated with the token.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchProfile = async (client: Http.Client): Promise<UserProfile> =>
    Http.decode(UserProfile, await Http.get(client, "/api/internal/profile"));

/**
 * Options for updating a profile.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateProfileOptions {
    /**
     * User whose profile to update; defaults to the token's own user. Updating
     * another user requires the "Manage users" ACL.
     */
    readonly userId?: number | undefined;
}

/**
 * Update a user's profile and preferences.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 * `preferences` is merged into the stored preferences dict rather than
 * replacing it.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The fields to change.
 */
export const updateProfile = async (
    client: Http.Client,
    payload: ProfilePatch,
    options: UpdateProfileOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        options.userId === undefined
            ? "/api/internal/profile"
            : `/api/internal/profile/${options.userId}`,
        Http.body(payload)
    );
};
