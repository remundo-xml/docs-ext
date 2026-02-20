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

1. Profile (default)
2. Bank Details
3. Emergency Contact
4. Service Companies
5. Calendar

Selecting a tab navigates to the corresponding sub-route.
