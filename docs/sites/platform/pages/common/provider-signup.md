# Provider Sign-Up

Complete account creation after authenticating with a third-party OAuth provider (Google, Microsoft, or LinkedIn).

## Route

`/provider-signup`

## Features

- Collects additional user details after initial OAuth authentication
- Supports Google, Microsoft, and LinkedIn providers via the `?provider=` query parameter
- Form fields: **First Name** and **Last Name** (both auto-capitalised)
- Requires acceptance of **Terms of Service** and **Privacy Policy** before submission
- Updates the Firebase user profile with the entered display name
- Creates the Remundo identity by calling `setUser` with the provider name
- Redirects to `/` (home) on successful account creation
- Displays an inline error message if sign-up fails
- Shows a loading spinner on the submit button while processing
- Submit button is disabled until all fields are filled and terms are agreed
- If stored credentials are missing, re-opens the provider sign-in popup to re-authenticate

## How to reach this page

Users do not navigate here directly. The main `/login` page redirects to `/provider-signup?provider=<name>` when an OAuth sign-in succeeds but no Remundo identity is found for the authenticated user.

## Behavior notes

- The `?provider=` query parameter determines which OAuth flow to complete. Valid values are `google`, `microsoft`, and `linkedin`.
- User credentials from the initial OAuth popup are stored in `userCredentialsStore`. If the store is empty when the form is submitted, the component re-triggers the OAuth popup.
- The **First Name** and **Last Name** fields use the `capitalise` helper to auto-capitalise input as the user types.
- Form validity requires: first name is non-empty, last name is non-empty, and the terms checkbox is checked.
