# Renew Password

Set a new password for the account. Used in two contexts: after a password reset link and from user settings.

## Route

`/renew-password`

## Features

- **Current password** field (only in the settings-initiated flow via `RenewPassword.svelte`)
- **New password** field with real-time validation using the `PasswordInput` component
- Password requirements enforced via validation:
  - At least 10 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Submit button is disabled until the new password meets all requirements
- Link to `/recover-password` (forgot password) shown in the settings-initiated flow
- Link to `/login` for users who already have an account

## Sub-routes

This route serves two different components depending on context:

### From password reset email (`ResetPassword.svelte`)

- Extracts `oobCode` and `email` from URL query parameters
- Uses Firebase `confirmPasswordReset` with the `oobCode` to set the new password
- Signs the user in with the new password via `signInWithEmailAndPassword`
- Sets the Remundo identity and redirects to `/` on success

### From user settings (`RenewPassword.svelte`)

- Requires the user to enter their **current password** first
- Re-authenticates the user via Firebase `reauthenticateWithCredential`
- Updates the password via Firebase `updatePassword`
- Signs the user in with the new password
- Redirects to `/settings` on success
- Shows an error state on the current password field if re-authentication fails

## Error handling

- Invalid current password -- highlights the current password field as invalid
- Firebase errors -- displays the error message below the form
- A loading spinner replaces the submit button text while processing

## Behavior notes

- The password show/hide toggle is available on both the current password and new password fields.
- The `PasswordInput` component emits `passwordStateChange` events that the form uses to enable or disable the submit button.
