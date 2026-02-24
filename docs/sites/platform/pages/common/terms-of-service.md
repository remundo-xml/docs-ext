# Terms of Service

Display the Remundo Standard Terms of Service as an embedded PDF document.

## Route

`/std-terms-of-service`

## Features

- Displays the current version of the terms of service PDF (currently `v1.02`)
- Renders the PDF using an `<object>` embed with a fallback `<embed>` element
- Shows a page heading: "STANDARD TERMS OF SERVICE v1.02"
- PDF is loaded from a static path: `/documents/Remundo.Standard.Terms.of.Service.v1.02.pdf`
- PDF toolbar and zoom controls are hidden (`toolbar=0`, `zoom=100`)
- Displays a styled error message if the PDF fails to load: "Failed to load Remundo Standard Terms of Service v1.02 PDF document."
- Fallback text "Your browser does not support PDF viewing." is shown if neither `<object>` nor `<embed>` is supported

## Behavior notes

- The version number is defined as a constant in the component. Updating the version requires a code change.
- The PDF container takes up 85% of the viewport height for a full-page reading experience.
- The heading is hidden when an error occurs, so only the error message is displayed.
