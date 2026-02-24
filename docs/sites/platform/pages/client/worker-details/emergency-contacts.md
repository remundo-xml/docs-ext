# Emergency Contacts

Read-only view of a worker's emergency contacts, sorted with the primary contact first.

## Route

`/organisations/:orgId/workers/:id/emergency-contacts`

## Layout

### Worker Profile Card

Displays the worker's profile at the top: name, country, contract type, job title, team name, and manager names.

### Contact Cards

Each emergency contact is displayed as a card with a header and body section.

#### Card Header

- Title: "Primary Emergency Contact" (with a star icon) or "Emergency Contact"

#### Card Body Fields

- Full Name (`contactFullName`)
- Relationship to Contact (`relationshipToContact`)
- Mobile Phone (dial code + number; may be empty)
- Work Phone (dial code + number; may be empty)
- Home Phone (dial code + number; may be empty)
- Email
- Address Details (address, city, post code concatenated)

### Empty State

When no emergency contacts exist, a message is shown: "No emergency contact has been added", followed by a description explaining that the worker has been prompted to complete the emergency contact form.

## Data Loading

On initialisation:
1. Fetches the EOR instance via `getEorInstance`.
2. Fetches worker details via `getWorkerDetails`.
3. Fetches emergency contacts via `GetEmergencyContacts` using the `candidateId`.
4. Contacts are sorted so the primary contact (`isPrimaryEmergencyContact`) appears first.

## Behavior notes

- The outer container has a height of 90vh and enables horizontal scrolling. The contacts list within it is vertically scrollable.
- Contact cards have a fixed width of 30rem.
- The card header has a light blue-grey background with rounded top corners; the body has a matching border with rounded bottom corners.
- The profile card on this tab does not display the HR-only badge (unlike other tabs).
- On initialisation error, an error event is dispatched to the parent tab container.
