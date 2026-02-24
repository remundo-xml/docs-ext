# Emergency Contact

Add, edit, and delete emergency contacts with primary contact designation.

## Route

`/candidate-details/emergency-contact`

## Availability

This tab is only enabled when the `useEmergencyContacts` tenant setting is active and the worker has at least one signed engagement. The tab renders at `activeTab={3}` within `CandidateDetailsTabs`.

## Contact list

Emergency contacts are displayed as a vertical list of form cards (max width 45rem), sorted so the primary contact appears first. If no contacts exist on load, the "add contact" form is shown automatically.

An **Add Contact** button at the top opens a new blank form at the bottom of the list. When the add form is visible, a close (X) button replaces the add button. Clicking add scrolls smoothly to the new form via `scrollIntoView`.

## Form fields

- Full name (required; 3-256 chars)
- Relationship to contact (required; 3-256 chars)
- Mobile phone (dial code + number; validated via `PhoneDetails` component)
- Work phone (dial code + number; optional)
- Home phone (dial code + number; optional)
- Email (required; validated against email regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- Address (required; 3-256 chars)
- City (required; 3-256 chars)
- Postal code (required; 3-256 chars)
- Primary emergency contact checkbox

At least one phone number (mobile, work, or home) must be provided. A phone-required validation error is shown if none are set. The submit button is disabled until all required fields are filled and at least one phone number exists.

The primary contact checkbox is disabled when editing the existing primary contact (cannot unset it directly), when not in edit mode, or when no other contacts exist (automatically checked for the first contact).

## Create flow

1. Click **Add Contact** to open the creation form
2. Fill in all required fields
3. On save, a `CreateEmergencyContactCommand` is sent with a new UUID as `ContactId`
4. If the new contact is marked as primary and a previous primary exists, the `PreviousPrimaryContactId` is included in the command to reassign
5. Polling via `pollingGetCondition` waits until the new contact appears in the list
6. A spinner is shown during polling
7. On success the contact list is refreshed; on failure an error notification is shown

## Edit flow

1. Click the pencil icon on an existing contact card to enter edit mode
2. Modify fields and save
3. An `EditEmergencyContactCommand` is sent
4. Polling waits until all submitted field values match the API response (checked via `fieldsMatch`)
5. Cancel reverts the form to its previous state by re-rendering via `reloadComponent`

## Delete flow

1. Click the trash icon on a non-primary contact
2. A confirmation modal appears (via `TemplateModal`)
3. On confirmation, a `DeleteEmergencyContactCommand` is sent
4. Polling waits until the contact no longer appears in the list
5. The contact is removed from the display

The trash icon for the primary contact is disabled with a tooltip explaining that the primary contact cannot be deleted.

## Behavior notes

- Validation errors only display after the first form submission attempt (`formSubmitted` flag)
- Each contact form is independently editable with its own edit/read-only state
- The contact list re-renders via a `reloadComponent` key after every create, edit, or delete operation
- Each existing contact card displays a title of "Primary Emergency Contact" or "Emergency Contact" based on its primary status
