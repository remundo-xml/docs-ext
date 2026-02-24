# Profile

Personal information, identity verification, and work permit management.

## Route

`/candidate-details/profile`

## Layout

The profile tab is the default view (`activeTab={1}`). It is split into two columns: a form and photo section on the left, and verification/work permit cards on the right.

The left column contains the profile photo component (`UserPhoto` with `candidate-details` preset) and the `ProfileForm` inside a `SmallCard`. The right column shows work permit cards, identity/address verification cards (when a primary nationality is set), additional nationality verification (when conditions are met), and a privacy policy disclaimer link to `/std-terms-of-service`.

## Personal information

- First name (required, 2-56 chars; locked when `profileLockedFromNationalityVerified` is true)
- Last name (required, 2-56 chars; locked when `profileLockedFromNationalityVerified` is true)
- Date of birth (day/month/year dropdowns; locked when identity verification has started or been approved, or when not in edit mode)
- Worker code (read-only, system-generated)
- Organisation code (read-only)

## Documentation

- Personal tax number (optional, 3-20 chars)
- Email (required; changing it requires password confirmation via `PasswordInput` and triggers automatic logout)
- Document type (read-only, from identity verification)
- Document expiration date (read-only, formatted with `formatDateRemundoStandard`)
- Identification number (read-only)
- Work location ISO (read-only, derived from current engagement's region or country via `currentEngagement` store)
- Language (read-only, defaults to "English")

A "Renew password" link below the email field navigates to `/renew-password`.

## Address and residency

- Primary nationality (required, country dropdown; locked when `profileLockedFromNationalityVerified` is true)
- Additional nationalities (read-only list of approved nationalities, displayed via `ComboboxCountries` with `readonly={true}`)
- "Add additional nationality" link (visible when `allowAdditionalNationalities` setting is enabled and primary nationality is verified)
- Country of residence (required, country dropdown)
- Address autocomplete (`AddressSuggestion` with Google Places integration, visible in edit mode only; populates address, city, and postal code)
- Address line (required, 1-56 chars)
- City (required, 1-56 chars)
- Postal code (required, 1-56 chars, alphanumeric only -- non-alphanumeric characters are stripped on input)

## Contact

- Phone number (required, two parts: international dial code selector and number input via `PhoneDetailsMinTerms` component)
- Both dial code and number must be non-empty for validation to pass

## Profile photo

- Upload from file (.png, .jpg) or camera capture via `UserPhoto` component
- HEIC files are converted to JPEG automatically
- Max file size: 1MB
- Remove option available

## Form validation

The save button is disabled when:
- Any required field fails validation
- The form is currently submitting
- Email has been changed but no password is provided

Validation runs reactively as fields change. Postal code input is sanitized to only allow `[a-zA-Z0-9'\- ]`.

## Submission flow

1. Click the pencil icon to enter edit mode
2. Modify fields; validation errors display inline below each field
3. If email is changed, a password input appears and must be filled
4. On submit, Firebase user is updated first (display name and/or email), then `updateCandidateProfile` sends the profile command
5. Polling via `pollingGetCondition` waits until the `applies` timestamp is newer than the previous value
6. On success, the form exits edit mode and reloads with updated data
7. If the email was changed, the user is automatically logged out
8. On error, a notification is shown

Cancel reverts to the last saved state by resetting `editingProfile` from the `profile` object.

## Identity and address verification

Two verification cards appear on the right side once a primary nationality is set (controlled by `showVerificationCards`):

- Identity verification via Idenfy KYC service
- Address verification via Idenfy

Each card shows a status via the `VerificationCard` component: action-required, processing, in-progress, failed, or verified. A "Validate" button launches the Idenfy verification flow with a confirmation modal (`IdenfyConfirmationModal`). The button is disabled based on the current verification status via `Idenfy.disableLink`.

## Additional nationality verification

Appears after primary nationality is verified (when `allowAdditionalNationalities` setting is enabled and `isNationalityVerified` is true). The `AdditionalVerificationCards` component allows:

- Selecting a country from a dropdown (already-approved nationalities and the primary nationality are disabled in the list)
- Initiating a separate Idenfy verification process for that nationality
- A close button (X) to dismiss the card, unless a verification is already in progress
- The validate button is disabled when no country is selected, or when a verification is in a non-retryable state

## Work permits

A `WorkPermitCard` is shown for each work permit on the profile, displaying:
- Document type
- Expiration date
- An expiry warning indicator:
  - Green when more than 45 days remain
  - Yellow when 45 days or fewer remain
  - Red when expired

## Real-time updates

The profile subscribes to WebSocket events via `CandidateProfileToken` scoped to the user ID. When a `candidate-profile-updated` event is received, the profile is re-fetched from the API and the page updates automatically. The WebSocket emitter is disposed on component destroy.

## Error handling

If the initial profile load fails, a 404 page (`pages-404`) is shown with the header hidden.
