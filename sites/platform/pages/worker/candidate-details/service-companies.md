# Service Companies

Manage contractor service companies and their signatories.

## Route

`/candidate-details/service-companies`

## Sub-routes

- `/candidate-details/service-companies/:id/details` - Company detail and edit view

## Company list

The list page displays all service companies for the current candidate as a grid of cards (3 per row). If the candidate has exactly one company, the page automatically redirects to that company's detail view.

An "Add" button navigates to `/create-service-company-wizard?redirectUrl=/candidate-details/service-companies` to create a new company.

When no companies exist, a "no companies" message is displayed.

### Company card

Each card shows:

- Profile picture (single initial derived from company name)
- Company name
- Country flag (lowercase ISO code)
- Expand button to navigate to the detail view
- Delete button (trash icon)

### Delete from list

- The delete button is disabled when the company has signed contracts (`signedContracts > 0`); a tooltip explains the restriction
- When enabled, clicking the trash icon opens a confirmation modal ("Are you sure you wish to delete {name}?")
- On confirmation, a `RemoveServiceCompanyCommand` is sent and removal is confirmed via polling (`ServiceCompany.confirmRemoval`)
- After confirmed deletion the company is removed from the list
- Error notifications are shown if the command or confirmation fails

## Company details

At `/candidate-details/service-companies/:id/details`, the detail view shows a summary card and an editable form.

### Summary card

Displays the company profile picture, name, and country flag. A close button (X) returns to the list. The "Add" button is also available from this view.

### Company form fields

- Company name (required; min/max from `ServiceCompany.MIN_NAME_LENGTH` / `MAX_NAME_LENGTH`; disabled when company has signed contracts)
- Country (required; country dropdown; disabled when company has signed contracts)
- Registration number (required; min/max from `ServiceCompany.MIN_REG_NUMBER_LENGTH` / `MAX_REG_NUMBER_LENGTH`; has tooltip; disabled when company has signed contracts)
- Under ownership checkbox (toggles signatory editing when changed)
- Tax ID (optional; min/max from `ServiceCompany.MIN_TAX_ID_LENGTH` / `MAX_TAX_ID_LENGTH`; has tooltip)
- Address search (Google Places autocomplete; visible in edit mode only; populates address, city, and postal code)
- Address line (required; 3-100 chars)
- City (required; 3-50 chars)
- Postal code (required; 3-15 chars)
- Dial code (country code selector, defaults to company country)
- Phone number (validated with `PhoneNumber` component)

### Edit flow

1. Click the pencil icon to enter edit mode (icon hidden while submitting or deleting)
2. The save button is enabled only when fields have changed and all validations pass
3. On save, a `ModifyServiceCompanyCommand` is sent, then confirmed via polling (`ServiceCompany.confirmModification`)
4. Cancel reverts to the last saved state

### Delete from details

Same behavior as list delete: disabled when signed contracts exist, confirmation modal, command + polling confirmation, then redirect to the list view.

## Signatory management

The signatory section appears below the company form on the detail view.

### Signatory card (read-only)

Displays:
- Profile picture (initial from signatory name)
- Full name
- Email
- Role
- Phone number with country flag and dial code (shown only when phone data exists)
- Edit (pencil) button to switch to edit mode

### Signatory form fields

- Full name (required; 3-20 chars)
- Role (required; 3-20 chars)
- Email (required; 3-256 chars)
- Country code (dial code selector)
- Phone number (optional)

### Signatory edit flow

1. Click the pencil icon on the signatory card to enter edit mode
2. Save is enabled when fields differ from saved values and validation passes
3. On save, an `EditSignatoryCommand` is sent and confirmed via polling (`ServiceCompany.confirmSignatoryModification`)
4. Changing the "under ownership" checkbox on the company form also triggers signatory editing mode

### Ownership interaction

Toggling the "under ownership" checkbox on the company form opens the signatory editing section. Cancelling the signatory edit reverts the checkbox. Saving the signatory also saves the company form if the ownership value changed.
