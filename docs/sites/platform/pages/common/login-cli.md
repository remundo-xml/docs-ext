# CLI Login

Authenticate via the platform web UI and send tokens back to a local CLI tool.

## Route

`/login-cli`

## Features

- Email and password login form identical in layout to the main login page
- **Remember me** checkbox and **Forgot password** link to `/recover-password`
- On successful authentication, retrieves both a Remundo API token and a Firebase ID token
- Sends both tokens to a CLI callback URL provided via the `?callback=` query parameter
- Displays a success message once tokens have been delivered to the CLI
- Shows inline error messages for invalid email, wrong password, or user not found
- Displays a toast notification for unexpected errors
- If the user is already logged in on page load, tokens are sent automatically without re-entering credentials
- OAuth provider login (Google, Microsoft, LinkedIn) is present in the template but currently commented out and disabled

## Behavior notes

- The `?callback=` query parameter specifies the local URL where the CLI is listening for tokens. The component POSTs a `Tokens` object containing `remundoToken` and `firebaseToken` to that URL.
- After a successful token delivery, the login form is replaced with a success message.
- The submit button is disabled until both the email and password fields are non-empty.
