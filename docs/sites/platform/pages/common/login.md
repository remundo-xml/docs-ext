# Login

Authenticate to access the platform.

## Route

`/login`

## Features

- Email and password authentication via Firebase `signInWithEmailAndPassword`
- Social sign-in providers (displayed conditionally based on tenant settings):
  - **Google** -- shown when `enableSecretGoogleLogin` is enabled
  - **Microsoft** -- shown when Microsoft login is enabled
  - **LinkedIn** -- shown when LinkedIn login is enabled
- Passkey / WebAuthn login via the `LoginPasskey` component (shown when `allowMFA` is enabled), which triggers an OIDC redirect for passkey-based authentication
- Password recovery link to `/recover-password`
- Link to `/register` for new users who do not have an account
- Links to **Privacy Policy** and **Terms of Service** (external landing site pages)
- Custom token login via `?token=` query parameter for QR code flows -- authenticates using `signInWithCustomToken` and optionally redirects to a `?redirect=` URL
- Session expiry handling -- displays a session expired message when `?event=session-expired` is present

## Form fields

- **Email** -- email input, validated as non-empty
- **Password** -- password input with show/hide toggle via the `PasswordInput` component

## Error handling

- `auth/invalid-email` -- marks both email and password fields as invalid with "Email/password incorrect"
- `auth/wrong-password` -- marks both fields as invalid with "Email/password incorrect"
- `auth/user-not-found` -- marks both fields as invalid with "Email/password incorrect"
- `auth/popup-closed-by-user` -- silently ignored (user dismissed the OAuth popup)
- All other errors -- displays a toast notification: "Sorry an error occurred. Please try again later"

## Redirect behavior after login

- If a `?redirect=` query parameter is present, the user is navigated to that path after successful login
- Otherwise, the user is navigated to the stored `navigationUponLogin` path (typically the dashboard)
- For OAuth providers (LinkedIn, Microsoft): if the user has no Remundo identity, they are redirected to `/provider-signup?provider=<name>` to complete registration
- Google login also tracks an `irclickid` cookie for affiliate click attribution, clearing it after use

## Behavior notes

- On mount, the page calls `logOut()` to clear any existing session before rendering the login form.
- If the user is already logged in and has a verified email, they are automatically redirected to `/`.
- The submit button is disabled until both email and password fields are non-empty.
- A loading spinner replaces the button text while authentication is in progress.
- The "Remember me" checkbox is present in the template but currently hidden (`{#if false}`).
- A "Powered by" logo is conditionally displayed based on the tenant name.
