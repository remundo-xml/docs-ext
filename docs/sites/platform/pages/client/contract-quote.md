# Contract Quote

View and manage contract pricing details.

## Routes

- `/organisations/:organisationId/contract-quote/:id` -- Employee contract quote
- `/organisations/:organisationId/contractor-quote/:id` -- Contractor quote

## Features

- Detailed cost breakdown
- Employer cost calculations
- Fee summary
- Edit and resubmit capabilities
- Share with candidate

## Status-driven page selection

Both the employee and contractor quote pages dynamically render a different sub-page based on the current status of the EOR instance:

| EOR Status | Page shown |
|---|---|
| `Draft`, `Expired`, `Archived` (and `Pending` with default work order for employees) | **Main Terms** -- the editable contract form |
| `Pending`, `Required` | **Terms Validation** -- read-only review with additional comments |
| `Accepted` | **Work Order** -- the work order agreement for signing |
| `EorcSigned` and above | **Work Order Deposit** -- deposit payment and post-signing actions |

## Employee contract quote

### Engagement details section

The employee main terms form includes the following editable fields (disabled when the contract is not in an editable status):

- **Job location** -- read-only display of country and city.
- **Start date** -- date picker with a minimum date calculated from the estimated prep time in business days, adjusted for bank holidays.
- **Agreement period** -- choose between open-ended or a fixed end date. The end date must be at least 3 months after the start date and within the maximum allowed fixed period.
- **Annual gross salary** -- amount and currency selector. Only shown when pricing is enabled.
- **Job description** -- combo box for selecting/entering a job title, plus a rich-text job description editor.
- **Home office** -- yes/no radio toggle.
- **Work schedule** -- schedule type and weekly hour breakdown.
- **Holidays** -- minimum enforced by regional legal requirements.
- **Probation period** -- bounded by regional minimum and maximum.
- **Notice periods** -- separate fields for organisation, employee, and during-probation, each with regional minimums and maximums. Changes are submitted immediately via the `SubmitNoticePeriod` command.

### Amendment section

When the contract has amendments (e.g. changes to start date, end date, holidays, or right-to-work status), an **amendment summary** banner is displayed in red. Each amendment lists the old and new values. Amendments with navigation targets (such as right-to-work) include clickable links that scroll to the relevant section.

### General monthly payments

Displays the cost breakdown with line items for the salary, allowances, and insurance costs. Each line shows the label, amount, and currency. Deletable items dispatch events to remove allowances or toggle insurance options.

### Additional sections

- **Benefits / Allowances** -- configurable allowance lines.
- **Insurance & Health Benefits** -- checkbox-based insurance options with cost display.
- **Protection Clauses** -- editable clauses (e.g. non-compete, non-solicitation).
- **Deposit** -- deposit amount display when applicable.
- **Additional Payments** -- medical insurance and work permit cost sections.

### Offer actions (employee)

The main terms page provides the following buttons:

- **Save and Close** -- navigates back to the manage offers page without sending.
- **Share with Candidate** / **Submit** / **Share with Worker** -- sends the offer to the candidate. The label varies:
  - "Share with Worker" when pricing is not enabled (invite-only flow).
  - "Submit" for default (country-standard) main terms.
  - "Share with Candidate" for custom main terms.
  - Disabled when the contract is not shareable, when pricing currency is missing, or when the default work order has already been sent.
- **Revert to Draft** -- shown only when the status is `Expired`; allows re-editing an expired offer.

Before sharing, if the organisation is missing registration details (registration number, tax ID, or D&B number), a modal prompts the user to provide them or choose to **Provide Later**.

Additional actions available from the parent page:

- **Revoke and Amend** -- revokes the current offer and returns it to draft for editing.
- **Revoke and Delete** -- revokes and permanently removes the offer, navigating back to manage offers.
- **Archive** -- archives the EOR instance.

## Contractor quote

The contractor flow mirrors the employee flow with the following differences:

### Role details section (replaces Engagement Details)

- **Role location** -- read-only country and city.
- **Start date** -- same behaviour as employee.
- **Agreement period** -- supports both a month-based duration and a fixed end date. Minimum/maximum months are governed by `minimumContractorAgreementPeriod` and `maximumContractorAgreementPeriod`.
- **Pay rate** -- amount, currency, and time unit (e.g. Hourly, Daily, Monthly). Only shown when pricing is enabled. The summary displays the rate with the selected time unit.
- **Service description** -- role title combo box and description editor.
- **Home office** -- yes/no toggle.
- **Role schedule** -- work schedule with time-unit awareness.
- **Paid absences** -- shown only when the time unit is Monthly.
- **Initial period and notice** -- replaces the employee probation period; configurable initial period in days with separate min/max bounds, plus a notice period during the initial period.
- **Notice periods** -- for organisation and for contractor, with regional bounds.

### Contractor-specific sections

- **Contractor Incentives** -- one-off bonus, variable compensation, and vesting bonus with summary displays.
- **Allowances** -- configurable allowance lines.
- **Insurance & Health Benefits** -- contractor-specific insurance checkboxes.
- **General Monthly Payments** -- includes tenant costs and additional payments alongside cost lines.

### Offer actions (contractor)

- **Share with Contractor** -- sends the offer to the contractor.
- **Reshare** -- resends an already-shared offer.
- **Return to Contractor** -- returns the offer for the contractor to review, removing any system comments.
- **Invite Worker** -- sends a worker invitation.

## Real-time updates

Both pages establish a WebSocket connection (`MainTermsToken`) scoped to the EOR instance ID. Two events are handled:

- `end-client-updated` -- updates the end client name on the contract in real time.
- `work-order-signed` -- when using Docuseal, polls until the status reaches `EorcSigned`, refreshes the work order document, and reloads the page.

## Behavior notes

- On load, the employee page fetches the main terms DTO. If the instance has `validationPending` set and is in `Draft`, `Required`, or `Expired` status, a `ValidateEorInstance` command is sent and the page polls until validation completes, showing a spinner with explanatory text.
- Changes to the contract (updates, shares, comments) trigger an optimistic update flow: the `latestAppliesStore` is set, a polling loop confirms the backend has processed the change, and a success/error notification is shown.
- The `isContractShareable` store controls whether the share button is enabled. It is set to false while updates are in progress and re-enabled on completion.
- If the page fails to load the EOR instance (e.g. invalid ID), the user is redirected to the 404 page.
- Component cleanup on destroy resets all contract-related stores (`latestAppliesStore`, `contractCreatorStore`, `candidateNameOnContractStore`, `commentStore`, `isContractShareable`) and disposes the WebSocket connection.
