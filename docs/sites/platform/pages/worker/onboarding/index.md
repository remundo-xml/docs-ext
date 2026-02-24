# Onboarding

Document submission and review page where candidates upload, sign, and track their joining documents for a selected engagement.

## Route

`/onboarding`

## Sub-routes

- `/onboarding?engagement=:eorInstanceId` -- pre-selects an engagement
- `/onboarding/:eorId/review/:documentId` -- document preview and review
- `/onboarding/:workerType/:documentName/documents/:documentId/sign` -- document signing

## Engagement selection

A dropdown at the top allows the candidate to select which engagement's documents to view. Engagements with status `Archived` are filtered out. Selecting an engagement updates the URL query parameter and reloads the document list. If an `engagement` query parameter is present on load, that engagement is pre-selected.

## Document loading

For the selected engagement, two data sources are combined:

### Required documents

- Active onboarding document requirements fetched from the API
- Additional system requirements injected based on engagement state:
  - Bank details (conditional on tenant license and engagement configuration)
  - Emergency contacts (conditional on `emergencyContactsEnabled` and the engagement being signed)
- Right-to-work documents have their display name and help tip text populated with the eligibility country name

### Submitted documents

- Candidate documents already uploaded for the engagement
- Additional system submissions (bank details, emergency contacts) fetched separately only after the engagement is signed

## Search and filtering

A multi-query search bar filters documents by display name. Multiple terms can be entered. Filtering applies to both required and submitted document lists independently.

## View modes

Toggled via the list view selector (stored in `workersOnboardingDocsListViewSelected`):

### Card view (default)

Documents organized into three accordion sections:

- Action Required (expanded by default)
- Awaiting Review
- Verified

Each document card shows:
- Requirement title with help tooltip
- Status label (color-coded) with reason tooltip when applicable
- Stage indicator with help tooltip
- File name with paperclip icon and delete option (when a file is attached)
- Action button appropriate to the document state
- Corner icon colored by status: pending (orange), rejected (red), verified (green), in-progress (blue)

### Table view

Alternative tabular layout with the same document groupings and actions.

## Document actions

Actions dispatched from document cards trigger different behaviors:

- `DocumentRequest` -- opens the file upload drop zone modal
- `Review` -- navigates to `/onboarding/:eorInstanceId/review/:documentId`
- `CompleteForm` / `ViewDetails` -- for system documents only (ID must contain "system:"):
  - `bank-details` navigates to `/candidate-details/bank-details`
  - `emergency-contact` navigates to `/candidate-details/emergency-contact`
  - `calendar` navigates to `/candidate-details/calendar`
- `ReviewAndAccept` / `ReviewAndFill` / `ReviewAndSign`:
  - If no template ID, navigates to the review page
  - If template ID exists, navigates to `/onboarding/:workerType/:title/documents/:documentId/sign`
  - The document ID is prefixed with the eorInstanceId if not already present

## File upload

- Drop zone modal accepts PDF files
- Upload triggers `uploadAndSubmitDocument` API call with the document requirement, engagement ID, candidate ID, and worker contract type
- A spinner is shown during upload; the drop zone does not auto-close on confirmation
- After successful upload, the document list is refreshed

## File deletion

- Delete action opens a confirmation modal displaying the file name
- On confirmation, two delete commands are issued (one for the document ID, one for the requirement document ID)
- Polling via `pollingGetCondition` waits until the deleted document no longer appears in the candidate documents list
- After confirmed deletion, the document list is refreshed
- Error notification shown if deletion confirmation fails

## Real-time updates

Subscribes to WebSocket channel `CandidateDocumentsToken` scoped to the candidate's user ID. On `document-updated` events:
- If the event's CorrelationId matches the selected engagement, the document list is refreshed
- If the event data is "bank-details", the document list is also refreshed regardless of correlation ID

The WebSocket connection is established on mount and the event listener is registered once. The emitter is disposed on component destroy.
