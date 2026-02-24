# Confirm Signature

Processing page that confirms a candidate's agreement signature and redirects to the appropriate minimum terms page.

## Route

`/offers/:id/confirm-signature`

## Overview

This page is shown after a candidate signs their employment agreement or assignment sheet. It polls the backend until the signature is confirmed, then redirects the user back to the minimum terms page.

## Display

The page shows a centered layout with:
- A Remundo logo in the left column (hidden when rendered inside an iframe via `window.parent`)
- A "Processing your request ..." heading with a spinner
- A decorative home page illustration

The layout fills the full viewport height.

## Confirmation flow

1. On mount, `confirmSignature` is called immediately
2. Polling via `pollingGetCondition` fetches the EOR instance by email and ID, checking until the status reaches `CandidateSigned` or above
   - Polling runs with `pollForever: true` and `maxRetries: 60`
3. Once confirmed, the agreement document is fetched via `Documenting.getAgreement` (with the `forceDownload` flag set to `true`)
4. If the page is running inside an iframe (`window.parent` exists), the parent window is reloaded
5. Navigation redirects based on the worker contract type:
   - **Contractor**: navigates to `/contractor-candidate-offer/:id/main-terms`
   - **Employee**: navigates to `/candidate-offer/:id/main-terms`
