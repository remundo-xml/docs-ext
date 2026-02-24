# Worker Details

Tabbed detail view for an individual worker, providing access to personal details, history, settings, timesheets, leave, expenses, engagements, and a calendar view.

## Routes

- `/organisations/:orgId/workers/:id/:route` -- Worker detail view with tab selected by `:route` segment
- `/organisations/:orgId/workers/:id/details` -- Default tab (personal details)
- `/organisations/:orgId/workers/:id/history` -- Timeline history
- `/organisations/:orgId/workers/:id/general-settings` -- Worker-level settings
- `/organisations/:orgId/workers/:id/emergency-contacts` -- Emergency contact information
- `/organisations/:orgId/workers/:id/documents` -- Documents (disabled)
- `/organisations/:orgId/workers/:id/payment-history` -- Payment history (disabled)
- `/organisations/:orgId/workers/:id/timesheets` -- Timesheet submissions
- `/organisations/:orgId/workers/:id/annual-leave` -- Annual leave management
- `/organisations/:orgId/workers/:id/absences` -- Absence records
- `/organisations/:orgId/workers/:id/expenses` -- Expense claims
- `/organisations/:orgId/workers/:id/engagements` -- Engagement history
- `/organisations/:orgId/workers/:id/calendar` -- Calendar view

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Tabs

Tabs are displayed horizontally. Each tab can be conditionally disabled based on feature flags, tenant licenses, and worker-level settings.

| # | Tab name | Icon | Condition |
|---|---------|------|-----------|
| 1 | Details | `bi-person` | Always enabled |
| 2 | Timeline History | `ri-workers-history` | Always enabled |
| 3 | General Settings | `ri-worker-general-settings` | Always enabled |
| 4 | Emergency Contact | Custom `EmergencyContact` icon | `useEmergencyContacts` setting |
| 5 | Documents | `bi-file-earmark-text` | Always disabled |
| 6 | Payment History | `bi-wallet2` | Always disabled |
| 7 | Timesheets | `ri-timesheet` | `workerSubmissionSettings.timesheetsEnabled` |
| 8 | Annual Leave | `ri-annual-leave` | `workerSubmissionSettings.absencesEnabled` |
| 9 | Absences | `ri-absence-settings` | `tenantLicense.absencesEnabled` AND `workerSubmissionSettings.absencesEnabled` |
| 10 | Expenses | `bi-receipt` | `tenantLicense.expensesEnabled` AND `workerSubmissionSettings.expensesEnabled` |
| 11 | Engagements | `bi-clipboard2-data` | Always enabled |
| 12 | Calendar | `bi-calendar` | Always enabled |

## Navigation

- A close button (X) in the top-right corner navigates back to `/organisations/:orgId/workers`.
- If an invalid or disabled tab route is provided, the user is redirected to the default `details` tab (preserving query string).
- Tab components are loaded dynamically via `svelte:component`.
- While a tab is loading, a `DelayedSpinner` is displayed with the message "Preparing {tab name}...". The tab content is hidden until the component dispatches a `loaded` event.
- If a tab component dispatches an `error` event, a notification is shown with the error message (or a generic "try again later" message if none is provided).

## Initialisation

On mount:
1. Fetches the EOR instance via `getEorInstance` to determine worker-level submission settings (timesheets, absences, expenses enabled).
2. Stores settings in `workerSubmissionSettingsStore`.
3. Resolves the active tab from the `:route` URL parameter.

## Behavior notes

- The translation path for tab names is `workers.detail-view.tabs.`.
- Each tab renders its own component with the same `params` object (`id`, `route`, `orgId`).
- Documents and Payment History tabs are permanently disabled (not yet implemented).
