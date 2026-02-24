# Pending Approvals

Paginated list of worker approval requests (holidays, illness/absences, timesheets, expenses) with filtering by type, status view, and search. Supports approve/decline actions via modal.

## Route

`/organisations/:organisationId/pending-approvals`

Accepts optional query parameters:
- `view` -- Pending, Approved, Rejected (default: Pending). Paid and Overdue views are conditionally available.
- `filter` -- Request type name (e.g. "Holiday", "Expense")
- `query` -- Comma-separated search terms (worker names)

## Sub-routes

`/organisations/:organisationId/pending-approvals/:approvalId` -- Detail view for a specific approval.

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Layout

### Statistics Bar

Rendered by the `StatisticsList` component. Displays approval counts by request type, fetched via `getApprovalOrganisationStats`. Stats are scoped to the selected view and billing entity. Each type is clickable to filter the list. Types shown depend on tenant license (filtered via `filterUnusedApprovalStats`):
- **Holiday** -- Hidden when `tenantLicense.absencesEnabled` is false.
- **Illness** -- Hidden when `tenantLicense.absencesEnabled` is false.
- **Timesheet** -- Always shown (if timesheets exist).
- **Expense** -- Hidden when `tenantLicense.expensesEnabled` is false.

Clicking a type toggles it as the active filter via `selectRequestType`. Clicking the same type again clears the filter back to "All".

### Search and Filter Bar

Rendered by the `SearchFilter` component:

- **View selector dropdown**: Pending, Approved, Rejected. "Paid" is added when the Expense or Timesheet type is selected (via `updateViewSelections`).
- **Search input** with local autocomplete (matches against `requesterName` in loaded approvals via `getSearchFieldSuggestions`).
- **Active type filter** displayed as a removable chip. Removing a type filter resets the view to Pending if it was on Paid.
- View selection is cached in session storage.

### Grid/List Toggle

Controlled by the `pendingApprovalsListViewSelected` store:

**List view** -- `Table` with columns:
- Checkbox (`th-box`, fixed 3.75rem width)
- Name (`th-name`)
- Type (`th-type`, clickable column header toggles `hrOnly` filter via `toggleHrOnlyFilter`)
- Request (`th-request`)
- Status (`th-status`)
- Approvals (`th-approvals`, approval chain progress)
- Date Submitted (`th-date-submitted`)
- Calendar (`th-calendar`, date range)
- Note (`th-note`)

Each row is rendered by `PendingApprovalTableRow`.

**Grid view** -- `ApprovalCard` components with:
- Type-specific icons (`ExpenseIcons`, `AbsenceIcons`, `AnnualLeaveIcons`, `TimesheetIcons`) in the `icons` slot
- Approval status labels
- Approver chain display
- Footer with Approve/Decline buttons (`ApprovalButtons` in the `footer-actions` slot)

Card props are derived via `toApprovalCardProps(approval)`.

### Approval Actions

Clicking an approval item in either view navigates to `/organisations/:organisationId/pending-approvals/:approvalId` (preserving the current query string).

Approve and Decline buttons open a `PendingApproval` modal:
- Approve: confirms the approval.
- Decline: sets `isDeclineSelected` and shows decline-specific content in the modal.
- On completion (`requestComplete` event), the approval is removed from the pending list and the list is refreshed by re-applying the current filter.

## Pagination

- Items per page selector via dropdown: 10, 25, 50, 100, 200.
- Page size preference persisted in `pendingApprovalsListPageSize` store.
- Changing view, type filter, or search terms resets to page 1 (via `resetPagination`).
- Sticky pagination section at bottom of viewport (`.pagination-section` with `position: sticky; bottom: 0`).
- `Pagination` component receives `total`, `current`, and `paginationLimit` props.

## Data Loading

- Approvals fetched via `getPendingApprovalByOrgIdAndBillingEntity` with search parameters including billing entity, page, page size, view, type, filters, and hrOnly flag.
- Statistics fetched via `getApprovalOrganisationStats` scoped to the selected view and billing entity.
- Holiday and absence stores updated internally via `updateHolidayStoreInternal` and `updateAbsencesStoreInternal` after each data load.
- On mount, cached view, approval type, and queries are restored from query parameters.

## Behavior notes

- On fetch failure, an error notification is shown via `showErrorNotification` and an empty list is displayed.
- The `hrOnly` filter is toggled by clicking the "Type" column header in list view.
- View selection is cached in session storage via `sessionStorage.setItem('selectedView', ...)`.
- List view table headers are responsively hidden below 1200px: Date Submitted, Calendar, Status, Type, and Note columns are removed via CSS `display: none`.
- A skeleton loading animation (8 rows with `skeleton-loading` keyframe) is shown while data loads.
- The "items per page" text is hidden on mobile screens narrower than 550px (`.hide-on-mobile`).
