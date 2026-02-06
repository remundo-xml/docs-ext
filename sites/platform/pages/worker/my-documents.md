# My Documents

Access employment documents across all engagements.

## Route

`/my-documents`

## Sub-routes

- `/my-documents?view=all-engagements` - View documents across all engagements
- `/my-documents/preview/:docType/:docId` - Document preview

## Engagement selection

A dropdown at the top lets the user pick which engagement's documents to view. Each option shows "Job Title - Entity Name" with an active badge for current engagements. There is also an "All Organizations" option that switches to `?view=all-engagements` and shows documents from every engagement.

Switching engagement clears the current search and reloads documents.

## Search and filtering

A multi-query search bar filters documents. Multiple terms can be separated by commas (stored in the URL as `?queries=term1,term2`). All terms must match (AND logic). Search runs against document name, organisation name, job title, and file name. Results are sorted alphabetically by name.

## Document types

### Contract
Employment agreements for employees or assignment sheets for contractors.

### Services agreement
For contractors and individual contractors that have an agreement version set. Duplicate versions are deduplicated automatically.

### On-demand services agreement
For contractors with an "On Demand" schedule type. Displayed separately from standard services agreements.

### Onboarding documents
Documents uploaded during onboarding. Some require signing (have a signing ID) while others are review-only.

### Onboarding tasks
Active onboarding requirements for the "Worker First Day" phase. Displayed with a light blue background to distinguish them from other documents.

### Insurance policy
Insurance templates based on the medical insurance level (Basic, Standard, or Premium) for the engagement's country. Can contain multiple file attachments.

## Document card

Each document card shows:

- Document name
- Job title (only in all-engagements view)
- Organisation name
- Date uploaded (or "Insurance Date" for insurance policies)
- File name (clickable link; insurance policies may have multiple file buttons)
- Uploaded by (hidden for services agreements, insurance, and onboarding tasks)
- Date verified (hidden for services agreements, insurance, and onboarding tasks)

## Document preview

The preview route at `/my-documents/preview/:docType/:docId` opens either a PDF viewer or an image viewer depending on the file content type.

- Download button to save the file
- Close button returns to the documents list, preserving the previous engagement filter and search terms
- Insurance policies with multiple attachments show navigation dots to step through files (controlled by `?idx` query param)
