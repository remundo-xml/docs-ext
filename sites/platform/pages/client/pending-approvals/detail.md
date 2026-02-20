# Approval Detail View

General detail view for a specific pending approval, routing to the appropriate type-specific detail component.

## Route

`/organisations/:organisationId/pending-approvals/:approvalId`

## Layout

### Close Button

A close button in the top-right navigates back to the originating list:
- If the URL contains `/workers/`, navigates to the worker's type-specific tab (e.g. `expenses`, `timesheets`, `annual-leave`, `absences`).
- Otherwise, navigates to `/organisations/:organisationId/pending-approvals` with the current query string preserved.

### Type-Specific Detail Component

Based on `approval.requestType`, renders one of:
- `ExpenseDetails` -- for `RequestType.Expense`
- `TimesheetDetails` -- for `RequestType.Timesheet`
- `AbsenceDetails` -- for `RequestType.Illness` or `RequestType.Holiday`

### Approval Modal

A shared `PendingApproval` modal handles both approve and decline actions:
- On approve: confirms the approval.
- On decline: sets `isDeclineSelected` and shows decline-specific content.
- After entitlement changes (absences), the detail component is refreshed via a `refreshKey`.

## Data Loading

Fetches the approval via `getPendingApproval` using the `approvalId` from the route. The EOR ID is extracted from the approval ID (format: `eorId:suffix`).

## Behavior notes

- A spinner is shown while the approval data loads.
- The detail component is re-rendered when the approval object changes (via `{#key approval}`).
