# Details Tab

Organisation and billing entity details view within Company Settings.

### Organisation Cards

- Displays the home organisation card and any additional organisations the user belongs to.
- Organisation cards show: name, country flag, worker count, candidate count.
- Clicking the home organisation navigates to the details expanded view.
- Clicking another organisation opens a switch-organisation confirmation modal.
- A link navigates to `/create-organisation?redirectUrl=...` for creating additional organisations.

### Billing Entity Cards

- Listed below the organisation cards in a horizontal carousel.
- Each card shows: name, country flag, worker count, candidate count.
- Cards are filtered to only show entities associated with the current user.
- Clicking a billing entity navigates to its detail view.
- Billing entities with no workers, candidates, or EOR instances can be deleted (with confirmation modal). Entities with associations show a popover explaining they cannot be deleted.
- TeamAdmin users cannot create or delete billing entities.

### Payment Banner

- Conditionally displayed (feature flag: `showPaymentDetailBanner`).
- Shows either "Bank Transfer" or "Payment Card" indicators.

## Details Expanded View

When a specific organisation or billing entity is selected, shows a detailed editable form.

### Organisation/Entity Card

- Displays name, country flag, worker count, candidate count.
- Home organisations show a house icon with initial letter; billing entities show a profile picture.

### Organisation Details Form

Fields (all read-only by default; toggle to edit mode via pencil icon):

- Organization Name (required; cannot be empty)
- Country (combobox; changing resets address fields)
- Registration Number (optional; with tooltip)
- Tax ID (optional; with tooltip)
- Dun & Bradstreet Number (optional; max 9 characters; DUNS validation)
- Default Invoicing Currency (dropdown)
- Address Search (Google Places; shown only in edit mode)
- Address Line (required)
- City / Region (required)
- Postal Code (required)
- Area Code + Phone Number (required; validated for region)

Save is disabled until changes differ from stored values and all validations pass. Cancel reverts to original values. TeamAdmin users cannot edit.

### Point of Contact Section

- "Add Contact" button (disabled for TeamAdmin and when form is already open).
- Client contact details (the organisation creator) are displayed as a read-only card.
- Additional contacts listed as active (with account) or inactive (without account).
- Each contact card shows: name, contact type, job title, email, phone number with flag.
- Contacts without a user account show an "Invite" link or "Sent" status if invitation already sent.
- Contacts can be edited or deleted. Delete requires confirmation modal.

#### Contact Form Fields

- Contact Type (required; dropdown; "Organization Contact")
- Full Name (required; 3-50 characters; name validation)
- Job Title (required; max 255 characters)
- Email (required; valid email format; read-only if contact has an associated invitation)
- Phone (optional; dial code + number)

### Behavior notes

- The "Add Payment Method" button is conditionally shown (feature flag: `showAddPaymentButton`) but is not yet functional.
- When the `InvoicingCurrency` query parameter is present, the invoicing currency dropdown opens automatically.
- TeamAdmin users see organisation/billing entity descriptions in secondary (greyed-out) text.
- Closing the expanded view (X button) is only shown when multiple billing entities exist.
