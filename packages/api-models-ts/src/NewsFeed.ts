/**
 * Request and response models for `/api/newsfeed`.
 *
 * @since 1.0.0
 */

import * as v from "valibot";

import * as Schemas from "./Schemas.ts";

/**
 * Display information about the user behind a news feed item.
 *
 * Exactly the fields upstream's `basic_user_display_info` (and
 * `Comment.construct_author_info_dict`) copies off the `User`.
 *
 * @since 1.0.0
 * @category Models
 */
export const NewsFeedAuthorInfo = Schemas.model(
    v.strictObject({
        username: Schemas.NullishString,
        first_name: Schemas.NullishString,
        last_name: Schemas.NullishString,
        gravatar_url: Schemas.NullishString,
        is_bot: Schemas.NullishBoolean,
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type NewsFeedAuthorInfo = v.InferOutput<typeof NewsFeedAuthorInfo>;

/**
 * One entry in the news feed (no upstream model; built by the handler).
 *
 * `author` is only set on comment items; `author_info` is absent on source
 * items.
 *
 * @since 1.0.0
 * @category Models
 */
export const NewsFeedItem = Schemas.model(
    v.strictObject({
        type: v.picklist([
            "source",
            "comment",
            "classification",
            "spectrum",
            "photometry",
        ]),
        time: Schemas.NullishTimestamp,
        message: Schemas.NullishString,
        source_id: Schemas.NullishString,
        classification: Schemas.NullishString,
        author: Schemas.NullishString,
        author_info: Schemas.nullish(NewsFeedAuthorInfo),
    })
);

/**
 * @since 1.0.0
 * @category Models
 */
export type NewsFeedItem = v.InferOutput<typeof NewsFeedItem>;
