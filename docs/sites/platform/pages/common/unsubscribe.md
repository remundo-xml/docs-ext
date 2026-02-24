# Unsubscribe

Automatically unsubscribe the user from non-mandatory email notifications.

## Route

`/unsubscribe/*`

## Features

- Automatically sends an `UnsubscribeEmailCommand` to the API on page load (no user interaction required)
- Uses the current user's Firebase UID as the correlation ID and the tenant ID from settings
- Displays the Remundo logo linking to the home page
- Shows a localised title and description confirming the unsubscribe action
- Displays an illustrative image

## Behavior notes

- The unsubscribe API call is fired in the `onMount` lifecycle hook, so the user is unsubscribed as soon as the page loads.
- This page is designed to be linked from email footers. The wildcard route (`/unsubscribe/*`) allows any sub-path to resolve to this component.
- The user must be authenticated (their identity must be in the store) for the unsubscribe command to include the correct UID.
- To re-subscribe, the user must visit `/settings/communication` and toggle non-mandatory notifications back on.
