# Employee Offer Wizard

Five-step wizard for creating a new employee engagement offer, displayed inside a closable tile with a progress line.

## Route

`/organisations/:organisationId/create-eorinstance/employee`

## Steps

### Step 1: Worker Details

`CandidateDetails` component. Collects the candidate's personal information (name, email, nationality, date of birth).

### Step 2: Job Location

`JobLocation` component. Country and region selection. On completion, fetches job constraints for the selected country/region via `getJobConstraintsByCountryAndOrganisationId` and sets the default currency to the country's primary currency.

### Step 3: Job Description

`JobDetails` component. Job title, description, and related fields.

### Step 4: Work Schedule

`WorkSchedule` component. Working hours, days per week, and schedule configuration.

### Step 5: Start Date & Salary

`StartDateAndSalary` component. Start date, end date (if applicable), salary amount, and currency selection. Currency can differ from the country's currency (conversion happens at submission).

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
