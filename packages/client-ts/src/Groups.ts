/**
 * Typed endpoint functions for `/api/groups`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import {
    Group,
    GroupsResponse,
    GroupPostResponse,
    GroupStreamPostResponse,
    GroupUserPostResponse,
    type GroupPost,
} from "skyportal-js-models/Groups";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Groups";

/**
 * Options for listing groups.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchGroupsOptions {
    /** Also include each user's implicit single-user group. */
    readonly includeSingleUserGroups?: boolean | undefined;
}

/**
 * Retrieve the groups the token's user belongs to or can access.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchGroups = async (
    client: Http.Client,
    options: FetchGroupsOptions = {}
): Promise<GroupsResponse> =>
    Http.decode(
        GroupsResponse,
        await Http.get(client, "/api/groups", {
            includeSingleUserGroups: options.includeSingleUserGroups ?? false,
        })
    );

/**
 * Options for retrieving a single group.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchGroupOptions {
    /**
     * Include the group's members in `users`. On by default; pass false to
     * skip the member list on large groups.
     */
    readonly includeGroupUsers?: boolean | undefined;
}

/**
 * Retrieve a single group by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group.
 */
export const fetchGroup = async (
    client: Http.Client,
    groupId: number,
    options: FetchGroupOptions = {}
): Promise<Group> =>
    Http.decode(
        Group,
        await Http.get(client, `/api/groups/${groupId}`, {
            includeGroupUsers: options.includeGroupUsers ?? true,
        })
    );

/**
 * Retrieve the accessible groups with an exact name.
 *
 * The `name=` form of `GET /api/groups` returns a plain list rather than the
 * user/accessible split of {@link fetchGroups}.
 *
 * @since 1.0.0
 * @category Requests
 * @param name - Exact group name to match.
 */
export const fetchGroupsByName = async (
    client: Http.Client,
    name: string
): Promise<Array<Group>> =>
    Http.decode(v.array(Group), await Http.get(client, "/api/groups", { name }));

/**
 * Create a new group.
 *
 * @since 1.0.0
 * @category Requests
 * @param payload - The group to create.
 */
export const postGroup = async (
    client: Http.Client,
    payload: GroupPost
): Promise<GroupPostResponse> =>
    Http.decode(
        GroupPostResponse,
        await Http.post(client, "/api/groups", Http.body(payload))
    );

/**
 * Options for updating a group.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateGroupOptions {
    readonly nickname?: string | undefined;
    readonly description?: string | undefined;
    /** Whether the group is private. */
    readonly private?: boolean | undefined;
    /** Whether admission requests to the group are accepted automatically. */
    readonly autoAcceptRequests?: boolean | undefined;
}

/**
 * Update an existing group.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group to update.
 * @param name - The group name; required by the server even if unchanged.
 */
export const updateGroup = async (
    client: Http.Client,
    groupId: number,
    name: string,
    options: UpdateGroupOptions = {}
): Promise<void> => {
    await Http.put(
        client,
        `/api/groups/${groupId}`,
        Http.body({
            name,
            nickname: options.nickname,
            description: options.description,
            private: options.private,
            auto_accept_requests: options.autoAcceptRequests,
        })
    );
};

/**
 * Delete a group.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group to delete.
 */
export const deleteGroup = async (
    client: Http.Client,
    groupId: number
): Promise<void> => {
    await Http.del(client, `/api/groups/${groupId}`);
};

/**
 * Retrieve the server's configured public group.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchPublicGroup = async (client: Http.Client): Promise<Group> =>
    Http.decode(Group, await Http.get(client, "/api/groups/public"));

/**
 * Grant a group access to an alert stream.
 *
 * Every member of the group must already have access to the stream.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group.
 * @param streamId - ID of the stream to associate with the group.
 */
export const postGroupStream = async (
    client: Http.Client,
    groupId: number,
    streamId: number
): Promise<GroupStreamPostResponse> =>
    Http.decode(
        GroupStreamPostResponse,
        await Http.post(client, `/api/groups/${groupId}/streams`, {
            stream_id: streamId,
        })
    );

/**
 * Remove an alert stream from a group.
 *
 * Fails if one of the group's filters still operates on the stream.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group.
 * @param streamId - ID of the stream to remove from the group.
 */
export const deleteGroupStream = async (
    client: Http.Client,
    groupId: number,
    streamId: number
): Promise<void> => {
    await Http.del(client, `/api/groups/${groupId}/streams/${streamId}`);
};

/**
 * Options for adding a user to a group.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostGroupUserOptions {
    /** Make the user a group admin. */
    readonly admin?: boolean | undefined;
    /** Allow the user to save sources to the group. Defaults to true. */
    readonly canSave?: boolean | undefined;
    /** Allow the user to share the group's photometry with other groups. */
    readonly canSharePhotometry?: boolean | undefined;
}

/**
 * Add a user to a group.
 *
 * The user must already have access to every stream of the group.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group.
 * @param userId - ID of the user to add.
 */
export const postGroupUser = async (
    client: Http.Client,
    groupId: number,
    userId: number,
    options: PostGroupUserOptions = {}
): Promise<GroupUserPostResponse> =>
    Http.decode(
        GroupUserPostResponse,
        await Http.post(client, `/api/groups/${groupId}/users`, {
            userID: userId,
            admin: options.admin ?? false,
            canSave: options.canSave ?? true,
            canSharePhotometry: options.canSharePhotometry ?? false,
        })
    );

/**
 * Options for updating a group member.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateGroupUserOptions {
    /** Whether the user is a group admin. */
    readonly admin?: boolean | undefined;
    /** Whether the user can save sources to the group. */
    readonly canSave?: boolean | undefined;
    /** Whether the user can share the group's photometry with other groups. */
    readonly canSharePhotometry?: boolean | undefined;
}

/**
 * Update a group member's admin or save-access status.
 *
 * At least one of `admin`, `canSave`, or `canSharePhotometry` must be
 * provided; omitted flags are left unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group.
 * @param userId - ID of the group member to update.
 */
export const updateGroupUser = async (
    client: Http.Client,
    groupId: number,
    userId: number,
    options: UpdateGroupUserOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        `/api/groups/${groupId}/users`,
        Http.body({
            userID: userId,
            admin: options.admin,
            canSave: options.canSave,
            canSharePhotometry: options.canSharePhotometry,
        })
    );
};

/**
 * Remove a user from a group.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group.
 * @param userId - ID of the group member to remove.
 */
export const deleteGroupUser = async (
    client: Http.Client,
    groupId: number,
    userId: number
): Promise<void> => {
    await Http.del(client, `/api/groups/${groupId}/users/${userId}`);
};

/**
 * Add all members of other groups to the specified group.
 *
 * Users already in the target group are skipped.
 *
 * @since 1.0.0
 * @category Requests
 * @param groupId - ID of the group to add users to.
 * @param fromGroupIds - IDs of the groups whose members should be added.
 */
export const postGroupUsersFromGroups = async (
    client: Http.Client,
    groupId: number,
    fromGroupIds: ReadonlyArray<number>
): Promise<void> => {
    await Http.post(client, `/api/groups/${groupId}/usersFromGroups`, {
        fromGroupIDs: fromGroupIds,
    });
};
