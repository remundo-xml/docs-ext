# Timesheet Detail

Detail view for a specific timesheet approval request, showing a week-by-week time entry display and approval actions.

## Route

Rendered within `/organisations/:organisationId/pending-approvals/:approvalId` when the request type is Timesheet.

## Layout

A two-column responsive layout (stacks on small screens).

### Approval Card (Left Column)

Rendered via the `Approval` component. Shows request metadata, status, and dispatches approve/decline events.

### Timesheet Display (Right Column)

- **Month header** -- displays the submission month and year (formatted per user locale, e.g. "January 2025")
- **Week display** -- rendered via the `WeekDisplay` component, showing the timesheet data for the specific week. Receives the EOR ID, approval status, timesheet data, and worker's country.

### Overtime Note Files

Shown when `overtimeNoteFiles` exist on the timesheet:
- A "Files attached" label with a fullscreen toggle button
- `MultiFilePreview` component for viewing attached files
- File blobs are fetched on demand via `getTimesheetBlob` using the file name, year, week, and EOR ID
- A fullscreen modal (`Modal` with size "xl") is available for expanded file viewing

## Data Loading

On initialisation, loads the first overtime note file blob (if any exist) via `getTimesheetBlob`. Additional file blobs are loaded on demand when the user navigates through the file list.

## Behavior notes

- The week display area has a styled border using the secondary colour.
- The layout is responsive: at widths below 768px, the week display wrapper uses reduced padding; below 576px, further padding reduction.
- If fetching a file preview fails, an error notification is shown.
