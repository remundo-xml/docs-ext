# Email Confirmations

Confirmation pages displayed after email-based actions such as password recovery or account registration.

## Routes

- `/recovery-email-sent` -- shown after submitting a password recovery request
- `/verification-email-sent` -- shown after registering a new account

## Features

### Recovery Email Sent (`EmailConfirmation`)

- Displays a heading confirming that a password reset email has been sent
- Instructs the user to check their inbox (and spam folder)
- Provides a **Login here** link back to `/login` for users who remember their password

### Verification Email Sent (`EmailLinkSent`)

- Displays a heading confirming that a verification email has been sent
- Instructs the user to verify their email address by clicking the link in the email
- Provides a **Resend email** link that triggers a new verification email via the `verifyEmail` API
- Shows a loading spinner while the resend request is in progress
- Displays a confirmation message once the email has been successfully resent
- Uses the currently authenticated user's email address and the tenant ID to send the verification command

## Behavior notes

- Both pages use the `AuthCard` wrapper component for consistent styling.
- The resend functionality on `/verification-email-sent` requires the user to still have an active Firebase authentication session (`auth.currentUser` must be present).
- The resend counter tracks how many times the email has been re-sent during the session.
