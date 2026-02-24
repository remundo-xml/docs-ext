# Engagements

Timeline view of a worker's engagement history, showing contract status, signed documents, and links to the work order and main terms.

## Route

`/organisations/:orgId/workers/:id/engagements`

## Layout

### Worker Profile Card

Displays the worker's profile: name, country, contract type, job title, team name, manager names, HR-only status. Greyed out when the contract has ended.

### Search Bar

A search input for filtering engagement entries (not yet fully functional).

### Engagement Timeline

Rendered via the `Timeline` component. Each timeline item shows:

- **Timestamp** -- derived from the work order's `applies` date
- **Status** -- translated from the EOR status (e.g. "Employee Agreement Signed", "Contractor Agreement Signed")
- **Status colour** -- mapped from the EOR status via `getStatusCornerCandidate`
- **Signed by** -- signer name and role (when a signer is recorded)
- **Hyperlinks** (hidden for HR-only workers):
  - Work Order -- links to `/organisations/:orgId/workers/:id/employee-work-offer`
  - Main Terms -- links to `/organisations/:orgId/contract-quote/:id` (or `/contractor-quote/:id` for contractors)

## Data Loading

On initialisation:
1. Fetches the EOR instance via `getEorInstance`.
2. Fetches worker details via `getWorkerDetails`.
3. Fetches the work order via `getWorkOrderByEorInstanceId`.
4. Maps the work order to a timeline item.

## Behavior notes

- The worker type (Employee vs Contractor) determines the agreement type label and the main terms link path (`/contract-quote/:id` for employees, `/contractor-quote/:id` for contractors).
- When the contract has ended, the profile card is greyed out and the timeline is rendered with `isContractEnded` set, which displays it with reduced opacity.
- The work order timestamp comes from the `applies` date, and the status label is translated using the `candidateEor.widget.status.{EorStatus}` key with the agreement type inserted.
- On error, a red error message is displayed inline (e.g. "Error loading EOR details: {message}").
