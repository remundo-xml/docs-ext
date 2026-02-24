# Create Organisation

Set up a new organisation on the platform.

## Route

`/create-organisation`

Accepts an optional `?redirectUrl=` query parameter. After successful creation, the user is redirected to this URL (with `:organisationId` replaced by the new ID). If the URL does not include `company-settings`, the user's identity is updated with the new organisation.

## Features

- Organisation name and details
- Primary contact information
- Industry selection
- Initial billing entity setup

## Wizard steps

The creation flow is a three-step wizard with a `ProgressLine` indicator at the top. Users can navigate forward, backward, or click directly on a completed step to return to it.

### Step 1: Organization (Company Details)

Collects the core company information. Fields:

| Field | Required | Validation | Max length |
|---|---|---|---|
| **Company Name** | Yes | Must not be empty | 50 |
| **Country** | Yes | Must select a country from the dropdown | -- |
| **Registration Number** | No | -- | 20 |
| **Tax ID** | No | -- | 20 |
| **D&B Number** (Dun & Bradstreet) | No | Must match DUNS regex (digits only) | 9 |

- Each field includes a tooltip with contextual help.
- The **Done** button is disabled until both **Company Name** and **Country** are provided.
- Selecting a country auto-populates the phone dial code on the Address step (if the phone number is still empty).
- Validation runs on all required fields when **Done** is clicked; the step only advances if validation passes.

### Step 2: Address

Uses the shared `AddressDetails` component to collect the organisation's physical address. Fields include:

- **Address Line**
- **City**
- **Postal Code**
- **Phone Number** (with dial code selector, pre-populated from the country selected in Step 1)

### Step 3: Contact

Collects the primary contact details for the organisation creator. Fields:

| Field | Required | Editable | Validation |
|---|---|---|---|
| **Full Name** | Yes | No (read-only, from user profile) | -- |
| **Email** | Yes | No (read-only, from user profile) | -- |
| **Job Title** | Yes | Yes | Letters, hyphens, apostrophes, spaces only; min 2, max 255 characters |
| **Phone Number** | No | Yes | If either dial code or number is provided, both must be present |

- The **Complete Setup** button is disabled until the job title meets the minimum length and phone fields are consistent.

## How to create an organisation

### Step 1: Fill in company details

Enter the company name, select the country of incorporation, and optionally provide a registration number, tax ID, and D&B number. Click **Done** to proceed.

### Step 2: Provide the address

Enter the company address and phone number. Click **Done** to proceed.

### Step 3: Confirm contact details

Verify the pre-filled name and email. Enter your job title and optionally a phone number. Click **Complete Setup** to begin creation.

## Behavior notes

- After clicking **Complete Setup**, a progress bar replaces the form showing four tracked tasks:
  1. **Organisation** -- polls `getOrganisationByCreatorId` until the organisation exists.
  2. **Role** -- polls `getIdentityWithOrganisation` until the `CompanyOwner` role is assigned.
  3. **Client Details** -- polls until `clientDetails` are populated on the organisation.
  4. **Job Title** -- calls `addJobTitle`, then polls until the identity reflects the new job title.
- Each task displays a checkmark as it completes.
- If an error occurs during creation, an error notification is shown and the user is returned to the last wizard step.
- Wizard state is persisted in local storage (`Local.Keys.WizardState`) so progress survives page refreshes.
- If the user presses **Complete Setup** a second time after an error, the `CreateOrganisation` command is not re-sent (the previously created ID is reused).
- On success, the user's identity, billing entity store, and local storage selections are updated before redirecting.
