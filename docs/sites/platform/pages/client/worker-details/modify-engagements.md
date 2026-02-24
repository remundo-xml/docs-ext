# Modify Engagements

Interface for HR users to modify an active worker's engagement terms, including start date, pay, allowances, and termination.

## Route

`/organisations/:orgId/workers/:id/modify-engagements/:action`

Where `:action` is one of: `extension`, `duration-start-date`, `pay-revision`, `allowances`, `termination`.

## Visibility

Conditional on the `useHRModifications` feature flag.

## Layout

### Worker Details Section

Displays the worker's `ProfileCard` (name, country, contract type, job title, team, managers) alongside a `WorkerDetailsCard` showing EOR instance details.

### Modify Engagements Section

A title and description, followed by the action-specific modification component. The selected action is displayed in a highlighted instruction bar.

#### Extension (Contractor only)

`ModifyContractorAgreementPeriod` -- allows extending the contractor's agreement period.

#### Duration / Start Date

`ModifyStartDate` -- allows changing the start date. Dispatches `InitiateStartDateChangeCommand` with the new date, amendment ID, correlation ID (EOR instance ID), and tenant ID. The command is sent to an endpoint that varies by worker type (employee or contractor).

#### Pay Revision

- **Contractor**: `ModifyContractorPayRate` -- allows changing the pay rate (amount, currency, time unit). Dispatches `InitiatePayRevisionContractorCommand` with `PayRate`, `Currency`, and `TimeUnit`.
- **Employee**: `ModifyAnnualSalary` -- allows changing the annual salary. Dispatches `InitiatePayRevisionEmployeeCommand` with `Salary`.

#### Allowances (Contractor only)

`ModifyAllowances` -- allows modifying allowance labels and values. Dispatches `InitiateAllowanceChangeCommand` with a key-value map of allowance changes.

#### Termination

`ModifyTerminationDate` -- allows setting an early termination date. Dispatches `InitiateEarlyTermination` command with the termination date, amendment ID, correlation ID, and tenant ID. The command is sent to an endpoint that varies by worker type.

### Changes on Contract Section

`ChangesOnContract` component displays the current amendment status and allows setting the effective date. It includes:

- **Amendment status** -- shows "Draft" with a coloured label when the amendment is in Draft status.
- **Effective Date** -- a date picker for setting when the amendment takes effect.
- **Change indicators** -- tick icons are shown for each change present on the amendment:
  - Start Date change (when `amendment.startDate` is set)
  - End Date change (when `amendment.endDate` is set)
  - Pay Revision (when `amendment.payRate` or `amendment.annualSalary` is set)
  - Allowances (when `amendment.allowances` is set)
- **Additional Modification dropdown** -- a dropdown button listing all available modification actions (extension, duration/start date, pay revision, allowances, termination). Selecting an action navigates to the corresponding `:action` route via `redirectByActionSelected`.

### Action Buttons

- **Save and Close** -- currently disabled
- **View Amended Quote** -- enabled for pay revision and allowance actions
- **Send for Worker Review** -- enabled when the amendment is in Draft status and the relevant field (start date or termination date) is set. Opens a confirmation modal with a disclaimer checkbox. Dispatches `GenerateAmendingEmploymentAgreementCommand`.
- **Cancel All Changes** -- currently disabled

## Data Loading

On initialisation:
1. Fetches the EOR instance via `getEorInstance`.
2. Fetches worker details via `getWorkerDetails`.
3. Fetches existing amendments via `getAmendmentsByEorId`. If a Draft amendment exists, it is selected; otherwise a new UUID is generated.

After each modification, polls `getAmendmentById` until the amendment's `applies` timestamp is updated.

## Behavior notes

- The action type is derived from the `:action` route parameter and mapped to an `AmendmentType` enum.
- Contractor-specific actions (extension, allowances) are only rendered when the worker is a contractor.
- The confirmation modal for "Send for Worker Review" requires the disclaimer checkbox to be checked before the action button is enabled.
