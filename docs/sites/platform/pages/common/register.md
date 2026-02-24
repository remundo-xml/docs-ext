# Register

Create a new user account using an email address.

## Route

`/register`

## Features

- Email-only registration form (password is set later via email verification link)
- Email validation: rejects temporary/disposable email addresses via the `validateEmail` API
- Email length validation: maximum 100 characters
- Creates a Firebase user with a placeholder password, then sends a verification email
- Redirects to `/verification-email-sent` on successful registration
- Link to `/login` for users who already have an account
- Support ticket modal when the email is already in use

## Form fields

- **Email** -- email input field; submit button is disabled until a non-empty value is entered

## Error handling

- `auth/email-already-in-use` -- displays a localised "email in use" message with a **Contact remundo support** link that opens a support modal
- `auth/invalid-email` -- displays "Email is invalid email"
- `auth/missing-email` -- displays a localised email error
- Temporary email rejection -- displays "This email has registered as a temporary email address and cannot be used."
- Email too long -- displays a localised email length error
- All other errors -- displays a toast notification with the error message

## Support modal

When the "email already in use" error occurs, the user can click **Contact remundo support** to open a modal:

- Displays a message: "Please help! My email address is already registered."
- Optionally allows the user to leave a comment (up to 255 characters) via a collapsible text area
- Submitting the modal sends a `RaiseEmailSupportTicketCommand` with a deterministic UUID generated from the email address
- After submission, displays a confirmation message

## Behavior notes

- The component accepts an optional `invitationId` prop. If provided, it is stored in `localStorage` so the sign-up flow can link the new account to an invitation.
- The Firebase account is created with a temporary placeholder password (`'password'`); the user sets their real password when they click the email verification link and land on the `ConfirmSignUp` page.
