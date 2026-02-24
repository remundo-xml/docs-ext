# Worker Invoices

View and create contractor invoices. Invoicing is available for contractors only — employees do not see this page.

## Route

`/invoices`

## Features

- Create pro-forma invoices based on timesheets or expenses
- View invoice history with status tracking
- Upload invoice PDFs
- Download generated invoices
- Delete withdrawn invoices

## How to create an invoice

### Step 1: Navigate to invoices

Go to the **Invoices** page from the sidebar. If you have multiple contractor engagements, select the relevant engagement from the dropdown at the top.

### Step 2: Create a new invoice

Click the **Create** button. The system calculates an invoice based on your submitted timesheets and expenses for the current period. A form opens showing:

- **Invoice ID** (auto-generated)
- **Job Title** and **Entity Name** from your engagement
- **Invoice Period** (date range)
- **Source Type** — Timesheets, Expenses, or Manual
- **Amount** — automatically calculated from your submitted data
- **Currency** — from your contract

### Step 3: Submit the invoice

Review the details and click **Submit Invoice**. A confirmation modal appears — click **Confirm** to submit. Your invoice status changes to "Saved" (pending approval).

### Step 4: Upload a PDF (optional)

Once your invoice is in "Saved" status, you can upload a PDF by clicking the **Upload Invoice** button on the invoice card.

## Invoice statuses

- **Saved** (yellow hourglass) — submitted, awaiting approval
- **Approved** (green check) — accepted by the employer
- **Rejected** (red exclamation) — declined, with a rejection note explaining why
- **Withdrawn** — cancelled; can be deleted permanently

## Managing invoices

Each invoice card shows the invoice ID, engagement details, period, source type, total amount, status, and any approval/rejection notes. Click an invoice to view the full generated report. Withdrawn invoices can be deleted using the trash icon.
