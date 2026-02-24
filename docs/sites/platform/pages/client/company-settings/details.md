# Details Tab

Organisation and billing entity details view within Company Settings. The default landing page (tab index 1) when navigating to Company Settings.

## Route

`/organisations/:organisationId/company-settings`

When only one billing entity exists and no other organisations are present, automatically redirects to the expanded view at `/organisations/:organisationId/company-settings/details/`.

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Layout

The Details tab is managed by `CompanyDetailsController`. It has two views:

1. **Card View** -- Shows organisation cards and billing entity cards in a carousel layout. This is the default when multiple entities exist.
2. **Expanded View** -- Shows a detailed editable form for a selected organisation or billing entity. Rendered by `CompanyDetailsExpanded`.

### Organisation Cards

- Fetches all organisations the user belongs to via `getIdentityBaseOrganisations`.
- Organisations are sorted with the home organisation first.
- Each card (`OrgCard`) shows: name, country flag, worker count, candidate count.
- Home organisation cards display a house icon with the first letter of the name; non-home organisations display a profile picture.
- Clicking the home organisation navigates to the expanded view at `/organisations/:organisationId/company-settings/details/`.
- Clicking another organisation opens a `SwitchOrganisationModal` confirmation dialog.
- A "click here" link navigates to `/create-organisation?redirectUrl=/organisations/:organisationId/company-settings` for creating additional organisations.
- Description and label text is shown in secondary (greyed-out) style for TeamAdmin users.

### Billing Entity Cards

- Listed below the organisation cards in a horizontal `Carousel` component.
- Each card shows: name, country flag, worker count, candidate count.
- Cards are filtered to only show entities associated with the current user (via `associatedEntities` on the user identity).
- Clicking a billing entity navigates to `/organisations/:organisationId/company-settings/billing-entities/:billingEntityId`.
- Billing entities with no workers, candidates, or EOR instances can be deleted (with a confirmation modal). Entities with associations show a `Popover` explaining they cannot be deleted.
- TeamAdmin users cannot delete billing entities (delete button is disabled).
- A "click here" link navigates to the create billing entity wizard. This link is disabled for TeamAdmin users.

### Payment Banner

- Conditionally displayed (feature flag: `showPaymentDetailBanner`).
- Shows either "Bank Transfer" or "Payment Card" indicators, alternating based on the card's ordinal index.

## Details Expanded View

Rendered by `CompanyDetailsExpanded` when a specific organisation or billing entity is selected.

### Organisation/Entity Card

- Displays name, country flag, worker count, candidate count.
- Home organisations show a house icon with the first letter; billing entities show a `ProfilePicture` component.
- An **Add New Billing Entity** button navigates to `/organisations/:organisationId/create-billing-entity-wizard`. Disabled for TeamAdmin users.
- A close button (X) navigates back to `/organisations/:organisationId/company-settings`. Only shown when multiple billing entities exist (via `closable` prop).
- A guidance text paragraph with an inline "here" link that scrolls to and clicks the "Add Contact" button.

### Organisation Details Form

Rendered by the `Details` component inside a `SmallCard`. Fields are read-only by default; toggled to edit mode via a pencil icon button. The pencil button is disabled for TeamAdmin users.

Fields:

- **Organization Name** (required; empty validation; `Input` component)
- **Country** (`ComboboxCountries`; changing country resets address fields -- Line, City, PostalCode)
- **Registration Number** (optional; with tooltip triggered on click)
- **Tax ID** (optional; with tooltip triggered on click)
- **Dun & Bradstreet Number** (optional; max 9 characters; DUNS validation via `validDuns`; error message shown when invalid)
- **Default Invoicing Currency** (`InvoicingCurrencyDropdown`; defaults to `USD` when not set)
- **Address Search** (Google Places autocomplete via `AddressDetailsForm`; shown only in edit mode)
- **Address Line** (required; validated with regex `[A-Za-z0-9\-\_]+`)
- **City / Region** (required; same regex validation)
- **Postal Code** (required; same regex validation)
- **Area Code + Phone Number** (required; validated for region; dial code derived from country)

When the `InvoicingCurrency` query parameter is present and set to `true`, the invoicing currency dropdown opens automatically on page load.

**Save** button is enabled only when:
- All fields differ from stored values (checked via `detailsMatchAndValid`)
- All validations pass (company name not empty, valid address, valid DUNS if provided)
- The form issues an `EditOrganisationCommand` for home organisations or an `EditBillingEntityCommand` for billing entities

**Cancel** reverts to original values and returns to read-only mode.

After saving, the page polls via `pollingGetCondition` until the `applies` timestamp is newer than the previous value, then updates the store and dispatches an `org-change` event.

### Point of Contact Section

Rendered by `PointOfContactSection`.

- **Add Contact** button (id: `add-contact-button`). Disabled for TeamAdmin users and when a contact form is already open.
- Client contact details (the organisation creator) are displayed as a read-only card via `ClientContactItem`.
- Additional contacts listed as active (with an associated user account) or inactive (without an account).
- Each contact card shows: name, contact type, job title, email, phone number with country flag.
- Contacts without a user account show an "Invite" link or "Sent" status if an invitation has already been sent.
- Clicking "Invite" opens an inline `InviteForm` within the expanded view (polls for the invitation, then associates the contact with the invitation).
- Contacts can be edited or deleted. Delete requires a confirmation modal.

#### Contact Form Fields

- **Contact Type** (required; dropdown; default: "Organization Contact")
- **Full Name** (required; 3-50 characters; name validation)
- **Job Title** (required; max 255 characters)
- **Email** (required; valid email format; read-only if the contact has an associated invitation)
- **Phone** (optional; dial code + number)

### Add Payment Method

- Conditionally shown (feature flag: `showAddPaymentButton`).
- Styled as a button but not yet functional (click handler is empty).
- Disabled for TeamAdmin users.

## Data Loading

- Home organisation data fetched via `getOrganisation(organisationId)`.
- Billing entity data fetched via `getBillingEntityById(billingEntityId)`.
- The `CompanyDetailsController` fetches details via `getDetailsPage(organisationId)` which returns billing entities, and organisation list via `getIdentityBaseOrganisations`.
- If the invitations or users stores are empty, `getManageUsersPage` is also called to populate them (needed for duplicate email checks in the contact section).
- On initialisation failure, the user is redirected to `/pages-404`.

## Behavior notes

- The `Details` component width is constrained to `45em` and becomes full-width below 1050px.
- The expanded view re-renders when the `organisation` object changes (via `{#key organisation}`).
- After an invitation is sent from the expanded view, the contact is updated with the invitation ID via `editContactAndAddToStore`.
