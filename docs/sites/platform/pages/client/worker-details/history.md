# Timeline History

Chronological timeline of events for a worker, including contract milestones, timesheet activity, absence submissions, and expense events.

## Route

`/organisations/:orgId/workers/:id/history`

## Layout

### Worker Profile Card

Displays the worker's profile at the top: name, country, contract type, job title, team name, manager names, and HR-only status.

### Search and Date Filter Bar

A horizontal bar with:
- Search input (text search)
- From date picker (`vaadin-date-picker`)
- To date picker (`vaadin-date-picker`)
- Filter button

### Timeline

Rendered via the `EmployeeHistory` component, which uses `TimelineGeneric` internally. Events are grouped by date and sorted newest first. The current year is hidden from date labels.

## Event Types

Events are fetched via `getWorkerHistory` and include:

- `WorkCommenced` -- Synthesised from the worker's start date if it is in the past
- `AbsenceSubmitted` -- Worker submitted an absence request
- `AbsenceApproved` -- Absence request was approved
- `TimesheetSubmitted` / `TimesheetResubmitted` -- Timesheet submitted or resubmitted
- `TimesheetApproved` -- Timesheet was approved
- `TimesheetApprovalOverdue` -- Timesheet approval is late
- `TimesheetOverdue` -- Timesheet submission is overdue
- `HrOnlyOnboarded` -- HR-only worker was onboarded
- `ContractSignedByCandidate` -- Contract was signed (appends worker type)
- `TimesheetNotRequired` -- Timesheets marked as not required
- `ExpensesNotRequired` -- Expenses marked as not required
- `AbsencesNotRequired` -- Absences marked as not required

Each event displays a type-specific icon and a translated description. Events with associated documents (timesheets, absences, expenses) include a hyperlink to the corresponding pending approval detail view.

## Behavior notes

- When the contract has ended, the entire view is displayed with reduced opacity and greyscale.
- If no history events exist, a "no history" message is shown.
- On initialisation error, the error is displayed inline.
