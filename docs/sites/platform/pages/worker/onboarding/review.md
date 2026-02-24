# Document Review

Preview and review onboarding documents before acceptance.

## Route

`/onboarding/:eorId/review/:documentId`

## Overview

The review page displays a single onboarding document via the `JoiningDocumentPreview` component. It loads the engagement's onboarding requirements and candidate documents, then locates the specific requirement and any matching uploaded document by the `documentId` parameter.

## Data loading

1. The engagement (EOR instance) is fetched by the candidate's email and the `eorId` route parameter
2. Active onboarding requirements are loaded for the engagement
3. Candidate documents already submitted for the engagement are loaded
4. Previously reviewed documents (tracked in the `reviewedDocuments` store) are merged into the candidate documents list as accepted entries
5. The specific requirement and its matching candidate document are identified by `documentId`

## Document display

The `JoiningDocumentPreview` component renders the document content and provides:
- Document preview (PDF or image viewer)
- File upload for documents requiring attachments
- Close button that navigates back to `/onboarding?engagement=:eorId`

## Review tracking

- When the document is first viewed, a `viewed-document` event fires (once only)
- This triggers `submitCandidateDocumentReviewed` which marks the document as reviewed without requiring explicit confirmation
- The document ID is added to the `reviewedDocuments` store for local tracking

If the document's action type is `Review` and no explicit confirmation is needed, the review submission happens silently. If confirmation is required, `submitCandidateDocumentReviewedAndPoll` is called instead, which polls until the candidate document appears in the API response.

## Action button visibility

Action buttons (upload, accept) are hidden when:
- The document status is `Accepted`
- The document status is `InProgress`
- The engagement contract has ended
- The document action type is `Review` (review-only documents have no further action after viewing)

## File upload

For documents requiring a file attachment, the user can upload via the preview component. On submission, `uploadAndSubmitDocument` is called with the requirement, engagement ID, candidate ID, and worker contract type. The uploaded document is added to the local list and the card data is refreshed.
