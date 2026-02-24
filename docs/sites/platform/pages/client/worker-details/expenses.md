# Expenses

Paginated list of a worker's expense claims with filtering by status, approval actions, and grid/list view toggle.

## Route

`/organisations/:orgId/workers/:id/expenses`

## Layout

Uses the shared `ApprovalSectionView` component configured for expense requests.

### View Selector

Dropdown with options: Pending, Approved, Rejected, Paid (Overdue is excluded).

### Table Columns (List View)

- Status
- Approvals (approval chain progress)
- Description
- Type (expense category)
- Sum (amount)
- Date Submitted
- Note

### Grid View

Displays `ApprovalCard` components with expense-specific icons (`ExpenseApprovalIcons`).

### Approval Actions

Clicking an item navigates to its detail view. Approve and Decline buttons open the `PendingApproval` modal.

## Data Loading

Approvals are fetched for `RequestType.Expense` only, scoped to the worker's EOR instance.

## Behavior notes

- Grid/list toggle state is persisted in the `workersExpenseListViewSelected` store.
- Uses the `WorkerExpenseTableRow` component for list view row rendering.
- Unlike the other approval tabs, the Paid view option is available for expenses.
- Each table row includes a checkbox for batch selection.
- Clicking a row navigates to `/organisations/:orgId/workers/:id/approvals/:approvalId`.
- The Description column text is truncated with an ellipsis via the `Ellipses` component.
- The Sum column displays the amount with currency code using the `MoneyDisplay` component.
- The Note column shows a chat icon coloured yellow if a note exists, grey otherwise.
- Responsive: at widths below 1200px, the Date Submitted, Description, Type, and Note columns are hidden. At widths below 450px, the Approvals column is also hidden.
