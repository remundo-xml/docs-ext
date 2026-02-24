# Error Pages

Display error states and recovery options when something goes wrong or a resource is unavailable.

## Routes

- `/pages-404` -- Page not found
- `/pages-500` -- Server error
- `/invalid-token` -- Invalid authentication token
- `/token-expired` -- Expired authentication token
- `/access-restricted` -- Insufficient permissions
- `/expired-invite` -- Expired invitation link
- `/invalid-invite` -- Invalid invitation link
- `/expired-work-offer` -- Expired work offer link

## Features

- User-friendly error messages
- Navigation back to safe pages
- Consistent visual layout with error illustration images

## Page details

### `/pages-404` -- Page Not Found

- Displays a localised "page not found" heading and description
- Shows an error illustration image
- Provides a button to navigate back to the home page (`/`)
- Also used as the catch-all route for any unmatched URL (`/*`)
- Accepts a `hideHeader` prop to optionally hide the top header bar

### `/pages-500` -- Internal Server Error

- Displays "500" with an animated icon and "Internal Server Error" heading
- Shows the message "Sorry, something went wrong.. Please come back later"
- Displays the same error illustration image
- No navigation button is provided

### `/invalid-token` -- Invalid Token

- Displayed when a QR code or email link contains an invalid authentication token
- Shows a localised heading and explanation text
- Provides a button to navigate to `/dashboard`

### `/token-expired` -- Expired Token

- Displayed when a QR code or email link contains an expired authentication token (HTTP 403 from the API)
- Shows a localised heading and explanation text
- Provides a button to navigate to `/dashboard`

### `/access-restricted` -- Access Restricted

- Displayed when a user tries to access a resource they do not have permission for
- Shows a localised heading and supporting text with a dedicated "access restricted" illustration
- Provides a button to navigate to `/login`, preserving any `?redirect=` query parameter so the user can return to the restricted page after authentication

### `/expired-invite` -- Expired Invitation

- Displayed when a user follows an invitation link that has expired
- Fetches the invitation details to show the inviter's display name
- Shows a localised title, the inviter's name in the description, and an "expired link" illustration
- No navigation button is provided; the Remundo logo links to the home page

### `/invalid-invite` -- Invalid Invitation

- Displayed when an invitation link is malformed or no longer valid
- Shows a localised "invalid invite" heading
- The Remundo logo and illustration are displayed but no action button is provided

### `/expired-work-offer` -- Expired Work Offer

- Displayed when a candidate follows a work offer share link for an expired engagement
- Accepts a `companyName` prop and inserts it into the localised description
- Shows an "expired link" illustration and a description mentioning the company name
- No navigation button is provided; the Remundo logo links to the home page
