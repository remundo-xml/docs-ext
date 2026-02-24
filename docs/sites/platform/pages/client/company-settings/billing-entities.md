# Billing Entities

Billing entities are sub-divisions of an organisation used for invoicing and worker assignment. They can be created via a wizard and viewed/edited through the company settings detail view.

## Routes

- `/organisations/:organisationId/company-settings/billing-entities/:billingEntityId` -- View/edit a specific billing entity
- `/organisations/:organisationId/create-billing-entity-wizard` -- Create a new billing entity

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

TeamAdmin users cannot create billing entities.

## View/Edit Billing Entity

Uses the same `CompanyDetailsExpanded` component as the organisation details view. See [details.md](details.md) for full field documentation.

Key differences from the home organisation view:

- Shows a `ProfilePicture` avatar instead of a house icon.
- An **Add New Billing Entity** button navigates to `/organisations/:organisationId/create-billing-entity-wizard`. Disabled for TeamAdmin.
- Edits issue an `EditBillingEntityCommand` (with `CorrelationId` set to the organisation ID and `BillingEntityId` set to the entity ID) rather than `EditOrganisationCommand`.
- Polls via `pollingGetCondition` on `getBillingEntityById` until the `applies` timestamp is newer.
- A close button navigates back to `/organisations/:organisationId/company-settings`. Only shown when multiple billing entities exist.

## Create Billing Entity Wizard

Three-step wizard (`BillingEntity/Create/Index.svelte`) for creating a new billing entity. Uses a `ProgressLine` stepper component with clickable steps. The wizard is rendered inside a centred `Tile` component with a closable overlay (close is disabled during submission).

### Step 1: Billing Entity Details

Rendered by `BillingEntityDetails/BillingEntity.svelte` and `BillingEntityForm.svelte`.

- **Entity Name** (required; max 50 characters)
- **Country** (required; country combobox)
- **Registration Number** (optional; max 20 characters)
- **Tax ID / VAT** (optional; max 20 characters)
- **Dun & Bradstreet Number** (optional; max 9 characters; DUNS validation)

Dispatches `detailsDone` on completion to advance to Step 2.

### Step 2: Address

Same address form as organisation creation (`AddressDetails` component): address search, address line, city, postal code, phone with dial code.

Dispatches `addressDone` on completion to advance to Step 3.

### Step 3: Contact Details

Same contact form as organisation creation (`ContactDetails` component):

- **Full Name** (read-only, from authenticated user's `displayName`)
- **Email** (read-only, from authenticated user's `email`)
- **Job Title** (required)
- **Phone** (optional; dial code, number, and country)

Dispatches `contactDone` on completion, which triggers the submission process.

### Submission Process

On completion (`onCompleteStarted`):

1. A UUID is pre-generated for the billing entity ID via `uuidv4()`.
2. The stepper and close button are disabled (`disabledStepper = true`, `disableClose = true`).
3. A spinner is shown with localised text.
4. `CreateBillingEntity` command is sent with the pre-generated UUID, entity details, address fields, creator ID, and DUNS number.
5. Polls via `pollingGet` on `getBillingEntityById` until the entity appears. Adds to `billingEntityStore`.
6. `AddBillingEntityClientContactDetails` command is sent with contact type "Organization Contact", user details, job title, phone, and the billing entity ID.
7. Polls via `pollingGetCondition` on `getBillingEntityById` until `creatorId` matches and `clientDetails.userId` matches the current user.
8. If an `eorInstanceId` query parameter is present (creating from main terms), a `SubmitBillingEntity` or `SubmitBillingEntityContractor` command is sent depending on the worker contract type (Employee vs Contractor). Updates `contractChangeMadeStore` and `latestAppliesStore`.
9. If no `eorInstanceId`, redirects to the `redirectUrl` query parameter (defaults to `/`).

### Wizard State

- The wizard state is persisted in local storage via `Local.Keys.WizardState` and restored on mount.
- The state object (`OrganisationWizardState`) contains `Details`, `Address`, and `Contact` sections.
- Navigation between steps is handled by `continueStep` (forward) and `goBack` (backward). A `WizardNavigationButton` with "Back" label is shown on steps after the first.
- Steps can also be navigated by clicking on the `ProgressLine` step indicators (unless stepper is disabled).

### Behavior notes

- On any error during submission, a notification is shown ("There is a problem with our services.") and the user is redirected to `/`.
- The wizard cannot be closed while submission is in progress (`disableClose = true`).
- The `disabledStepper` flag prevents step navigation during submission.
