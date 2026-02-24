# Timesheets

Paginated list of a worker's timesheet submissions with filtering by status, approval actions, and grid/list view toggle.

## Route

`/organisations/:orgId/workers/:id/timesheets`

## Layout

Uses the shared `ApprovalSectionView` component configured for timesheet requests.

### View Selector

Dropdown with options: Pending, Approved, Rejected (Paid and Overdue views are excluded).

### Table Columns (List View)

- Status
- Approvals (approval chain progress)
- Weekly Hours
- Date Submitted
- Calendar (date range)
- Note

### Grid View

Displays `ApprovalCard` components with timesheet-specific icons (`TimesheetApprovalIcons`) and additional content (`TimesheetAdditionalContent`).

### Approval Actions

Clicking a timesheet item navigates to its detail view. Approve and Decline buttons open the `PendingApproval` modal.

## Data Loading

Approvals are fetched for `RequestType.Timesheet` only, scoped to the worker's EOR instance.

## Behavior notes

- Grid/list toggle state is persisted in the `workersTimesheetListViewSelected` store.
- Uses the `WorkerTimesheetTableRow` component for list view row rendering.
- Each table row includes a checkbox for batch selection.
- Clicking a row navigates to `/organisations/:orgId/workers/:id/approvals/:approvalId`.
- The Note column shows a chat icon coloured yellow if a note exists, grey otherwise. Hovering displays the note text in a tooltip.
- Responsive: at widths below 1200px, the Date Submitted, Calendar, and Note columns are hidden. At widths below 450px, the Approvals column is also hidden.
