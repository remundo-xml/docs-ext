# My Documents

Access employment and onboarding documents across all engagements.

## Route

`/my-documents`

## Sub-routes

- `/my-documents?view=all-engagements` -- view documents across all engagements
- `/my-documents/preview/:docType/:docId` -- document preview
- `/my-documents/preview/:docType/:docId?eor-instance=:id` -- preview with engagement context

## Version routing

A version router checks the `useNewCandidateDocs` feature flag and renders either the V1 or V2 document list. The documentation below covers V2.

## Engagement selection

A dropdown at the top allows the candidate to select which engagement's documents to view. Each option shows "Job Title - Entity Name" with an active badge for current engagements. An "All Organizations" option switches to the `?view=all-engagements` mode and shows documents from every engagement.

Switching engagement clears the current search terms and reloads the document list.

## Search and filtering

A multi-query search bar filters documents. Multiple terms can be separated by commas (stored in the URL as `?queries=term1,term2`). Search matches against:

- Document display name
- Organisation name
- Job title
- File name

Results are sorted alphabetically by document name.

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

Active onboarding requirements for the "Worker First Day" phase. Displayed with a light blue background to distinguish them from completed documents.

### Insurance policy

Insurance templates based on the medical insurance level (Basic, Standard, or Premium) for the engagement's country. Can contain multiple file attachments.

## Document card

Each document card shows:

- Document name
- Job title (only visible in the all-engagements view)
- Organisation name
- Date uploaded (or "Insurance Date" for insurance policies)
- File name (clickable link; insurance policies may have multiple file buttons)
- Uploaded by (hidden for services agreements, insurance policies, and onboarding tasks)
- Date verified (hidden for services agreements, insurance policies, and onboarding tasks)
