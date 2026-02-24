# Document Preview

View documents with type-appropriate viewers.

## Route

`/my-documents/preview/:docType/:docId`

## Query parameters

- `?eor-instance=:id` -- engagement context for the document
- `?idx=:n` -- file index for insurance policies with multiple attachments (0-based)
- `?view=:filter` -- preserved engagement filter from the documents list
- `?queries=:terms` -- preserved search terms from the documents list

## Overview

The preview route opens a viewer appropriate to the file type. The document blob is fetched via `getCandidateDocumentBlobById` using the user ID, document type, document ID, engagement ID, and optional file index.

## Document display

- **PDF files** rendered in an embedded `PDFViewer` component (toolbar hidden, 70vh height)
- **Image files** rendered in an `ImageViewer` component (70vh height)
- The content type is determined from the API response's `contentType` field; if it contains "pdf", the PDF viewer is used; otherwise, the image viewer is used
- A spinner is shown while the document loads

## Multi-file navigation

Insurance policies with multiple attachments show a stepper and navigation dots:
- The file count is fetched via `getCandidateDocumentFileCountById`
- A `Stepper` component allows stepping forward and backward through files
- Navigation dots below the viewer indicate the current file (active dot is larger and primary-colored)
- Clicking a dot or using the stepper navigates to that file index by updating the `?idx` query parameter and replacing the route

## Download

- A download button below the viewer saves the file locally via the `download` utility function

## Close behavior

- A close button (X icon) in the top-right corner returns to the documents list
- The previous engagement filter (`view`) and search terms (`queries`) are preserved in the URL when navigating back to `/my-documents`
