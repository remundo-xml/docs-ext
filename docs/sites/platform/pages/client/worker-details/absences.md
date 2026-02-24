# Absences

Paginated list of a worker's illness/absence requests with filtering by status, approval actions, and grid/list view toggle.

## Route

`/organisations/:orgId/workers/:id/absences`

## Layout

Uses the shared `ApprovalSectionView` component configured for illness requests.

### View Selector

Dropdown with options: Pending, Approved, Rejected (Paid and Overdue views are excluded).

### Table Columns (List View)

- Status
- Request (absence type)
- Approvals (approval chain progress)
- Requested (days requested)
- Used (days used)
- Date Submitted
- Calendar (date range)
- Note

### Grid View

Displays `ApprovalCard` components with absence-specific icons (`AbsenceApprovalIcons`) and additional content (`AbsenceAdditionalContent`).

### Approval Actions

Clicking an item navigates to its detail view. Approve and Decline buttons open the `PendingApproval` modal.

## Data Loading

Approvals are fetched for `RequestType.Illness` only, scoped to the worker's EOR instance.

## Behavior notes

- Grid/list toggle state is persisted in the `workersAbsenceListViewSelected` store.
- Reuses the `WorkerAnnualLeaveTableRow` component for list view row rendering (shared with annual leave).
- The Request column shows the absence/request type via the `ApprovalRequestTypeTag` component.
- Each table row includes a checkbox for batch selection.
- Clicking a row navigates to the approval detail view for that item.
- The Requested and Used columns show the number of days (`requestedDays` and `usedDays`).
- The Calendar column renders an inline `CalendarDisplayPopup` showing the date range.
- The Note column shows a chat icon coloured yellow if a note exists, grey otherwise.
- Responsive: at widths below 1200px, the Used, Date Submitted, Calendar, and Note columns are hidden. At widths below 450px, the Approvals column is also hidden.
