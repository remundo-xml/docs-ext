# General Settings

Organisation-wide toggles for enabling or disabling timesheets, expenses, absences, and auto-approval features. Displayed as a tab within Company Settings, conditional on a feature flag.

## Route

`/organisations/:organisationId/company-settings/general-settings`

Accepts an optional `confirm-signature` query parameter. When present, the page polls via `pollingGetCondition` until `timesheetAccessPermitSigned` is true on the organisation DTO before rendering the settings.

## Sub-routes

`/organisations/:organisationId/company-settings/general-settings/sign` -- Timesheet access permit signing page (navigated to when enabling timesheets without a signed permit).

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

## Visibility

Conditional on the `showOrganisationGeneralSettingsTab` feature flag. Tab index 5 in Company Settings.

## Layout

The page layout is constrained to `40vw` width. It contains two sections with headers and descriptions.

### Platform Settings

Title and description rendered via i18n keys `organisation.general-settings.title`, `organisation.general-settings.desc.line-1`, `organisation.general-settings.desc.line-2`. A subheader and secondary description are rendered via `organisation.general-settings.subheader` and `organisation.general-settings.desc-2`.

Three on/off toggles controlling which features workers can use, each rendered with an icon, title, description, and `OrgToggleButton`:

#### Timesheets

- Toggle button with On/Off states (icon: `timesheet.svg`).
- **Turning on**: opens a confirmation `Modal` ("Please confirm you wish your workers to submit timesheets via platform."). Confirming flips `timesheetEnabled` and sends a `TimesheetSettingChangedForOrganisation` command.
- **Turning off**: sets `showRequiredContractText = true` and flips `timesheetEnabled`. If `timesheetAccessPermitSigned` is true, sends the command directly. If not signed, the description area shows a link button to the signing page at `.../general-settings/sign` (navigates via `navigate`).
- The toggle shows amber (`showAmber`) state when `timesheetAccessPermitSigned` is false.

#### Expenses

- Simple on/off toggle (icon: `expenses.svg`).
- Sends `ExpenseSettingChangedForOrganisationCommand` immediately on toggle.

#### Absences

- Simple on/off toggle (icon: `absences.svg`).
- Sends `AbsenceSettingChangedForOrganisationCommand` immediately on toggle.

### Approval Settings

A second section with its own subheader (`organisation.general-settings.subheader-2`) and description (`organisation.general-settings.desc-3`).

#### Auto Timesheet Approval

- Title: `organisation.general-settings.ata.title` (icon: `auto-timesheet-approval.svg`).
- On/Off toggle.
- Disabled (non-interactive) when `organisation.timesheetAccessPermitSigned` is true (the `disabled` prop on `ToggleButton`).
- Description text explains the Off and On states using bold formatting (i18n keys `organisation.general-settings.ata.desc-1`, `organisation.general-settings.ata.off`, `organisation.general-settings.ata.desc-2`, `organisation.general-settings.ata.on`).
- Sends `AutoTimesheetApprovalSettingChangedForOrganisationCommand` on toggle.

## Data Loading

- Settings are fetched via `getOrganisationDto(params.organisationId)` on page load.
- The organisation DTO provides `timesheetEnabled`, `expenseEnabled`, `absenceEnabled`, `autoTimesheetApprovalEnabled`, and `timesheetAccessPermitSigned`.
- When the `confirm-signature` query parameter is present, the page uses `pollingGetCondition` to wait for `timesheetAccessPermitSigned` to become true before initialising the toggle states.

## Behavior notes

- A `CongratulationsModal` component is rendered but not triggered from this page directly.
- Toggle commands are fire-and-forget (no polling after the command is sent).
- The modal for timesheet confirmation has Submit and Cancel buttons; Cancel simply closes the modal without changing the toggle state.
