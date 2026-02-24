# General Settings

Organisation-wide toggles for enabling or disabling timesheets, expenses, absences, and auto-approval features. Displayed as a tab within Company Settings, conditional on a feature flag.

## Route

`/organisations/:organisationId/company-settings/general-settings`

Accepts an optional `confirm-signature` query parameter. When present, the page polls until `timesheetAccessPermitSigned` is true before rendering.

## Sub-routes

`/organisations/:organisationId/company-settings/general-settings/sign` -- Timesheet access permit signing page (navigated to when enabling timesheets without a signed permit).

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

## Visibility

Conditional on the `showOrganisationGeneralSettingsTab` feature flag. Tab index 5 in Company Settings.

## Toggle Settings

### Platform Settings

Three on/off toggles controlling which features workers can use:

#### Timesheets

- Toggle button with On/Off states.
- Turning on: opens a confirmation modal ("Please confirm you wish your workers to submit timesheets via platform."). Confirming sends a `TimesheetSettingChangedForOrganisation` command.
- Turning off: if `timesheetAccessPermitSigned` is true, sends the command directly. If not signed, shows a link to the signing page at `.../general-settings/sign`.
- The toggle shows amber (warning) state when `timesheetAccessPermitSigned` is false.

#### Expenses

- Simple on/off toggle.
- Sends `ExpenseSettingChangedForOrganisation` command immediately on toggle.

#### Absences

- Simple on/off toggle.
- Sends `AbsenceSettingChangedForOrganisation` command immediately on toggle.

### Approval Settings

#### Auto Timesheet Approval

- On/Off toggle.
- Disabled (non-interactive) when `timesheetAccessPermitSigned` is true.
- When Off: timesheets require manual approval by the employer.
- When On: timesheets are automatically approved.
- Sends `AutoTimesheetApprovalSettingChangedForOrganisation` command on toggle.

## Behavior notes

- Settings are fetched via `getOrganisationDto` on page load.
- A `CongratulationsModal` component is present but not triggered from this page directly.
- The page layout is constrained to 40vw width.
