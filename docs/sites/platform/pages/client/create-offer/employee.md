# Employee Offer Wizard

Five-step wizard for creating a new employee engagement offer, displayed inside a closable tile with a progress line.

## Route

`/organisations/:organisationId/create-eorinstance/employee`

## Progress Line Steps

The step labels in the progress line are: **Worker Details**, **Job Location**, **Job Descripton**, **Work Schedule**, **Start Date & Salary**.

## Steps

### Step 1: Worker Details

`CandidateDetails` component (`CandidateDetailsForm`). Collects the candidate's personal information:

- **First Name** (required; max 50 characters; auto-capitalised; restricted to valid name characters)
- **Last Name** (required; max 50 characters; auto-capitalised; restricted to valid name characters)
- **Email** (required; validated against email format; must not match the logged-in user's email)
- **Phone** (dial code + number via `PhoneDetails` component)

The Done button is disabled until first name, last name, and a valid email are provided.

### Step 2: Job Location

`JobLocation` component. Country and region selection. On completion, fetches job constraints for the selected country/region via `getJobConstraintsByCountryAndOrganisationId` and sets the default currency to the country's primary currency.

### Step 3: Job Description

`JobDetails` component (`JobDetailsForm`). Fields:

- **Job Title** (required; max 50 characters; combobox with custom value allowed; populated from `fetchedJobDescriptions`)
- **Role Description** (Markdown editor; required; minimum 3 characters)
  - Option to write a custom description or select a preset description (stepper to cycle through available presets)
  - Preset descriptions are loaded from `fetchedJobDescriptions` matching the selected title
  - The description is HTML-escaped before submission

The Done button is disabled until a title is provided and the description has at least 3 characters.

### Step 4: Work Schedule

`WorkSchedule` component. Working hours, days per week, and schedule type configuration.

### Step 5: Start Date & Salary

`StartDateAndSalary` component (`StartDateAndSalaryForm`). Fields:

- **Start Date** (required; date picker with locale-aware formatting)
- **End Date** (optional; via `StartDateAndEndDate` sub-component)
- **Currency** (required; combobox; always includes the engagement country's currency, the organisation country's currency, EUR, USD, GBP; billing entity currency added when selected)
- **Annual Salary** (required when pricing is enabled; integer field; minimum is `minimumAnnualSalary` adjusted by exchange rate; maximum 1,000,000,000)
  - When the selected currency differs from the country currency, the minimum salary is recalculated via `getExchangeRate`
  - For part-time workers (weekly hours below `partTimeTotalHoursLimit`), the label reads "Annual Salary (Pro-Rated)"
  - If the salary is below minimum, a hyperlink appears to raise a minimum salary ticket via `raiseMinimumSalaryTicket`
- **Remaining Holiday** (required when pricing is disabled; integer 0-30)
- **Enable Pricing** checkbox (shown when `allowDisablePricing` is true)
- **Billing Entity** (required; select dropdown; "Add Billing Entity" option navigates to entity creation; hidden from view but validated)

## Submission Process

On completing the final step, a progress bar tracks eight tasks:

1. **Submitting Price** -- Sends `CalculatePrice` command (or `DisablePricing` if pricing is disabled).
2. **Submitting Contract** -- Sends the contract creation command with wizard state, engagement type, creator ID, organisation ID, job constraints, and invoicing currency.
3. **Submitting Regional Standards** -- Sends regional employment standards for the selected country.
4. **Submitting Regional Holidays** -- Sends regional holiday data (must wait for contract confirmation first).
5. **Generating Price** -- Polls EOR instance until price is confirmed.
6. **Generating Contract** -- Polls EOR instance until contract exists.
7. **Generating Regional Standards** -- Polls until regional standards are applied.
8. **Generating Regional Holidays** -- Polls until holidays are applied.

### Currency Handling

- The salary is always submitted in the job location country's currency.
- If the user selected a different currency, the salary is converted using `getExchangeRate` before submission.
- The entity's `invoicingCurrency` (defaulting to USD) is also passed to the contract command.

### Billing Entity

The active billing entity (from local storage `SelectedBillingEntityId`) is attached to the wizard state at submission time.

### After Submission

- On success: wizard state is cleared from local storage, user is redirected to `/organisations/:organisationId/contract-quote/:eorId`.
- On failure: error notification shown. If the contract was partially created, a warning is shown and the user is redirected to the contract quote page. In non-production environments, the error message includes details.

## Wizard State Persistence

- Wizard state is persisted to local storage (`WizardState` key) so it survives page reloads.
- The engagement type is also stored in local storage.
- On successful submission, local storage is cleared.

## Behavior notes

- The close button on the tile is disabled during submission.
- The step indicator is disabled during submission.
- The Back button is hidden on the first step and during submission.
- Navigation between steps is possible by clicking the progress line indicators (when not disabled).
- The `AbortController` cancels in-flight requests on page unload or component destruction.
