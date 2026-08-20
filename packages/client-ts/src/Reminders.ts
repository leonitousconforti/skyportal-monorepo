/**
 * Typed endpoint functions for `/api/{resourceType}/{id}/reminders`.
 *
 * @since 1.0.0
 */

import * as Http from "./Http.ts";
import { Reminder, RemindersResponse, ReminderPostResponse } from "skyportal-js-models/Reminders";
import type { ReminderResourceType, ReminderPost, ReminderUpdate } from "skyportal-js-models/Reminders";

export * from "skyportal-js-models/Reminders";

/**
 * Options naming which remindable resource a reminder belongs to.
 *
 * @since 1.0.0
 * @category Models
 */
export interface ReminderResourceOptions {
    /** What the reminder is on. Defaults to `"source"`. */
    readonly resourceType?: ReminderResourceType | undefined;
}

/**
 * Retrieve every reminder attached to one resource.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the resource the reminders are on: an object ID for
 *   `"source"`, otherwise the integer ID of the spectrum, GCN event, shift or
 *   earthquake.
 */
export const fetchReminders = async (
    client: Http.Client,
    resourceId: string,
    options: ReminderResourceOptions = {}
): Promise<RemindersResponse> =>
    Http.decode(
        RemindersResponse,
        await Http.get(client, `/api/${options.resourceType ?? "source"}/${resourceId}/reminders`)
    );

/**
 * Retrieve a single reminder by ID.
 *
 * The server rejects the request if the reminder is not attached to
 * `resourceId`.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the resource the reminder is on.
 * @param reminderId - ID of the reminder to retrieve.
 */
export const fetchReminder = async (
    client: Http.Client,
    resourceId: string,
    reminderId: number,
    options: ReminderResourceOptions = {}
): Promise<Reminder> =>
    Http.decode(
        Reminder,
        await Http.get(client, `/api/${options.resourceType ?? "source"}/${resourceId}/reminders/${reminderId}`)
    );

/**
 * Create reminders on a resource, one per target user.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the resource to attach the reminders to.
 * @param payload - The reminder to create.
 */
export const postReminder = async (
    client: Http.Client,
    resourceId: string,
    payload: ReminderPost,
    options: ReminderResourceOptions = {}
): Promise<ReminderPostResponse> =>
    Http.decode(
        ReminderPostResponse,
        await Http.post(client, `/api/${options.resourceType ?? "source"}/${resourceId}/reminders`, Http.body(payload))
    );

/**
 * Update an existing reminder.
 *
 * Only the provided fields are sent; omitted fields are left unchanged.
 * Omitting `group_ids` resets visibility to all of the requesting user's
 * groups, and omitting `user_ids` resets the reminder to the requesting user.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the resource the reminder is on.
 * @param reminderId - ID of the reminder to update.
 * @param payload - The fields to change.
 */
export const updateReminder = async (
    client: Http.Client,
    resourceId: string,
    reminderId: number,
    payload: ReminderUpdate,
    options: ReminderResourceOptions = {}
): Promise<void> => {
    await Http.patch(
        client,
        `/api/${options.resourceType ?? "source"}/${resourceId}/reminders/${reminderId}`,
        Http.body(payload)
    );
};

/**
 * Delete a reminder.
 *
 * @since 1.0.0
 * @category Requests
 * @param resourceId - ID of the resource the reminder is on.
 * @param reminderId - ID of the reminder to delete.
 */
export const deleteReminder = async (
    client: Http.Client,
    resourceId: string,
    reminderId: number,
    options: ReminderResourceOptions = {}
): Promise<void> => {
    await Http.del(client, `/api/${options.resourceType ?? "source"}/${resourceId}/reminders/${reminderId}`);
};
