/**
 * Request and response models for `/api/source_groups`.
 *
 * @since 1.0.0
 */

/**
 * Payload for saving or unsaving a source to or from groups.
 *
 * At least one of `inviteGroupIds` or `unsaveGroupIds` must be non-empty.
 * Groups the current user can access are saved immediately (`active`); the
 * others are recorded as save requests (`requested`), pending approval by a
 * member of that group.
 *
 * @since 1.0.0
 * @category Models
 */
export interface SourceGroupsPost {
    readonly objId: string;
    readonly inviteGroupIds?: ReadonlyArray<number> | undefined;
    readonly unsaveGroupIds?: ReadonlyArray<number> | undefined;
}
