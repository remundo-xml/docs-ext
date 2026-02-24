# Invitation Flow

Handle user invitations to the platform, routing to the appropriate sign-up or login experience.

## Route

`/invite`

## Features

- Reads `id` (invitation ID) and `email` query parameters from the URL
- Fetches the invitation details from the API via `getInvitation`
- Validates the invitation using `validateInvitation` (checks expiry, email match, etc.)
- Checks whether the invited user already has an account via `doesInvitedUserExist`
- Routes to one of three flows based on validation results:
  - **Expired invitation** -- displays the `InvitedExpired` page showing the inviter's name and an expiry message
  - **New user (create account)** -- displays the `ConfirmSignUp` form with fields for first name, last name, password, and terms acceptance
  - **Existing user (join organisation)** -- displays the `InviteLogin` form with the email pre-filled (read-only) and a password field

## How to reach this page

Users receive an email containing a link like `/invite?id=<invitationId>&email=<email>`. Clicking the link opens this page.

## Behavior notes

- If the invitation cannot be fetched or any error occurs during initialisation, the user is redirected to `/error-404`.
- The `ConfirmSignUp` component (for new users) creates a Firebase account, sets the display name, links the invitation, and redirects to `/` on success. It also shows a GDPR consent modal if `showGdprWarning` is enabled for the tenant.
- The `InviteLogin` component (for existing users) signs in with email and password, links the invitation via `setUser('local', invitationId)`, and redirects to `/`.
- If the new user's email is already registered in Firebase, a support contact option is displayed.
- Password requirements for new accounts: at least 10 characters, one uppercase letter, one lowercase letter, and one number.
