# Expense Detail

Detail view for a specific expense approval request, showing expense metadata, receipt images, and approval actions.

## Route

Rendered within `/organisations/:organisationId/pending-approvals/:approvalId` when the request type is Expense.

## Layout

A horizontal flex layout (`flex-row`, wraps to column on small screens) with two main sections: cards on the left and receipt viewer on the right.

### Request Summary Card

Top card with the request banner (coloured by `mapRequestTypeToColor[approval.requestType]`) showing:
- **Title**: "{requesterName}'s request" (i18n key: `pending-approvals.detail-view.title`)
- **Approval stage indicator** (`ApprovalStage` / `ApprovalStageV2` component) showing first-level and second-level approver names, action status. Shown when approval is approved or rejected.
- **Expense title** (truncated with `Ellipses` component)
- **Expense code** (or "N/A" when null)
- **Payment/Purchase order number** (editable when pending; `input` with max 15 characters; `readonly` when not editing)
- **Reimbursement type** (defaults to `ReimbursementTypes.PaymentToWorker` when null)
- **Description** (truncated to 150 characters via lodash `truncate`)
- **Overall amount** in local currency (`MoneyDisplay` with `roundedValueWithDecimalPlaces`). If `localCurrency` differs from `invoicingCurrency`, a second `MoneyDisplay` shows the invoicing currency amount in a lighter theme.
- **"Adjusted Rate" badge** (shown when `selectedApprovalItem.incurredAmount` exists)
- **Status display** with approver/rejector name and date:
  - Approved/PaymentDue: shows "by {approverName}"
  - Paid: shows date and "approved by {approverName}"
  - Rejected: shows "by {rejectorName}, {date}"
- **Payment due date** (shown for PaymentDue status, formatted via `formatDateRemundoStandard`)
- **Approver notes link** (shown when `approval.history` exists and has entries; opens `ApprovalHistoryModalV2`)

### Edit Mode

When the approval is neither approved nor rejected (`rejectedAt === null && approvedAt === null`):
- A pencil icon button enables editing of the payment order number and description.
- Edit mode shows a cancel button (X icon) and submit button (checkmark icon).
- Submit dispatches `EditExpenseCommand` with `Id`, `CorrelationId` (EOR ID), `PaymentOrder`, and `Description`.
- Polls via `pollingGetCondition` on `getPendingApproval` until the description and payment order match the edited values.
- Cancel (`onCancel`) reverts to original values via `cloneDeep` and exits edit mode.
- During submission, a spinner replaces the checkmark and both buttons are disabled.
- On error, an error notification is shown and the form reverts.

### Expense Item Card

Second card showing details for the selected expense item, with a type-specific banner:
- **Type of expense** (`selectedApprovalItem.type`)
- **Mileage details** (shown when `mileageValue` exists): unit, value (`mileageValue` + `mileageUnit`), unit cost (`mileageUnitCost` with `MoneyDisplay`)
- **Location** (shown when `location` is present)
- **Sum (transaction)** -- Amount in item currency (`selectedApprovalItem.amount` with `selectedApprovalItem.currency`)
- **Sum worker** (in local currency):
  - When `incurredAmount`, `amountInLocalCurrency`, and `incurredAmountInLocalCurrency` all exist: shows incurred amount (dark theme), original amount (light theme), and deviation percentage. Deviation above 5% is highlighted with error style.
  - Otherwise: shows `amountInLocalCurrency` in dark theme.
  - Includes "Adjusted Rate" badge when applicable.
- **Sum invoicing** (in invoicing currency via `incurredAmountInInvoicingCurrency`)
- **Submitted date** (formatted as US locale: "Mon DD, YYYY")
- **Transaction date** (shown when present; same format)
- **Files attached indicator** with `InfoTip` tooltip listing file blob names on hover (`mouseenter` trigger)
- **Missing receipt reason** (shown when present; via `stringIsNullOrEmpty` check)
- **Note** (shown when present; with overflow-wrap styling)

### Item Pagination

When multiple expense items exist (`approvalItems.length > 1`), an `ItemPaginationSelector` allows cycling through items. Changing the selected item triggers `selectedItemChange`, which updates `selectedApprovalItem` and reloads receipts.

### Receipt Viewer

Displayed alongside the cards when receipts are attached (`!loadingBlobs && picture`):
- **PDF files** rendered via `PdfViewer` (height: 70, toolbar hidden)
- **Image files** (PNG, JPEG) rendered as `<img>` elements (max-width: 50rem, object-fit: contain) inside a scrollable container (min-height: 40rem)
- **HEIC files** are converted to base64 via `convertBase64IfHeicType` before display
- **Navigation arrows** for cycling through multiple attached files (left/right arrow buttons). Dots indicate position; an oval highlights the current item.
- **Download button** (`ButtonRound`) for the current receipt. Downloads using a temporary anchor element with `URL.createObjectURL`.
- When loading blobs and files exist, a `Spinner` is shown.

### Approval Buttons

`ApprovalButtons` component shown when:
- The approval status is `Pending` or `Overdue`, AND
- The current user is permitted to act (checked via `allowApprovalAction` on mount, which returns `{ allow, pendingSecondLevel }`)

Dispatches `approve-request` and `decline-request` events to the parent `DetailView`.

## Data Loading

On initialisation (`pInit`):
1. Resolves the selected approval item by `itemId` parameter (if provided in `params`) or defaults to the first item.
2. Calls `getItemReceipts` to fetch receipt blobs.

Receipt fetching (`getItemReceipts`):
1. For each file in `selectedApprovalItem.files`, calls `getBlob` with container name `"expenses"`, organisation ID, requester ID, and file name.
2. Determines blob type from file extension (`.pdf` -> `application/pdf`, `.png` -> `image/png`, `.jpg`/`.jpeg` -> `image/jpeg`).
3. Converts response to base64 via `convertBase64IfHeicType`, then creates a `Blob` object.
4. Sets the blob name from the original `blobName` with the correct file extension.
5. After all blobs are loaded, selects the first blob and creates an object URL for display.

## Behavior notes

- The blob type is determined from the file extension (`.pdf`, `.png`, `.jpg`/`.jpeg`).
- Deviation percentages above 5% are highlighted with an `error` CSS class.
- All text content (spans, paragraphs) has `user-select: text` for copy-paste support.
- The receipt section has a fixed width of 40rem and min-height of 45rem.
