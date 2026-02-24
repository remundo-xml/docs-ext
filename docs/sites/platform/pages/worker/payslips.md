# Payslips

View and download payslip documents. The page displays a list of payslip cards on the left and a PDF preview on the right. This page is only available to candidate/worker users with the `showCandidatePayslips` setting enabled.

## Route

`/payslips`

## Roles

Only visible to candidate (worker) users. If the current user is not a candidate or `showCandidatePayslips` is disabled, the page redirects to `/404`.

## Features

- List of payslips displayed as selectable cards, ordered by pay period
- Support for both **Payslip** and **P60** document types
- Each card shows: document type, pay period (year / month), post date, and a file attachment icon
- PDF preview panel with inline rendering of the selected payslip
- Fullscreen toggle for the PDF preview — expands the preview to fill the viewport
- PDF download button for each payslip
- Active card highlighting — the currently selected payslip card has a distinct border style

## Layout

The page uses a two-column layout:

- **Left column** — a scrollable list of `PayslipCard` components rendered by `PayslipList`. Each card displays the document type (Payslip or P60), the month and year, the post date, and a paperclip icon for the attached file.
- **Right column** — the `PayslipView` component showing the payslip as an embedded image/PDF. A fullscreen button in the top-right corner expands the preview. A **Download** button below the preview allows the worker to save the payslip file locally.

### Fullscreen mode

When the fullscreen button is clicked, the payslip list is hidden and the preview expands to fill the page. A close (X) button and a contract/minimise button allow the worker to return to the normal two-column view.

### Card selection

Clicking a payslip card selects it and loads the preview. Clicking the same card again hides the preview. The first payslip is automatically selected on page load.

## How to view a payslip

### Step 1: Navigate to the payslips page

Go to **Payslips** from the sidebar. The page loads with the most recent payslip selected and its preview visible.

### Step 2: Select a payslip

Click on any payslip card in the list. The card highlights and the preview panel updates to show the selected document.

### Step 3: View in fullscreen (optional)

Click the fullscreen icon (arrows) in the top-right corner of the preview to expand it. Click the minimise icon or the X button to return to the normal view.

### Step 4: Download

Click the **Download** button below the preview to save the payslip file to your device.
