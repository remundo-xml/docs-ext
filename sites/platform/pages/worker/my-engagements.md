# My Engagements

View and manage employment and contractor engagements.

## Route

`/my-engagements`

## Sub-routes

- `/my-engagements/:id/details` - Engagement details
- `/my-engagements/:id/agreement/:workerType` - Employment or service agreement PDF (workerType is `employee` or `contractor`)

## Engagement list

Engagements are displayed as a horizontal carousel of cards. Each card shows:

- Company name
- Job title
- Country (with flag)
- Worker contract type badge (Employee, Contractor, or Individual Contractor)
- Status indicator and text (e.g. "awaiting employee signature")

Ended contracts appear greyed out and are not interactive. Clicking a card selects it and loads its timeline below.

## Engagement timeline

Below the carousel, the selected engagement shows a status timeline. The links shown depend on the current status:

- Pending/awaiting signature statuses: Offer Terms link only
- Signed/in-progress statuses: Offer Terms, Employment Agreement (or Assignment Sheet for contractors)
- Active/onboarded status: Offer Terms, Employment Agreement or Service Agreement, Engagement Details, and Assignment Sheet for contractors
- HR-only mode: Engagement Details link only

### Engagement statuses

Draft, Pending, Required, Deactivated, Archived, Accepted, Expired, EorcSigned, ClearancePending, CandidateSignPending, CandidateSigned, JoiningDocumentsApprovalPending, JoiningDocumentsFailed, JoiningDocumentsVerified, Ended.

## Engagement details

The details view at `/:id/details` displays expandable sections:

### Organisation details
- Billing entity name
- Worker type
- Role title
- Role location (country with flag)
- Start date
- End date (or "Open-Ended")

### Line management and team
- Line managers (avatar list with hover tooltip showing name and job title)
- Assigned team name (or "Unassigned")

### Timesheets
- Submission requirement (required / not required)
- Overtime submission (allowed / not allowed)
- First and second level approvers

### Expenses
- Submission permission (permitted / not permitted)
- First and second level approvers

### Absences
- Submission permission (permitted / not permitted)
- First and second level approvers

## Agreement viewer

The agreement view at `/:id/agreement/:workerType` shows the PDF document in an embedded viewer.

- Download available with filename format "Employment Agreement - {id}.pdf" or "Assignment Sheet - {id}.pdf"
- Shows a "Document not found" error card with a support link if the document is unavailable
