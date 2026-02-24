# Services Agreement

View and download a specific version of the Remundo services agreement PDF.

## Route

`/services-agreements/:scheduleType/:contractorType/:version`

- `:scheduleType` -- the engagement schedule type (e.g., `ad-hoc` or `standard`)
- `:contractorType` -- the contractor type (`individual` or `company`)
- `:version` -- the agreement version identifier (used as the filename)

## Roles

Authenticated users only (Candidate, Company Owner, Company Admin, Team Admin, Tenant Admin).

## Features

- Fetches the services agreement PDF from the API using the route parameters (`version`, `contractorType`, `scheduleType`)
- Displays the PDF in an embedded viewer using the `PdfViewer` component
- Provides a **Download** button to save the agreement as a PDF file
- Shows a loading spinner while the document is being fetched
- Displays a "document not found" message with the version, schedule type, and contractor type if the PDF cannot be loaded
- The downloaded file is named `<version>.pdf`

## Behavior notes

- The API returns the PDF as a Base64-encoded blob, which is converted to a `Blob` object and rendered via an object URL.
- The PDF viewer toolbar is hidden (`showToolbar={0}`).
- The version string has hyphens replaced with dots when displayed in the "not found" message.
