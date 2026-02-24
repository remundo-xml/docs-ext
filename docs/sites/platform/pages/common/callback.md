# OAuth Callback

Handles the redirect from the OIDC passkey authentication provider and completes the sign-in process.

## Route

`/callback`

## Features

- Processes the OIDC redirect response using `userManager.signinRedirectCallback()`
- Exchanges the OIDC ID token for a Firebase custom token via the `getFirebaseTokenFromOicdToken` API
- Signs the user into Firebase using `signInWithCustomToken`
- Sets the Remundo identity via `setUser('local')`
- Redirects to the stored `navigationUponLogin` path on success
- Clears stale OIDC state from session storage after processing

## Error handling

- OIDC callback failure or missing `id_token` -- displays a warning notification: "Passkey authentication failed. Please try again later or contact support."
- Token exchange failure -- displays a warning notification: "Login failed. Please try again later or contact support."
- Firebase sign-in failure -- displays a warning notification: "Sign in failed. Please try again later or contact support."

## Behavior notes

- This page displays only a spinner while processing. It has no interactive UI.
- The OIDC configuration is defined in `oidc.ts` with the redirect URI set to `/callback`, using the `openid email` scopes and the authorization code flow (`response_type: 'code'`).
- This page is rendered outside the main application layout (`notInLayout: true`).
