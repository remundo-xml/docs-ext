# Share Link

Handle shared work offer links sent to candidates, routing to the appropriate sign-up, login, or offer view.

## Route

`/share`

## Features

- Reads `email` and `id` (candidate offer ID) query parameters from the URL
- Fetches redacted engagement details via `getRedactedEorInstance` to determine if the offer is for an employee or contractor
- Checks the user's authentication state using `fetchSignInMethodsForEmail`:
  - **Logged in** (current Firebase user matches the email) -- redirects directly to the work offer page
  - **Logged out** (user has an account but is not signed in) -- displays the standard `Login` page
  - **New user** (no account exists) -- displays the `CandidateConfirmSignUp` form with pre-filled first and last name
- Detects expired offers and displays the `WorkOfferExpired` page with the company name

## How to reach this page

Candidates receive an email containing a link like `/share?email=<email>&id=<offerId>`. Clicking the link opens this page.

## Redirect behavior

- Employee offers redirect to: `/candidate-offer/<id>/main-terms`
- Contractor offers redirect to: `/contractor-candidate-offer/<id>/main-terms`
- On error, the user is redirected to `/error`

## Behavior notes

- For new users, the `CandidateConfirmSignUp` component handles account creation with name, password, and terms acceptance. The `account-created` event triggers navigation to the work offer page.
- For logged-out users, `localStorage` is cleared before showing the login form to ensure a clean authentication state.
- The component determines contractor status by checking if `payRate > 0` on the redacted EOR instance.
