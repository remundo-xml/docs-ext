# Worker General Settings

Worker-level configuration for line manager assignment, team assignment, and approval settings for timesheets, expenses, and absences.

## Route

`/organisations/:orgId/workers/:id/general-settings`

## Layout

### Worker Profile Card

Displays the worker's profile: name, country, contract type, job title, team name, manager names, and HR-only status. Greyed out when the contract has ended.

### Line Manager and Team Assignment

A radio group offering two assignment modes:

#### Assign Line Managers to Worker

- A `PeoplePicker` component allows selecting from available line managers.
- Selected managers are displayed as a `PeopleList`.
- Changes dispatch `AssignLineManagersToWorker` and/or `UnassignLineManagersFromWorker` commands.
- If no managers are selected when confirming, a modal warns that no line manager has been chosen.
- After command dispatch, polls `getWorkerGeneralSettings` until the assigned managers list matches.

#### Assign Team to Worker

- A `TeamMoverPopover` dropdown allows selecting a team from the organisation's teams.
- Selecting a team dispatches `AssignMembersToTeamCommand`; deselecting dispatches `UnassignMembersFromTeamCommand`.
- Polls `getWorkerGeneralSettings` until `assignedTeamId` matches.
- Assigning a team clears the line managers list (managers are inherited from the team).

### Managing Settings

Three expandable accordion sections for Timesheets, Expenses, and Absences. Each section is collapsed by default and toggled by clicking the header row, which displays a category icon, title, subtitle, and a chevron indicator. Each section contains:

#### Submission Status

Displays whether submission is required or not required for the category, derived from cascading settings:
- Worker-level override (e.g. `timesheetsMandatory`)
- Organisation-level setting (e.g. `organisation_TimesheetsMandatory`)
- Country-level setting (e.g. `country_TimesheetsMandatory`)

#### Timesheet-Specific Settings

Shown only for the Timesheets category when `showTimesheetWorkerSettings` is enabled:

- **Timesheet Not Required** -- displays a prompt to request timesheet requirement. Sends `SendTimesheetRequirementSubmission` command. Disabled once sent or when timesheets are already mandatory.
- **Allow Overtime** -- displays a prompt to enable overtime. Sends `SendOvertimeRequirementSubmission` command. Disabled for on-demand workers or once the request is sent.
- **Timesheet Submission** -- shows whether timesheets are required or not required.
- **Overtime Submission** -- shows whether overtime is required or not required.

#### Approval Configuration

Each category shows an `ApprovalRadioGroup` for configuring the approval chain:
- First-level approvers
- Optional second-level approvers
- Approvers are selected from a dropdown list of available managers.
- Changes dispatch a `ModifyApprovers` command and poll `getApproversByEorInstanceId` until the approvers match.
- If no approvers are found, an error message is displayed.

## Behavior notes

- When the contract has ended, the entire page is non-interactive (pointer events disabled, greyed out).
- The page dispatches individual `loaded` events for each section (InitPage, Timesheeting, Expenses, Absences) and only signals fully loaded once all four are complete.
- On initialisation error, an error message is displayed inline.
