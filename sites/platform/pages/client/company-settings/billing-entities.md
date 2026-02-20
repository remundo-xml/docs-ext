# Billing Entities

Billing entities are sub-divisions of an organisation used for invoicing and worker assignment. They can be created via a wizard and viewed/edited through the company settings detail view.

## Routes

- `/organisations/:organisationId/company-settings/billing-entities/:billingEntityId` -- View/edit a specific billing entity
- `/organisations/:organisationId/create-billing-entity-wizard` -- Create a new billing entity

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

TeamAdmin users cannot create billing entities.

## View/Edit Billing Entity

Uses the same expanded detail component as the organisation details view. See company-settings.md for full field documentation.

Key differences from the home organisation view:

- Shows a profile picture avatar instead of a house icon.
- An "Add New Billing Entity" button is shown.
- Edits issue an EditBillingEntity command rather than EditOrganisation.
- A close button navigates back to `/organisations/:organisationId/company-settings`.

## Create Billing Entity Wizard

Three-step wizard for creating a new billing entity, structurally identical to the Create Organisation wizard.

### Step 1: Billing Entity Details

- Entity Name (required; max 50 characters)
- Country (required; country combobox)
- Registration Number (optional; max 20 characters)
- Tax ID / VAT (optional; max 20 characters)
- Dun & Bradstreet Number (optional; max 9 characters; DUNS validation)

### Step 2: Address

Same address form as organisation creation (address search, address line, city, postal code, phone with dial code).

### Step 3: Contact Details

Same contact form as organisation creation (full name read-only, email read-only, job title required, phone optional).

### Submission Process

On completion:

1. CreateBillingEntity command is sent with a pre-generated UUID.
2. Polls getBillingEntityById until the entity appears.
3. AddBillingEntityClientContactDetails command is sent.
4. Polls until client details are present on the entity.
5. If an `eorInstanceId` query parameter is present (creating from main terms), a SubmitBillingEntity or SubmitBillingEntityContractor command is also sent.
6. Redirects to the `redirectUrl` query parameter or `/`.

### Behavior notes

- The wizard state is persisted in local storage.
- On error, a notification is shown and the user is redirected to `/`.
- The wizard cannot be closed while submission is in progress.
