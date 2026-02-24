# Service Company Wizard

Register a service company for contractor engagements.

## Routes

- `/create-service-company-wizard`
- `/create-service-company-wizard?redirectUrl=:path`
- `/email/:candidateEmail/:id/create-service-company-wizard`

## Overview

A two-step wizard for creating a new contractor service company. The wizard uses Svelte context to share state between steps. On completion, the company is registered and optionally selected for the engagement.

## Wizard steps

### Step 1: Company

The company step collects:

- **Company name** (required; min `ServiceCompany.MIN_NAME_LENGTH`, max `ServiceCompany.MAX_NAME_LENGTH`; auto-focused on mount; has tooltip)
- **Country of registration** (required; country dropdown via `ComboboxCountries`)
- **Registration number** (required; min `ServiceCompany.MIN_REG_NUMBER_LENGTH`, max `ServiceCompany.MAX_REG_NUMBER_LENGTH`; has tooltip)
- **Tax ID** (optional; min `ServiceCompany.MIN_TAX_ID_LENGTH`, max `ServiceCompany.MAX_TAX_ID_LENGTH`; has tooltip)
- **Under ownership** checkbox (default: checked)

Validation runs reactively: the "Next" button is enabled only when name, country, and registration number pass validation and the tax ID (if provided) is within length bounds. Inline errors are shown on field blur via `validateField`.

### Step 2: Address

The address step collects (via the shared `Address` wizard stage component):

- **Address line** (required)
- **City** (required)
- **Postal code** (required)
- **Dial code** (country code selector)
- **Phone number**

The country from Step 1 is passed as a dependency to the address stage.

## Signatory auto-population

The signatory is not a visible wizard step but is auto-populated on completion:

- If the wizard was accessed via `/email/:candidateEmail/:id/create-service-company-wizard`, the signatory is populated from the EOR instance (first name, last name, email, phone)
- Otherwise, the signatory is populated from the candidate's profile
- Role defaults to "Director"

## Completion flow

1. A loading spinner is shown with a "creating" message
2. A UUID is generated for the new company
3. A `RegisterServiceCompanyCommand` is built from the company, address, and signatory data and sent via `ServiceCompany.register`
4. Polling confirms the company was created via `ServiceCompany.poll`
5. If the wizard was accessed with an engagement ID (`:id` parameter):
   - A `SubmitServiceCompanyCommand` is sent via `ServiceCompany.selectForEor` to link the company to the engagement
   - Polling confirms the selection via `ServiceCompany.pollSelectionForEor`
   - The contractor type is updated via `changeContractorType` based on the ownership flag
6. Navigation redirects to the URL specified in the `redirectUrl` query parameter

## Wizard title

- On Step 1 or when no company name is set: displays the generic wizard title
- After Step 1 with a company name: displays a title interpolated with the company name

## Close behavior

Clicking the close button navigates to the `redirectUrl` query parameter value.
