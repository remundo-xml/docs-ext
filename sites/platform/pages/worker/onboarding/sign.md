# Document Signing

Sign onboarding documents via SignNow or DocuSeal.

## Route

`/onboarding/:workerType/:documentName/documents/:documentId/sign`

## Overview

The signing page handles the full lifecycle of an onboarding document signature: checking for an existing signed document, initiating a signing request if needed, and displaying the appropriate signing interface.

## Signing providers

Two signing providers are supported, determined by the onboarding requirement's `signingProvider` field:

- **SignNow** (default) -- renders in an iframe via a signing link
- **DocuSeal** -- renders via an embedded `DocuSealViewer` component using an `embedUrl`

## Page header

Displays the document name from the route parameter. A checkmark icon appears next to the title when the candidate document status is `Accepted`.

## Initialization flow

1. The EOR instance ID is extracted from the `documentId` (the portion before the first colon)
2. The system checks for an existing candidate document via `getCandidateDocumentByDocId`
3. The onboarding requirement is fetched to determine the signing provider and template ID
4. If a candidate document exists with status `Accepted`, `InProgress`, or `Rejected`:
   - The signed PDF is fetched from blob storage and displayed in a `PdfViewer`
   - The existing signing link or embed URL is also retrieved
5. If no candidate document exists, or the signing provider has changed since the last attempt:
   - A new signing request is initiated via `initiateCandidateOnboardingSigningRequest` (employees) or `initiateContractorOnboardingSigningRequest` (contractors)
   - Polling waits for the candidate document to appear via `pollingGet`
6. The signing document is then polled via `pollingGetCondition` (up to 50 retries at 2-second intervals) until a signer matching the current user appears
7. The signing link or embed URL is extracted and the viewer is rendered

## Display states

- **Loading** -- `LoadingDocument` component shown while initialization is in progress
- **Signed PDF** -- `PdfViewer` rendered when an uploaded signed document exists
- **DocuSeal viewer** -- `DocuSealViewer` rendered when the signing provider is DocuSeal
- **SignNow iframe** -- An iframe with the signing link rendered as the default fallback
- **Error** -- Warning alert shown if initialization fails

## Real-time updates

A WebSocket connection subscribes to `CandidateDocumentsToken` scoped to the candidate's user ID. On `onboarding-document-signed` events:
- If the event data matches the current `documentId`, the page re-initializes to load the signed document

## Behavior notes

- The `documentId` route parameter is a composite: `{eorInstanceId}:{onboardingRequirementId}`
- The document name in the route is used only for display; the requirement is fetched by ID
- If the signing provider on the existing candidate document differs from the current requirement's provider, a new signing request is initiated regardless
