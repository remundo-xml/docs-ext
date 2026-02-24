# Worker Details Tab

Personal and employment details for an individual worker, displayed in a card form with limited edit capability.

## Route

`/organisations/:orgId/workers/:id/details`

## Layout

A two-column layout. The left column contains the details card; the right column shows a work permit card when available.

### Profile Header

- Profile picture with up to two initials
- Worker type tag (Employee or Contractor)
- HR-only badge with tooltip (shown when `hrOnly` is true)

### Form Fields

All fields are read-only by default. Clicking the pencil icon enables edit mode for the editable fields.

Read-only fields:
- First Name
- Last Name
- Date of Birth (day/month/year display)
- Worker ID (`workerCode`)
- Email
- Document Type
- Document Expiration Date (formatted via `formatDateRemundoStandard`)
- Identification Number
- Work Location ISO (shows `jobLocationRegion` if set, otherwise `jobLocation`)
- Nationality (country combobox, read-only)
- Additional Nationalities (one per entry, read-only)
- Worker Type (Employee or Contractor)
- Home Address (`addressLine`)
- City
- Postal Code
- Dial Code + Phone Number
- Organisation Name (shows `billingEntityName` if set, otherwise `organisationName`)
- Manager (comma-separated list of assigned managers, or managers of unassigned; "Unassigned" if none)
- Team (shown only when `teamId` is present)
- Start Date (formatted per user locale)
- End Date (formatted per user locale; shows "Open Ended" if null)

Editable fields (when edit mode is active):
- Foreign ID (free text input)
- Job Title (dropdown populated from `fetchedJobDescriptions`; uses `changeJobTitle` for employees, `changeRoleTitle` for contractors)
- Job Location (country combobox; dispatches `changeJobLocation` command)

### Edit Behavior

- Save button is enabled only when at least one editable field differs from the stored values.
- On save, each changed field dispatches its own command (`changeJobTitle`/`changeRoleTitle`, `changeJobLocation`, `changeForeignId`).
- After saving, polls `getWorkerDetails` until the `applies` timestamp is newer than the previous value.
- Cancel reverts all fields to stored values.

### Manager Link

A "Assign Managers" link below the Manager field navigates to `/organisations/:orgId/workers/:id/general-settings`.

### Work Permit Card

Displayed in the right column when `workPermit` data exists. Shows document type and expiration date.

## Real-time Updates

WebSocket connection via `WorkerDetailsToken` PubSub channel. On `worker-updated` event, the worker details are re-fetched silently.

## Behavior notes

- When the worker's contract has ended (`isContractEnded`), the entire card is greyed out and form fields are non-interactive.
- The form is scrollable with a max height of 30rem.
- On initialisation error, an error event is dispatched to the parent tab container.
