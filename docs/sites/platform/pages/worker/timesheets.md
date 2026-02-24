# Timesheets

Submit weekly timesheets for hours worked. The page displays a monthly view of week cards, each representing a single ISO week. Workers enter daily hours, optionally add overtime, and submit for manager approval.

## Route

`/time-sheet`

Supports a `?week=YYYY-WNN` query parameter to deep-link to a specific week (e.g. `/time-sheet?week=2025-W12`). The URL is automatically updated as the worker navigates between months.

## Features

- Submit daily hours worked on a weekly basis
- Navigate by month using a stepper (left/right arrows)
- Add overtime hours and notes with file attachments (up to 4 files per note)
- View approval status per week (Submitted, Approved, Rejected, Overdue)
- View approval history with multi-level approver tracking
- Resubmit rejected timesheets
- Cancel a pending resubmission to revert to the locked submitted state
- Automated timesheets toggle (feature-flagged with `useAutomatedTimesheets`)
- Public holidays displayed as locked days with tooltip showing the holiday name
- Approved absences displayed as locked days with type and date range tooltip
- Weekend days locked unless the tenant allows weekend timesheet submission (`allowTimesheetSubmissionForWeekends`)
- Job constraints enforce maximum hours per day, hours per week, days per week, and overtime limits
- Real-time updates via WebSocket (`TimesheetsToken`) — when a timesheet is approved or rejected, the page reloads automatically
- Different confirmation text for employees vs contractors when submitting

## Behaviour notes

### Engagement selection

The page re-initialises whenever the selected engagement changes. It fetches the worker's contract details, job constraints (different API endpoints for employees vs contractors), absences for the contract, and public holidays for the engagement country and region.

### Schedule calculation

The weekly schedule is derived from one of two sources:
- The contract's `weekSchedule` field (if set), processed by `calculateSchedule`
- The country-level job constraints, processed by `getScheduleFromJobConstraints`

### On-demand schedule type

If the contract has a `ScheduleType.OnDemand` tag, a different description is shown and the automated timesheets toggle is hidden.

### Automated timesheets

When the `useAutomatedTimesheets` feature flag is enabled, a checkbox appears below the page description. Toggling this checkbox calls `automatingTimesheets` or `deautomatingTimesheets` and refreshes the month view. Automated timesheets pre-fill hours based on the worker's schedule.

### Contract date boundaries

- Weeks before the contract start date (adjusted by `maximumNegotiatingAgeMonths`) are disabled
- Weeks after the contract end date are disabled with a tooltip: "This contract has ended"
- Future weeks (beyond the current ISO week) are disabled and cannot be submitted

### Validation rules

At the **day level**:
- Hours cannot exceed `maxNumberOfHoursPerDay` from job constraints
- Overtime hours cannot exceed `overtimeMaxHoursPerDay`
- Hours are entered in 0.5-hour (30-minute) increments

At the **week level**:
- Total hours cannot exceed `maxNumberOfHoursPerWeek`
- Total working days cannot exceed `maxNumberOfDaysPerWeek`
- Overtime hours cannot exceed `overtimeMaxHoursPerWeek`

Validation errors are shown inline beneath the relevant day box or weekly total. The submit button is disabled while any validation error exists.

### Overtime notes

Each week supports an optional overtime note with text and up to 4 supporting files. When a note is saved, it persists via `submitOvertimeNote` and `submitTimesheetOvertimeNoteFiles`. Notes can be viewed (read-only) on locked timesheets by clicking the chat icon.

## How to submit a timesheet

### Step 1: Navigate to the timesheet page

Go to **Timesheets** from the sidebar. The page shows the current month with each week displayed as a card.

### Step 2: Select the week

Use the month stepper (left/right arrows) to navigate to the correct month. Each week card shows the week number, date range, and current status.

### Step 3: Enter daily hours

Click on a week to expand it. For each working day, enter your hours using the time entry interface. Days with approved absences (holiday, sick leave) or public holidays are locked and cannot be edited. Weekends are locked unless your contract allows weekend work.

### Step 4: Add overtime (optional)

If overtime is enabled for your contract, click **Add Overtime** to expand the overtime section. Enter overtime hours separately for each day. You can also attach an overtime note with a text explanation and up to 4 supporting files.

### Step 5: Submit the week

Click **Submit** at the bottom of the week card. A confirmation modal appears — confirm that the hours are accurate and click **Confirm**. The week status changes to "Submitted".

## After submission

- **Submitted** (hourglass icon) — awaiting manager approval. The week is locked.
- **Approved** (check mark) — accepted by your manager.
- **Rejected** (exclamation icon) — needs revision. The rejection reason is shown in a tooltip on the chat icon. Click **Resubmit** to make corrections and submit again. You can also click **Cancel** to discard your changes and revert to the previously submitted values.
- **Overdue** — approval has not occurred within the expected timeframe.

Each status displays the relevant timestamp (submitted date, approved date, rejected date, or overdue date) and shows a multi-level approval stage indicator when approvers are configured.
