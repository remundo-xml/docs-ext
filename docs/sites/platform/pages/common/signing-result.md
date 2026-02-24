# Signing Result

Display the outcome of a document signing ceremony and redirect the user back to the appropriate workflow.

## Route

`/signing-result/:documentType/:id/:result`

- `:documentType` -- the type of document signed: `timesheet-access-permit`, `onboarding`, or `work-order`
- `:id` -- the document or engagement identifier (Base64-encoded for onboarding documents)
- `:result` -- the signing outcome: `finished` or `declined`

## Roles

Authenticated users only (Candidate, Company Owner, Company Admin, Team Admin, Tenant Admin, Tenant Contributor).

## Features

- Displays a Remundo-branded outcome page with an image and message based on the document type and result
- Supports three document types, each with tailored content:
  - **Timesheet access permit** -- shows a success message with a button to return to the timesheet page
  - **Onboarding** -- polls the API to confirm the document status has updated, then shows a success message with a button to return to onboarding
  - **Work order** -- tracks signing state in local storage and shows a loading spinner while processing, with a 60-second timeout warning
- For `declined` results, shows a generic "signing declined" message
- Redirects to `/404-page` if the `:result` parameter is neither `finished` nor `declined`
- Page is rendered outside the main application layout (`notInLayout: true`)

## Behavior notes

- For **onboarding** documents with `finished` result, the component decodes the Base64 `:id` to extract the EOR ID and document ID, then uses `pollingGetCondition` to repeatedly check whether the document status has changed to `Accepted` or `InProgress` before showing the completion dialog.
- For **work orders** with `finished` result, the document ID is stored in local storage (`IsWorkOrderBeingSigned`) to track in-progress signings. A timer warns the user after 60 seconds if processing has not completed.
- The redirect button navigates using `window.parent.location.replace` to support rendering inside an iframe (used by the signing ceremony provider).
- For timesheet access permits, the redirect appends `?confirm-signature=true` to the parent page URL.
