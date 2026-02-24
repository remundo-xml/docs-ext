# Expense Detail

Detail view for a specific expense approval request, showing expense metadata, receipt images, and approval actions.

## Route

Rendered within `/organisations/:organisationId/pending-approvals/:approvalId` when the request type is Expense.

## Layout

### Request Summary Card

Top card with the request banner (coloured by type) showing:
- Title: "{requesterName}'s request"
- Approval stage indicator (first-level and second-level approver names, action status)
- Expense title
- Expense code (or "N/A")
- Payment/Purchase order number (editable when pending; max 15 characters)
- Reimbursement type (defaults to "Payment to Worker")
- Description (truncated to 150 characters)
- Overall amount in local currency (with invoicing currency shown if different)
- "Adjusted Rate" badge (shown when an `incurredAmount` exists)
- Status display with approver/rejector name and date
- Payment due date (shown for PaymentDue status)
- Approver notes link (shown when approval history exists; opens `ApprovalHistoryModalV2`)

### Edit Mode

When the approval is neither approved nor rejected:
- A pencil icon enables editing of the payment order number and description.
- Submit dispatches `EditExpenseCommand` and polls until the changes are confirmed.
- Cancel reverts to the original values.

### Expense Item Card

Second card showing details for the selected expense item:
- Type of expense
- Mileage details (unit, value, unit cost) -- when applicable
- Location -- when provided
- Sum (transaction amount in item currency)
- Sum worker (in local currency; with adjusted rate display and deviation percentage when incurred amount differs)
- Sum invoicing (in invoicing currency)
- Submitted date
- Transaction date (when present)
- Files attached indicator with tooltip listing file names
- Missing receipt reason (when present)
- Note (when present)

### Item Pagination

When multiple expense items exist, an `ItemPaginationSelector` allows cycling through items.

### Receipt Viewer

Displayed alongside the cards when receipts are attached:
- PDF files rendered via `PdfViewer`
- Image files (PNG, JPEG) rendered as `<img>` elements
- HEIC files are converted to base64 before display
- Navigation arrows for cycling through multiple attached files
- Download button for the current receipt

### Approval Buttons

Approve and Decline buttons shown when the approval is Pending or Overdue and the current user is permitted to act (checked via `allowApprovalAction`). A restriction text is shown for second-level pending approvals.

## Data Loading

On initialisation, resolves the selected approval item (by `itemId` parameter or defaults to the first item). Fetches receipt blobs from the `expenses` blob container.

## Behavior notes

- The blob type is determined from the file extension (`.pdf`, `.png`, `.jpg`/`.jpeg`).
- Files are fetched via `getBlob` with container name "expenses", organisation ID, requester ID, and file name.
- Deviation percentages above 5% are highlighted with an error style.
