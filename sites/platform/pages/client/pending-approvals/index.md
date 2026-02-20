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

Displays approval counts by request type, fetched via `getApprovalOrganisationStats`. Each type is clickable to filter the list. Types shown depend on tenant license:
- **Holiday** -- Hidden when `tenantLicense.absencesEnabled` is false.
- **Illness** -- Hidden when `tenantLicense.absencesEnabled` is false.
- **Timesheet** -- Always shown (if timesheets exist).
- **Expense** -- Hidden when `tenantLicense.expensesEnabled` is false.

Clicking a type toggles it as the active filter. Clicking the same type again clears the filter back to "All".

### Search and Filter Bar

- View selector dropdown: Pending, Approved, Rejected. "Paid" is added when Expense or Timesheet type is selected.
- Search input with local autocomplete (matches against `requesterName` in loaded approvals).
- Active type filter displayed as a removable chip.
- Removing a type filter resets the view to Pending if it was on Paid.

### Grid/List Toggle

Controlled by the `pendingApprovalsListViewSelected` store:

**List view** -- Table with columns:
- Checkbox
- Name
- Type (clickable column header toggles `hrOnly` filter)
- Request
- Status
- Approvals (approval chain progress)
- Date Submitted
- Calendar (date range)
- Note

**Grid view** -- `ApprovalCard` components with:
- Type-specific icons (Expense, Absence, Annual Leave, Timesheet)
- Approval status labels
- Approver chain display
- Footer with Approve/Decline buttons

### Approval Actions

Clicking an approval item navigates to `/organisations/:organisationId/pending-approvals/:approvalId` (preserving query string).

Approve and Decline buttons open a `PendingApproval` modal:
- Approve: confirms the approval.
- Decline: marks `isDeclineSelected` and shows decline-specific content in the modal.
- On completion, the approval is removed from the pending list and the list is refreshed.

## Pagination

- Items per page selector: 10, 25, 50, 100, 200.
- Page size preference persisted in `pendingApprovalsListPageSize` store.
- Changing view, type filter, or search terms resets to page 1.
- Sticky pagination section at bottom of viewport.

## Data Loading

- Approvals fetched via `getPendingApprovalByOrgIdAndBillingEntity` with search parameters including billing entity, page, page size, view, type, filters, and hrOnly flag.
- Statistics fetched via `getApprovalOrganisationStats` scoped to the selected view.
- Holiday and absence stores updated internally after each data load.

## Behavior notes

- On fetch failure, an error notification is shown and an empty list is displayed.
- The `hrOnly` filter is toggled by clicking the "Type" column header in list view.
- View selection is cached in session storage.
- List view table headers are responsively hidden below 1200px: Date Submitted, Calendar, Status, Type, and Note columns are removed.
- A skeleton loading animation (8 rows) is shown while data loads.
