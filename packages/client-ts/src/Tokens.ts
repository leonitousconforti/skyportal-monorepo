/**
 * Typed endpoint functions for `/api/internal/tokens`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import { ApiToken, TokenPostResponse } from "skyportal-js-models/Tokens";

import * as Http from "./Http.ts";

export * from "skyportal-js-models/Tokens";

/**
 * Options for listing API tokens.
 *
 * @since 1.0.0
 * @category Models
 */
export interface FetchTokensOptions {
    /** Keep only tokens created by this user. */
    readonly userId?: number | undefined;
}

/**
 * Retrieve the API tokens visible to the requesting user.
 *
 * @since 1.0.0
 * @category Requests
 */
export const fetchTokens = async (
    client: Http.Client,
    options: FetchTokensOptions = {}
): Promise<Array<ApiToken>> =>
    Http.decode(
        v.array(ApiToken),
        await Http.get(client, "/api/internal/tokens", { userID: options.userId })
    );

/**
 * Retrieve a single API token by ID.
 *
 * @since 1.0.0
 * @category Requests
 * @param tokenId - ID of the token.
 */
export const fetchToken = async (
    client: Http.Client,
    tokenId: string
): Promise<ApiToken> =>
    Http.decode(ApiToken, await Http.get(client, `/api/internal/tokens/${tokenId}`));

/**
 * Options for creating an API token.
 *
 * @since 1.0.0
 * @category Models
 */
export interface PostTokenOptions {
    /** User to create the token for; defaults to the requesting user. */
    readonly userId?: number | undefined;
}

/**
 * Create a new API token.
 *
 * The token may only carry ACLs its owner holds, and non-admins may only
 * create tokens for themselves.
 *
 * @since 1.0.0
 * @category Requests
 * @param name - Name of the token; must be unique among the owner's tokens.
 * @param acls - ACL IDs to grant the token.
 */
export const postToken = async (
    client: Http.Client,
    name: string,
    acls: ReadonlyArray<string>,
    options: PostTokenOptions = {}
): Promise<TokenPostResponse> =>
    Http.decode(
        TokenPostResponse,
        await Http.post(
            client,
            "/api/internal/tokens",
            Http.body({ name, acls, user_id: options.userId })
        )
    );

/**
 * Options for updating an API token.
 *
 * @since 1.0.0
 * @category Models
 */
export interface UpdateTokenOptions {
    /** New name of the token. */
    readonly name?: string | undefined;
    /** New list of ACL IDs for the token. */
    readonly acls?: ReadonlyArray<string> | undefined;
    /**
     * User whose permissions the new ACLs are checked against; defaults to the
     * requesting user.
     */
    readonly userId?: number | undefined;
}

/**
 * Update an API token's name and/or ACLs.
 *
 * Omitted fields are left unchanged.
 *
 * @since 1.0.0
 * @category Requests
 * @param tokenId - ID of the token to update.
 */
export const updateToken = async (
    client: Http.Client,
    tokenId: string,
    options: UpdateTokenOptions = {}
): Promise<void> => {
    await Http.put(
        client,
        `/api/internal/tokens/${tokenId}`,
        Http.body({ name: options.name, acls: options.acls, user_id: options.userId })
    );
};

/**
 * Delete an API token.
 *
 * @since 1.0.0
 * @category Requests
 * @param tokenId - ID of the token to delete.
 */
export const deleteToken = async (
    client: Http.Client,
    tokenId: string
): Promise<void> => {
    await Http.del(client, `/api/internal/tokens/${tokenId}`);
};
