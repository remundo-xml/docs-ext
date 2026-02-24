# QR Code Redirect

Mobile device QR code entry point that validates a JWT and redirects the user to a file upload flow.

## Route

`/qrcode`

## Features

- Extracts a `jwt` query parameter from the URL
- Calls the `getFirebaseLoginTokenByJWT` API to exchange the JWT for a Firebase login token
- Builds a redirect URL that sends the user to `/login` with the Firebase token and a redirect path to the phone file upload page
- Redirects to `/token-expired` if the API returns a 403 (expired JWT)
- Redirects to `/invalid-token` for any other API error

## How to use this page

Users do not navigate here manually. A QR code is generated elsewhere in the platform containing a URL like `/qrcode?jwt=<token>&eorId=<id>&approvalType=<type>`. When scanned on a mobile device, the browser opens this page and the redirect chain authenticates the user and takes them to the file upload interface.

## Behavior notes

- The redirect URL is constructed as: `/login?token=<firebaseToken>&redirect=phone-file-upload/eori/<eorId>/type/<approvalType>`
- The `eorId` and `approvalType` query parameters are read from the original URL and incorporated into the redirect path.
- This page has no visible UI -- it processes the redirect on mount and immediately navigates away.
