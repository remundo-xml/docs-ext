# Create Offer

Multi-step wizard for creating new employment or contractor engagement offers. The flow begins with an engagement type selection, then proceeds to a type-specific wizard.

## Routes

- `/organisations/:organisationId/create-eorinstance` -- Engagement type selection
- `/organisations/:organisationId/create-eorinstance/employee` -- Employee offer wizard
- `/organisations/:organisationId/create-eorinstance/contractor` -- Contractor offer wizard

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Engagement Type Selection

Two radio cards:

- **Employee** -- navigates to `.../create-eorinstance/employee`. Disabled when `tenantLicense.employeesEnabled` is false.
- **Contractor** -- navigates to `.../create-eorinstance/contractor`. Disabled when `tenantLicense.contractorsEnabled` is false.

A footer note links to `/organisations/:organisationId/company-settings` for completing company details if needed.
