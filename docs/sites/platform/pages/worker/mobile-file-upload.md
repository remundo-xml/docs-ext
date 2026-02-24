# Mobile File Upload

Upload files from a mobile device for expense or absence approvals.

## Route

`/mobile-upload/:eorId/:approvalType`

## Overview

This page is designed for mobile use and allows workers to upload supporting files (photos or PDFs) for expense or absence approval workflows. The page is accessed after scanning a QR code from the desktop application.

## Parameters

- `:eorId` -- the engagement ID the upload is associated with
- `:approvalType` -- either `expenses` or `absences`

## Display

The page has a gradient background (white to light orange) and fills the viewport height. It shows:
- An information message explaining the upload context, interpolated with the approval type ("expense" or "absence") and the maximum number of files (4 for expenses, 1 for absences)
- A centered **Upload File** button (large size)
- A status area below the button showing upload progress or results

## Initialization

On mount, the component:
1. Retrieves the user ID from the `remundoIdentity` store
2. Sends a `NotifyUserLoginAfterQRScan` command via `notifyMobileLoginAfterQRScan` to inform the desktop session that the mobile user has logged in

If the user ID cannot be found, an error notification is shown.

## Upload flow

1. User clicks the **Upload File** button, which opens a `DropZone` modal
2. Accepted file types: images (`image/*`) and PDF (`.pdf`)
3. The `keepOriginalFileName` flag preserves the original file name from the device
4. On file selection:
   - The file blob is converted to base64 via `blobToBase64`
   - HEIC files are automatically converted via `convertBase64IfHeicType`
   - The file extension is updated to match the actual content type
5. An `UpLoadMobilePhoneFileToBlob` command is sent via `uploadFileToBlobStorage` with:
   - File path: `{tenantId}/{userId}/{eorId}/{fileName}`
   - Container: `mobile-phone-uploads`
   - The engagement ID and approval type from the route parameters
6. During upload, a spinner with "uploading" text is shown
7. On success, a success message is displayed with the file name
8. On failure, an error message is displayed with the file name and the `fileUploadFailed` flag is set (displayed in red via the `error` class)

## Behavior notes

- The approval type is formatted for display: "expenses" becomes "expense", other values become "absence"
- Multiple uploads are supported -- the user can click the upload button again after each upload completes
- Each upload is independent; there is no batch upload mechanism
