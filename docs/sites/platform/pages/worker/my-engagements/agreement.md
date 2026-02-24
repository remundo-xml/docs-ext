# Agreement Viewer

View and download employment agreements and assignment sheets.

## Route

`/my-engagements/:id/agreement/:workerType`

Where `:workerType` is either `employee` or `contractor`.

## Overview

Displays a PDF document in an embedded viewer (`PdfViewer` component with toolbar hidden, 80vh height, and 80% zoom).

## Data loading

- The PDF is fetched from the API via `getEmploymentAgreementWithTimestamp` using the engagement ID
- The base64 response is converted to a Blob with `application/pdf` content type
- A skeleton loading animation (title, page, and button placeholders) is shown while the document loads

## Display states

- **Loading** -- skeleton loader with animated gradient placeholders for the document title, page body, and download button
- **Loaded** -- `PdfViewer` rendered with a fade-in transition (200ms), plus a download button below
- **Error** -- a "Document not found" card is shown with a file-x icon, description text, and a link to contact support (opens the Remundo support modal via `showRemundoSupportModal`)

## Download

- Download button saves with filename format:
  - "Employment Agreement - {id}.pdf" for employees
  - "Assignment Sheet - {id}.pdf" for contractors
- The download is triggered via the `download` utility function using the generated blob URL
