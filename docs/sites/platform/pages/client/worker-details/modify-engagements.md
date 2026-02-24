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

`ModifyStartDate` -- allows changing the start date. Dispatches `InitiateStartDateChangeCommand` with the new date and amendment ID.

#### Pay Revision

- **Contractor**: `ModifyContractorPayRate` -- allows changing the pay rate (amount, currency, time unit). Dispatches `InitiatePayRevisionContractorCommand`.
- **Employee**: `ModifyAnnualSalary` -- allows changing the annual salary. Dispatches `InitiatePayRevisionEmployeeCommand`.

#### Allowances (Contractor only)

`ModifyAllowances` -- allows modifying allowance labels and values. Dispatches `InitiateAllowanceChangeCommand` with a key-value map of allowance changes.

#### Termination

`ModifyTerminationDate` -- allows setting an early termination date. Dispatches `InitiateEarlyTermination` command.

### Changes on Contract Section

`ChangesOnContract` component displays the amendment history and allows setting the effective date.

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
