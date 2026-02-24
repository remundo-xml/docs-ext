# My Documents

Access employment and onboarding documents across all engagements.

## Route

`/my-documents`

## Sub-routes

- `/my-documents?view=all-engagements` -- view documents across all engagements
- `/my-documents/preview/:docType/:docId` -- document preview
- `/my-documents/preview/:docType/:docId?eor-instance=:id` -- preview with engagement context

## Version routing

A version router (`VersionRouter`) checks the `useNewCandidateDocs` feature flag and renders either the V1 or V2 document list. The documentation below covers V2.

## Engagement selection

A dropdown (`EngagementPicker`) at the top allows the candidate to select which engagement's documents to view. Each option shows "Job Title - Entity Name" with an active badge for current engagements. An "All Organizations" option (using `ALL_ENGAGEMENTS_ID`) is available when `allowAllOption` is set, which switches to the all-engagements mode and shows documents from every engagement. The picker only allows switching when there are more than one engagement.

The previously selected engagement is persisted in the `selectedEngagement` store. Switching engagement clears the current documents and reloads via `getCandidateMinimalDocuments`.

## Search and filtering

A multi-query search bar (`SearchFilter`) filters documents. Multiple terms can be separated by commas (stored in the URL as `?queries=term1,term2`). Search matches against:

- Document display name
- Organisation name
- Job title
- File name

All query terms must match (AND logic via `every`). Results are sorted alphabetically by document name using `localeCompare`. The search filter is disabled (pointer events off, 50% opacity) until an engagement is selected.

## Document types

### Contract

Employment agreements for employees or assignment sheets for contractors.

### Services agreement

For contractors and individual contractors that have an agreement version set. Duplicate versions across engagements are deduplicated automatically.

### On-demand services agreement

For contractors with an "On Demand" schedule type. Displayed separately from standard services agreements.

### Onboarding documents

Documents uploaded during the onboarding process. Some have signing requirements (identified by a signing ID) while others are review-only.

### Onboarding tasks

Active onboarding requirements for the "Worker First Day" phase. Displayed with a light blue background (`bg-light-blue` class) to distinguish them from completed documents.

### Insurance policy

Insurance templates based on the medical insurance level (Basic, Standard, or Premium) for the engagement's country. Can contain multiple file attachments.

## Document card

Each document card (`DocumentCard`) is rendered as a `SmallCard` in a flexible grid layout (350px min width, 400px max, 280px height). Each card shows:

- **Document name** (display name)
- **Job title**
- **Organisation name**
- **Date uploaded** (or "Insurance Date" for insurance policies, formatted with `formatDateRemundoStandard`)
- **File name** (clickable link with paperclip icon; clicking navigates to preview)
- **Uploaded by**
- **Date verified** (formatted when available)

Clicking the file name dispatches a `fileNameClicked` event that navigates to the preview route with the document type, ID, and engagement context as query parameters.

## Navigation to preview

When a file name is clicked, the app navigates to `/my-documents/preview/:docType/:docId` with query parameters:
- `eor-instance` -- the engagement ID
- `idx=0` -- added for insurance policies to support multi-file navigation
- Current filter view and search queries are preserved in the URL
