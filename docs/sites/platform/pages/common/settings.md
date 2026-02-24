# Settings

Manage user account settings including profile information, email, password, and communication preferences.

## Route

`/settings`

## Sub-routes

- `/settings/communication` -- Communication preferences page

## Features

### Profile photo (`UserPhoto` component)

- Displays the current profile picture or initials avatar
- **Upload** button -- opens a drop zone to upload an image file (PNG, JPG; max 10 MB)
- **Camera** button -- opens a camera modal to take a photo directly
- **Remove** button -- deletes the current profile picture (disabled if no picture is set)
- Supports HEIC to JPEG conversion for uploaded files
- Displays an error message if the file exceeds the size limit

### Settings form (`SettingsForm` component)

- **Full Name** section:
  - **First Name** input -- validates using `validateName`; updates on blur
  - **Last Name** input -- validates using `validateName`; updates on blur
  - Saves the new display name to Firebase on blur if changed
- **Email** section:
  - **New Email** input -- editable email field
  - When the email is changed, a **password confirmation** field appears for re-authentication
  - **Update** button -- re-authenticates with the current password, updates the email in Firebase, then re-signs in
  - **Cancel** button -- reverts the email field to the current value
  - Shows an error if the password is incorrect
- **Password** section:
  - **Renew password** link navigates to `/renew-password`
- **Language** section:
  - Dropdown with available languages (English, Deutsch, Francais, Japanese)
- **Communication preferences** link navigates to `/settings/communication` (hidden when `hideUserSettingsLinks` is enabled)
- **Delete account** label displayed alongside communication preferences (currently non-functional)

### Communication preferences (`/settings/communication`)

- **Mandatory notifications** -- always on; toggle is disabled in the "Off" position
- **Non-mandatory notifications** -- togglable on/off; controls whether non-essential email notifications are sent
- **Unsubscribe from all** button -- turns off all non-mandatory notifications in one click
- Changes are persisted via `sendUnsubscribe` / `sendResubscribe` API calls
- Uses polling (`pollingGetCondition`) to confirm the server-side unsubscribed state has updated before reflecting the change in the UI
- Shows an "updating" notification while the change is being processed
- Displays an error notification if the update fails

## Behavior notes

- Profile photo uploads are sent as Base64-encoded data via the `sendProfilePictureRequest` API.
- Name changes are saved immediately on input blur, not on form submission.
- Email changes require the user to re-enter their current password for security.
- The communication preferences page loads the latest identity from the API on mount to ensure the displayed toggle state is current.
