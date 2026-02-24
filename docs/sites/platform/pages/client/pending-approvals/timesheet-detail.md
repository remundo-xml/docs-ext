# Timesheet Detail

Detail view for a specific timesheet approval request, showing a week-by-week time entry display and approval actions.

## Route

Rendered within `/organisations/:organisationId/pending-approvals/:approvalId` when the request type is Timesheet.

## Layout

A two-column responsive grid layout (`row g-3`) that stacks on small screens.

### Approval Card (Left Column)

Rendered via the `Approval` component (`col-12 col-lg-6`). Shows request metadata and dispatches `approve-request` and `decline-request` events.

The approval card displays:
- **Request banner** coloured by request type, with the type name ("Timesheet") and icon
- **Approval stage indicator** (`ApprovalStageV2`) with first/second-level approver names and action status
- **Status** with display status, approver/rejector name, and date
- **PaymentDue** status shows the payment due date
- **Week number**: "Week {weekNumber}"
- **Weekly hours**: total weekly hours from `approval.timesheet.weeklyHours`
- **Overtime weekly hours** (shown when `overtimeWeeklyHours` is not 0 and exists; displayed in red/error colour)
- **Submitted date** (formatted via `formatDateRemundoStandard`)
- **Start date**: Monday's date from `approval.timesheet.submitted.monday.date`
- **End date**: Sunday's date from `approval.timesheet.submitted.sunday.date`
- **Overtime note** (shown when `overtimeNote` exists and is not empty)
- **Approval buttons** (shown via `allowApprovalAction` check; includes second-level pending restriction text)
- **Rejection reason** (shown when status is Rejected; displays `approval.comment` in a bordered card)

### Timesheet Display (Right Column)

Displayed in the right column (`col-12 col-lg-6`, with `w-80 w-md-100` width classes).

- **"Timesheet" heading** (h4, styled with `text-remundo`)
- **Month header** -- Displays the submission month and year formatted per user locale from `$userLocaleStore` (e.g. "January 2025") using `toLocaleDateString` with `month: 'long'` and `year: 'numeric'`.
- **Week display** -- Rendered via the `WeekDisplay` component inside a bordered wrapper (`week-display-wrapper` with `border: 1px solid var(--remundo-secondary-color)`). Receives `eorId`, `status` (approval status), `timesheet` (timesheet data from `approval.timesheet`), and `country` (from `approval.country`).

### Overtime Note Files

Shown when `approval.timesheet.overtimeNoteFiles` exists and has entries:
- A "Files attached" label (`i18n: pending-approvals.detail-view.file-attached`) with a fullscreen toggle button (arrows-fullscreen icon)
- `MultiFilePreview` component for viewing attached files, bound to `approval.timesheet.overtimeNoteFiles`
- File blobs are fetched on demand via `getTimesheetBlob` using the file name, year (`Number(approval.timesheet.year)`), week (`Number(approval.timesheet.week)`), and EOR ID
- Changing the file index triggers `updateTimesheetFile`, which loads the blob for the selected file if not already loaded (`selected.file` is null)
- A fullscreen modal (`Modal` with size "xl", id: `file-preview-modal`) is available for expanded file viewing, toggled by `isFilePreviewOpen`

## Data Loading

On initialisation (`pInit`):
1. If `overtimeNoteFiles` exist and have entries, loads the first file blob (index 0) via `getTimesheetBlob`.
2. The blob string is stored on the file object (`selected.file = blobString`), triggering a reactive update.
3. Additional file blobs are loaded on demand when the user navigates through the file list (via `itemChanged` event from `MultiFilePreview`).

## Behavior notes

- The week display area has a styled border using the secondary colour variable.
- The layout is responsive: at widths below 768px, the `week-display-wrapper` uses reduced padding (`1rem`); below 576px, further padding reduction (`0.75rem`).
- The `week-display-container` has `max-width: 100%` to prevent overflow.
- If fetching a file preview fails, an error notification is shown via `showErrorNotification('Failed to show file preview')`.
