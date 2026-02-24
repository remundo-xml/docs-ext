# Bank Details

Submit and manage payment account information with country-specific field requirements.

## Route

`/candidate-details/bank-details`

## Availability

This tab is only enabled when the `useBankDetails` tenant setting is active and the worker has at least one signed engagement. The tab renders at `activeTab={2}` within `CandidateDetailsTabs`.

## Blueprint selection

The form fields shown depend on the worker's contract type and country:

- Contractors use a universal bank template (`contractors-bank`) where all country-specific fields are optional
- Employees use a country-specific bank blueprint fetched by the bank country (defaulting to the existing bank details country or the candidate's country of residence)
- Changing the bank country reloads the blueprint and resets the form fields (except for contractors using the universal template)

The contract type is determined by fetching the last shared EOR instance for the user via `getLastSharedCandidateEorByUserId`.

## Form fields

### Always visible

- Account name (required; 1-256 chars; alphanumeric pattern `REGEX_ACCOUNT_NAME`)
- Bank country (required; country dropdown; 2-56 chars)
- Bank name (required; 1-256 chars)
- Bank branch address (optional; 1-256 chars)
- City/region (optional; 1-100 chars)
- Post/zip code (optional; 1-20 chars)
- Account number (required; 1-34 chars)
- Additional comments (optional; 1-1000 chars; textarea, max 1000 characters)
- File attachment (required; image or PDF upload via drop zone)

### Country-specific fields

These fields appear when the bank blueprint includes them or when the user already has a value stored. For employees they are mandatory when present; for contractors on the universal template they are always optional.

- SWIFT (8-11 chars; pattern `REGEX_SWIFT`)
- IBAN (1-34 chars; pattern `REGEX_IBAN`)
- Sort code (8 chars; pattern `REGEX_SORT_CODE`)
- BSB (7 chars; pattern `REGEX_BSB`)
- IFSC (11 chars; pattern `REGEX_IFSC`)
- Bank institution code (3 chars; pattern `REGEX_INSTITUTION_CODE`)
- Transit number (5 chars; pattern `REGEX_TRANSIT_NUMBER`)
- Branch code (3-5 chars; pattern `REGEX_BRANCH_CODE`)
- CLABE code (18 chars; pattern `REGEX_CLABE`)
- Routing number ABA (9 chars; pattern `REGEX_ROUTING_NUMBER_ABA`)
- Intermediary bank (1-256 chars)

## File attachment

- A supporting document (bank statement, void cheque, etc.) is required for submission
- Accepted file types: images (`image/*`) and PDF (`.pdf`)
- HEIC files are converted to JPEG automatically
- Uploading a new file generates a UUID-based file ID (`.jpeg` or `.pdf` extension based on content type)
- Existing attachments can be previewed (opens `FilePreviewPopUp`) or deleted in edit mode
- If any bank details field changes during editing, a new file must be attached

## Submission flow

1. User clicks the edit (pencil) icon to enter edit mode
2. Form fields become editable; validation errors display inline
3. The save button is disabled until all mandatory fields are valid and a file is attached
4. On save, the file is uploaded (if changed) via `uploadDocument`, then `submitUserBankDetails` sends the command
5. Polling via `pollingGetCondition` waits until the `submittedAt` timestamp updates to confirm backend processing
6. A spinner is shown during the polling phase
7. On success the form reloads with the updated bank details; on failure an error notification is shown

## Edit and cancel

- Cancel reverts the form to the last saved state by re-fetching all data from the API (profile, bank details, and blueprint)
- The edit icon is disabled while already in edit mode
- The form content area is scrollable (60vh height) for long country-specific field lists

## Validation behavior

For contractors using the universal template, any field with a validation error blocks submission. For employees, only mandatory fields (those present in the blueprint or with existing values) block submission. Validation errors are shown inline only while in edit mode.

## Status states

Bank details carry a status: `Submitted`, approved (has `approvedAt`), or rejected (has `rejectedAt`). The status affects display but does not prevent re-submission.
