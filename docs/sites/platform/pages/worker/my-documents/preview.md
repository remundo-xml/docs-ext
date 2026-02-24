# Document Preview

View documents with type-appropriate viewers.

## Route

`/my-documents/preview/:docType/:docId`

## Query parameters

- `?eor-instance=:id` -- engagement context for the document
- `?idx=:n` -- file index for insurance policies with multiple attachments

## Overview

The preview route opens a viewer appropriate to the file type:

- PDF files rendered in an embedded PDF viewer
- Image files rendered in an image viewer
- Download button to save the file locally
- Close button returns to the documents list, preserving the previous engagement filter and search terms via query parameters
- Insurance policies with multiple attachments show navigation dots to step through files (controlled by `?idx` query parameter)
