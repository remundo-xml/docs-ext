# Agreement Viewer

View and download employment agreements and assignment sheets.

## Route

`/my-engagements/:id/agreement/:workerType`

## Overview

Displays a PDF document in an embedded viewer.

- PDF is fetched from the API based on engagement ID and worker type
- Download button saves with filename format:
  - "Employment Agreement - {id}.pdf" for employees
  - "Assignment Sheet - {id}.pdf" for contractors
- On error, a "Document not found" card is shown with a link to contact support
