# Expenses

Submit and track expense claims.

## Route

`/expenses`

## Features

- Submit new expense claims with multiple items
- Attach receipts and documentation (PDF, JPEG, PNG, HEIC)
- Track approval status (Pending, Approved, Rejected, Paid)
- View expense history
- Save drafts (up to 5) and submit when ready
- Revert rejected expenses back to draft for resubmission

## How to submit an expense

### Step 1: Create a new expense

Navigate to the **Expenses** page from the sidebar. Click the **Create** button. Enter a title for your expense (3-45 characters), for example "Hotel stay in London" or "Client dinner". Click **Create** to proceed.

### Step 2: Add expense items

Each expense can contain one or more items. For each item, fill in:

- **Transaction Date** — the date the expense was incurred. Cannot be a future date.
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

Click **Upload Receipt** to attach supporting documents. You can upload up to 4 files per item (JPEG, PDF, PNG, HEIC). You can also use your camera to capture a receipt directly.

If you don't have a receipt, check **No receipt?** and select a reason (Lost receipt, Damaged receipt, Receipt wasn't issued, Not Applicable).

### Step 4: Add more items (optional)

Click the **+** button to add another expense item to the same submission. Each item has its own fields and receipts. Use the pagination selector to switch between items.

### Step 5: Submit

Click **Submit**. A confirmation modal appears — review the details, accept the disclaimer, and click **Confirm**. Your expense is sent for approval.

## Managing expenses

- **Drafts** — expenses you've started but not yet submitted appear in the Draft Expenses section. You can edit or delete them.
- **Submitted** — after submission, expenses appear in Expenses History with their current status.
- **Rejected** — if an expense is rejected, you can revert it to draft, make corrections, and resubmit.
