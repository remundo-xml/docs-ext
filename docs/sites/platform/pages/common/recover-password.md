# Recover Password

Request a password reset link via email.

## Route

`/recover-password`

## Features

- Single-field form to enter the account email address
- Email format validation using the `validEmail` helper
- Sends a `ResetPasswordCommand` to the API with the email and tenant ID
- Redirects to `/recovery-email-sent` on successful submission
- Link to `/login` for users who remember their password

## Form fields

- **Email** -- email input field; the **Reset** button is disabled until a non-empty value is entered

## Error handling

- Invalid email format -- displays a localised "invalid email" message inline below the email field
- API errors -- displays the error message returned by the API inline below the email field
- On error, the loading spinner is hidden and the form remains editable

## Behavior notes

- A loading spinner replaces the **Reset** button while the request is in progress.
- Typing into the email field clears any previous error message.
- The page uses the `AuthCard` wrapper for consistent styling with other authentication pages.
