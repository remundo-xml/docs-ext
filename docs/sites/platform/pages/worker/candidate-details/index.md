# Candidate Details

Manage personal and employment details across profile, banking, emergency contacts, service companies, and calendar.

## Route

`/candidate-details`

## Sub-routes

- `/candidate-details/profile` - Personal information
- `/candidate-details/bank-details` - Payment account details
- `/candidate-details/emergency-contact` - Emergency contact information
- `/candidate-details/service-companies` - Contractor service companies
- `/candidate-details/service-companies/:id/details` - Service company details
- `/candidate-details/calendar` - Personal calendar view

## Tab structure

The page uses a tabbed layout (`CandidateDetailsTabs`) with five tabs:

1. **Profile** (default, icon: `bi-person`)
2. **Bank Details** (icon: `bi-bank`)
3. **Emergency Contact** (custom icon: `EmergencyContact`)
4. **Service Companies** (icon: `bi-house`)
5. **Calendar** (icon: `bi-calendar`)

Selecting a tab navigates to the corresponding sub-route. Tab labels are translated via the `candidate-details.tabs.` i18n path.

## Conditional tab availability

On mount, the component checks whether the current user has any signed engagements by calling `getFullCandidateEorInstancesByEmail`. The result controls which tabs are enabled:

- **Profile**, **Service Companies**, and **Calendar** are always enabled
- **Bank Details** is disabled when the `useBankDetails` setting is off or the user has no signed engagements
- **Emergency Contact** is disabled when the `useEmergencyContacts` setting is off or the user has no signed engagements

Disabled tabs remain visible but cannot be selected. If fetching engagements fails, all tabs are treated as enabled (the check defaults to `true` on error).

## Navigation behavior

The active tab is passed as a prop (`activeTab`) from each child page. Clicking a tab navigates to the corresponding sub-route via the `TabHandler` component. The currently active tab is highlighted based on the `activeTab` value.
