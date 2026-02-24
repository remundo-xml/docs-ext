# Invoices

View and manage organisation invoices.

## Route

`/organisations/:organisationId/invoices`

## Features

- List all invoices
- Filter by status and date
- Download invoice documents

## Layout

The page is arranged in a three-column layout (collapsible on smaller screens):

| Column | Content |
|---|---|
| **Active Payments** | A vertical list of payment cards for invoices that are **Overdue** or **Pending**. |
| **Payment History** | A vertical list of payment cards for invoices that have been **Paid**. |
| **PDF Preview** | An embedded PDF viewer showing the currently selected invoice document, with fullscreen toggle and download controls. |

A page title and description appear above the columns.

### Payment cards (`PaymentCard`)

Each card displays the following fields in a grid layout:

- **Invoice number** (`InvoiceNo`)
- **Billing entity** (`Entity`)
- **Balance** -- amount and currency displayed via `MoneyDisplay` (e.g. "1,000 GBP")
- **File** -- a paperclip icon indicating an attached document
- **Status** -- one of `Overdue`, `Pending`, or `Paid`, colour-coded:
  - Overdue: red with a clock icon
  - Pending: accent colour with an hourglass icon
  - Paid: green with a double-check icon
- **Due date** -- formatted as short month, day, and year (e.g. "Oct 10, 2023")
- **Description** -- a brief description of the invoice

Clicking a card selects it, highlighting it with a primary-colour border and loading its document in the PDF viewer.

### PDF viewer

- Renders the invoice document using the `PdfViewer` component.
- A **fullscreen** button (arrows icon) expands the viewer to fill the page, hiding the payment lists. A **minimise** button returns to the normal layout.
- A **Download** button below the viewer triggers the PDF download.

## Behavior notes

- The page currently uses hardcoded sample data for both active payments and payment history. Backend integration for fetching real invoice data and downloading PDFs is planned.
- The first active payment is selected by default on page load.
- Selecting any payment card (from either the active or history list) updates the `selectedInvoiceNumber` and refreshes the PDF preview.
