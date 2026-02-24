# General Settings -- Sign

Timesheet access permit signing page. Allows the employer to sign the timesheet access permit document required before timesheets can be fully enabled for the organisation.

## Route

`/organisations/:organisationId/company-settings/general-settings/sign`

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

## Visibility

Navigated to from the General Settings page when enabling timesheets without a signed permit. Rendered inside the Company Settings tab container at tab index 4 (General Settings tab group).

## Layout

The page is rendered inside `OrganisationSettingsTabs` with `activeTab={4}`. It contains a centred layout with a fixed height of `80vh`.

### Loading State

While initialising, a large spinner (10rem x 10rem) is displayed with polling status text below it. The text updates through two phases:
1. `general-ui.signing-document.onboarding.polling.check-signing-request` -- Shown while checking for an existing signing link.
2. `general-ui.signing-document.onboarding.polling.generating-signing-link` -- Shown while generating a new signing link.

### Signing Viewer

After initialisation, the `SigningViewer` component is rendered with:
- `id`: `"timesheet-permit-frame"`
- `signingId`: The signing document ID (format: `{organisationId}:{DocumentType.TimesheetAccessPermit}`)
- `dimension`: `{ width: 1000, height: 800 }`
- `organisationName`: The organisation's name
- `link`: The signing URL

### Close Button

A close button (X icon, `bi-x` with `fs-1` font size) is positioned beside the signing viewer. Clicking it navigates to `/organisations/:organisationId/general-settings`.

### Error State

If initialisation fails, the page navigates to `/pages-404`.

## Data Loading

On initialisation (`pInit`):

1. Validates the user identity and organisation ID. Throws an error if either is null.
2. Constructs the signing document ID as `{organisationId}:TimesheetAccessPermit` using `Signing.DocumentTypes.TimesheetAccessPermit`.
3. Fetches the organisation DTO via `getOrganisationDto(organisationId)` to retrieve the organisation name.
4. Sets polling text to the "check signing request" message.
5. Calls `Signing.handleGetSigningLink(id, organisationName)` to check for an existing signing link:
   - If a link already exists, stores it and returns immediately.
   - If no link exists, proceeds to upload.
6. Calls `Signing.uploadTimesheetPermit(organisationId, organisationName, userId)` to upload the permit document.
7. Updates polling text to the "generating signing link" message.
8. Calls `Signing.handleGetSigningLink(id, organisationName)` again to retrieve the newly generated link.

If any step fails, an error notification ("Cannot create signing request") is shown via `showErrorNotification` and the error is re-thrown (triggering the `{:catch}` block which navigates to `/pages-404`).

## Behavior notes

- The page container uses `flex-grow: 1` to fill available space.
- The signing viewer is wrapped in a flex container with the close button beside it (`d-flex justify-content-center align-items-start`).
- After successfully signing, the user should navigate back to the General Settings page. The General Settings page supports a `confirm-signature` query parameter that polls until `timesheetAccessPermitSigned` is true.
