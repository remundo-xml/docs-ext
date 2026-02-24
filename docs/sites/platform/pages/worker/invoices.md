# Worker Invoices

View and create contractor invoicing reports. This page is available for contractors only — it filters engagements to show only those with `WorkerContractType.Contractor`.

## Route

`/invoices`

## Roles

Contractor workers only. The engagement dropdown filters to contractor-type engagements. If no contractor engagements exist, the **Generate Report** button is disabled.

## Features

- Generate invoicing reports based on approved timesheets and/or expenses for a selected date range
- Select source type: Service Fees (timesheets only), Expenses only, or Service Fees and Expenses
- Include or exclude individual timesheets and expenses from the report
- Hide already-processed (locked) timesheets and expenses with a toggle
- View generated invoicing reports with full details including worker info, bank details, billing company, and line items
- Total amount displayed both as a number and in words (e.g. "one thousand two hundred USD and fifty cents")
- Upload a PDF invoice against a generated report
- Submit an invoice with a reference number and issue date
- Withdraw a pending or draft invoice
- Edit withdrawn or rejected invoices (re-generates a report with the same date range)
- Delete draft invoicing reports permanently
- Export generated reports as CSV
- View invoice history grouped by status in accordion sections
- Engagement selection dropdown when multiple contractor engagements exist
- Multi-level approval notes and rejection reasons displayed on invoice cards

## Layout

The page displays a title, subtitle, and disclaimer text at the top. Below that:

- **Engagement dropdown** — shown when the worker has multiple contractor engagements; allows switching between them
- **Generate Report** button — opens the invoice details form
- **Invoice details form** (`InvoiceDetailsForm`) — shown when creating a new report; includes worker info, address, bank details, date range selection, source type, and a billing breakdown
- **Generated invoice report** (`GeneratedInvoiceReport`) — shown when viewing a previously generated report; displays the full invoice with worker info, billing company, service fees table, expenses table, totals, bank details, and action buttons

### Accordion sections

Generated invoices are displayed in five collapsible accordion sections:

1. **Drafted Invoice Reports** — invoices with status `Draft` or no status. Shows **Submit Invoice** and **Upload Invoice** buttons on each card.
2. **Submitted Invoices and Invoice Reports** — invoices with status `Pending`. View-only.
3. **Processed** — invoices with status `Approved`. Shows approval date, approval note, and payment due date.
4. **Rejected** — invoices with status `Rejected`. Shows rejection date and rejection note.
5. **Withdrawn** — invoices with status `Withdrawn`. Can be deleted.

### Invoice card details

Each `InvoiceCard` displays:
- Invoice ID
- Engagement info (job title and entity name)
- Invoice period (date range)
- Source type (Service Fees, Expenses, or both)
- Total amount with currency
- Status with colour-coded corner icon (hourglass for pending, check for approved, exclamation for rejected/withdrawn)
- Approval or rejection notes (if any)
- Payment due date (if approved)
- PDF attachment indicator (if a PDF has been uploaded)
- Timestamp of last update

## How to create an invoice

### Step 1: Navigate to invoices

Go to the **Invoices** page from the sidebar. If you have multiple contractor engagements, select the relevant engagement from the dropdown at the top.

### Step 2: Generate a report

Click the **Generate Report** button. The invoice details form opens showing:

- **Worker Info** — your name, worker ID, company name (if applicable), and tax ID
- **Invoice Report Details** — date range (from/to), invoice period, reference number, description, source type selector, and issue date
- **Service Fees table** (if source type includes timesheets) — lists approved timesheets within the date range with week number, hours, rate, and total. Each row can be toggled to Include or Exclude. Already-processed timesheets are excluded by default.
- **Expenses table** (if source type includes expenses) — lists approved expenses within the date range with description, amount, and include/exclude toggle
- **Total Net Amount** — sum of included items, displayed in currency and in words
- **Bank Details** — pre-populated from your profile (bank name, account number, SWIFT, address)
- **Worker Address** — pre-populated from your profile

### Step 3: Review and generate

Review the included items and total. Click **Generate Report**. The system generates an invoicing report and the page polls until the report is available. The report appears in the "Drafted Invoice Reports" accordion.

### Step 4: Upload a PDF (optional)

Click **Upload Invoice** on the draft invoice card to attach your own PDF invoice. Once a PDF is attached, the **Submit Invoice** button becomes available.

### Step 5: Submit the invoice

Click **Submit Invoice** on the draft card (or from the generated report view). A modal appears asking for:
- **Reference** — your invoice reference number
- **Issue Date** — the date you are issuing the invoice

Click **Confirm** to submit. The invoice status changes to "Pending" and moves to the Submitted section.

## Invoice statuses

- **Draft** (no corner icon) — generated but not yet submitted. Can be edited, deleted, or have a PDF uploaded.
- **Pending** (yellow hourglass) — submitted, awaiting approval. Can be withdrawn.
- **Approved** (green check) — accepted by the employer. Shows approval date, optional approval note, and payment due date.
- **Rejected** (red exclamation) — declined, with a rejection note explaining why. Can be edited to create a new report with the same date range.
- **Withdrawn** (red exclamation) — cancelled by the worker. Can be deleted permanently or edited to create a new report.

## Managing invoices

- Click any invoice card to view the full generated report with all details
- From the generated report view, use the action buttons at the bottom: **Save CSV**, **Edit Invoice** (for rejected/withdrawn), **Close**, **Withdraw** (for pending/draft), **Upload Invoice** (for draft without PDF), or **Submit Invoice** (for draft with PDF attached)
- The CSV export includes all invoice details in a downloadable format
