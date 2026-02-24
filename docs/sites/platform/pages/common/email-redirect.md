# Email Redirect

Route incoming email action links to the appropriate handler based on the action mode.

## Route

`/email-redirect`

## Features

- Reads the `mode` and `workerInvite` query parameters from the URL
- Routes to one of three sub-components based on the parameters:
  - **Worker invite sign-up** (`WorkerInviteSignUp`) -- displayed when `?workerInvite=true`
  - **Email verification** (`ConfirmSignUp`) -- displayed when `?mode=verifyEmail`
  - **Password reset** (`ResetPassword`) -- displayed for all other cases (default)
- Acts as a dispatcher with no UI of its own

## Behavior notes

- This page is the target for Firebase action links sent via email (e.g., email verification and password reset links).
- The `oobCode` and `email` query parameters are passed through to the child components for processing.
- The `workerInvite` parameter takes priority: if it is `true`, the worker invite sign-up flow is shown regardless of the `mode` value.
