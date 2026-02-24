# Approval Detail View

General detail view for a specific pending approval, routing to the appropriate type-specific detail component.

## Route

`/organisations/:organisationId/pending-approvals/:approvalId`

## Layout

### Close Button

A close button (`btn-close`) in the top-right (float-end, z-index 3, relatively positioned) navigates back to the originating list:
- If the URL contains `/workers/`, navigates to the worker's type-specific tab based on `approval.requestType`:
  - `RequestType.Expense` -- `/workers/:eorId/expenses`
  - `RequestType.Timesheet` -- `/workers/:eorId/timesheets`
  - `RequestType.Holiday` -- `/workers/:eorId/annual-leave`
  - `RequestType.Illness` -- `/workers/:eorId/absences`
- Otherwise, navigates to `/organisations/:organisationId/pending-approvals` with the current query string preserved.

### Type-Specific Detail Component

Based on `approval.requestType`, renders one of:
- `ExpenseDetails` -- for `RequestType.Expense`
- `TimesheetDetails` -- for `RequestType.Timesheet`
- `AbsenceDetails` -- for `RequestType.Illness` or `RequestType.Holiday`

Each detail component receives the `approval` object and dispatches `approve-request` and `decline-request` events. `TimesheetDetails` also receives `eorId`. `AbsenceDetails` also receives `refreshKey`.

### Approval Modal

A shared `PendingApproval` modal handles both approve and decline actions:
- `chosenApproval` is bound to the `approval` object.
- `isDeclineSelected` is bound to control decline-specific content.
- `isModalOpen` is bound to toggle the modal.
- On approve: confirms the approval.
- On decline: sets `isDeclineSelected` and shows decline-specific content.
- After entitlement changes (absences), the `refreshKey` is incremented via the `entitlement-change` event, triggering a re-initialisation of the `AbsenceDetails` component.

## Data Loading

Fetches the approval via `getPendingApproval` using the `approvalId` from the route params. The EOR ID is extracted from the approval ID by splitting on `:` and taking the first part (format: `eorId:suffix`).

## Behavior notes

- A `Spinner` is shown while the approval data loads (inside `{#await pInit()}`).
- The detail component is re-rendered when the approval object changes (via `{#key approval}`).
- The `approveOrDeclineButtonClicked` helper sets `isDeclineSelected` and opens the modal. It is called by both the Approve button (with `false`) and Decline button (with `true`).
