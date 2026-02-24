# Engagement Details

View organisation, team, and submission configuration for a specific engagement.

## Route

`/my-engagements/:id/details`

## Overview

The details view shows expandable accordion sections for the selected engagement, fetched via `getTenantCandidateEngagementDetails`. The page title is translated from the `my-engagements.engagementDetails.title` i18n path. The container has a minimum width of 35rem and a width of 30%.

## Organisation details

Displayed in a two-column grid layout:

- **Billing entity name** (`selectedEntityName`)
- **Worker type** (resolved via `getWorkerContractTypeString`)
- **Role title** (`jobTitle`)
- **Role location** (country name with flag, resolved via `isoToCountryName`)
- **Start date** (formatted with `formatDateRemundoStandard`)
- **End date** (formatted, or "Open-Ended" when not set)

## Line managers and team

- **Line managers** displayed as an avatar list (`ProfilePicture` with size `xs`) with hover tooltips (via `InfoTip`) showing name and job title. If assigned line managers exist, those are shown; otherwise, managers of unassigned workers are used.
- **Assigned team name** (or "Unassigned" when no team is set)

## Timesheets

- **Submission requirement** (required or not required, derived from engagement, organisation, or country-level `timesheetsMandatory` settings in priority order)
- **Overtime submission** (allowed or not allowed, derived from `overtimeEnabled` or `organisation_OvertimeEnabled`)
- **First level approvers** (avatar list with hover tooltips)
- **Second level approvers** (avatar list, only shown when second-level approvers exist)

## Expenses

- **Submission permission** (permitted or not permitted, derived from `expensesEnabled` or `organisation_ExpensesEnabled`)
- **First level approvers** (avatar list with hover tooltips)
- **Second level approvers** (avatar list, only shown when second-level approvers exist)

## Absences

- **Submission permission** (permitted or not permitted, derived from `absencesEnabled` or `organisation_AbsencesEnabled`)
- **First level approvers** (avatar list with hover tooltips)
- **Second level approvers** (avatar list, only shown when second-level approvers exist)

Multi-level approvers are shown for each section where applicable. Each approver is rendered with a `ProfilePicture` and `InfoTip` containing the approver's full name and job title.
