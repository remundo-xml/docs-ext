# Expenses

Submit and track expense claims. The page displays a submission form for creating new expenses, a drafts section, and an expense history with status tracking.

## Route

`/expenses`

## Roles

Only available when `expensesEnabled` is true in the tenant license. If disabled, the page redirects to `/404`.

## Features

- Submit new expense claims with multiple items
- Attach receipts and documentation (PDF, JPEG, PNG, HEIC) — up to 4 files per expense item
- Camera capture for receipts directly from the browser
- QR code for uploading receipts from a mobile device
- HEIC image conversion — HEIC files are automatically converted for preview
- Image compression on upload via `compressImage`
- Track approval status (Draft, Pending, Overdue, Approved, PaymentDue, Paid, Rejected)
- View expense history with multi-level approval stage indicators
- Save drafts (up to 5) and submit when ready — attempting to revert a sixth expense to draft shows a max-draft warning modal
- Revert rejected expenses back to draft for resubmission
- Delete draft expenses
- Preview submitted expenses in a detailed view
- File preview modal for viewing attached receipts with option to delete files from drafts
- Currency exchange rate display — when a different currency is selected, the exchange rate is fetched via `getExchangeRateByDate` and the amount is converted automatically
- Real-time updates via WebSocket (`ExpensesToken`) — expense status changes, code reassignments, and mobile upload events are handled live
- New vs legacy layout toggle (feature-flagged with `useNewExpensesLayout`)
- Draft expenses section (feature-flagged with `allowDraftExpenses`)
- Contractor-specific behaviour — employees see an info tooltip on the submission section; contractors do not

## Behaviour notes

### Expense lifecycle

1. **Draft** — the expense is saved locally with a title and items but not yet submitted. Draft expenses appear in the "Draft Expenses" section. Up to 5 drafts can exist simultaneously.
2. **Pending** — submitted and awaiting approval. The expense is locked for editing.
3. **Overdue** — approval has not occurred within the expected timeframe.
4. **Approved** — accepted by the approver.
5. **PaymentDue** — approved and awaiting payment. Shows a payment due date.
6. **Paid** — payment has been processed.
7. **Rejected** — declined, with a rejection note. Can be reverted to draft.

### New layout (V2)

When `useNewExpensesLayout` is enabled, the `ExpenseHistoryV2` component renders accordion sections:
- **Draft** (if `allowDraftExpenses` is enabled)
- **Pending Approval** — pending and overdue expenses
- **Approved** — approved, payment-due, and paid expenses
- **Rejected** — rejected expenses

Each section includes an approval history modal accessible via the journal icon.

### Legacy layout

When `useNewExpensesLayout` is disabled, the page shows a two-column layout:
- Left column: submission form and draft expenses
- Right column: expense history list

### WebSocket events

The page subscribes to several WebSocket event types:
- `ExpenseCodeReassigned` — updates the expense code display without a full reload
- `UploadFileFromMobile` — triggers receipt refresh when a file is uploaded from a mobile device
- `CandidateLoggedInFromPhone` — flags that the worker has connected via mobile
- Standard expense events (`ExpenseSubmitted`, `ExpenseDeleted`) — trigger a polling reload of the full expense list

### Amount validation

- Amounts must be positive (except for Deduction type, which must be negative)
- Maximum amount limit is 1,000,000,000
- For mileage expenses, the unit cost and mileage value must both be positive

## How to submit an expense

### Step 1: Create a new expense

Navigate to the **Expenses** page from the sidebar. Click the **Create** button. Enter a title for your expense (3-45 characters), for example "Hotel stay in London" or "Client dinner". Click **Create** to proceed.

### Step 2: Add expense items

Each expense can contain one or more items. For each item, fill in:

- **Transaction Date** — the date the expense was incurred. Cannot be a future date or before the minimum allowed date.
- **Type** — select from the dropdown:
  - Accommodation
  - Deduction (for negative adjustments)
  - Per Diem
  - Audit Travel Rate
  - Food & Beverage (Breakfast, Lunch, Dinner)
  - Transportation (Airfare, Rail, Taxi, Parking, Gas, Rental, Toll Roads, Mileage)
  - Communication (Telephone, Mobile, Internet)
  - Entertainment, Bank, Credit
- **Location** — select where the expense was incurred.
- **Currency** — defaults to your contract currency. If you select a different currency, the system shows the exchange rate and converts the amount automatically.
- **Amount** — the expense amount. Must be positive (except for Deductions, which must be negative).

If you select **Mileage** as the type, additional fields appear: unit (Miles or Km), mileage value, and unit cost. The amount is calculated automatically.

You can optionally enter a **Charged Amount** if the amount billed differs from the transaction amount, and a **Note** (up to 400 characters) for supporting comments.

### Step 3: Upload receipts

Click **Upload Receipt** to attach supporting documents. You can upload up to 4 files per item (JPEG, PDF, PNG, HEIC). Images are automatically compressed on upload. You can also use your camera to capture a receipt directly, or scan the QR code to upload from your mobile device.

If you don't have a receipt, check **No receipt?** and select a reason (Lost receipt, Damaged receipt, Receipt wasn't issued, Not Applicable).

### Step 4: Add more items (optional)

Click the **+** button to add another expense item to the same submission. Each item has its own fields and receipts. Use the pagination selector to switch between items.

### Step 5: Submit

Click **Submit**. A confirmation modal appears — review the details, accept the disclaimer, and click **Confirm**. Your expense is sent for approval. The system polls for confirmation and updates the UI once the expense code is assigned.

## Managing expenses

- **Drafts** — expenses you've started but not yet submitted appear in the Draft Expenses section. You can edit or delete them.
- **Submitted** — after submission, expenses appear in Expenses History with their current status.
- **Rejected** — if an expense is rejected, you can revert it to draft, make corrections, and resubmit. If you already have 5 drafts, a warning modal explains the limit.

Each expense card displays: submission date, total amount (in base currency), attached file count, notes, status with timestamp, expense code, title, and a multi-level approval stage indicator.
