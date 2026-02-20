# Company Settings

Central settings hub for an organisation. Organised as a tabbed interface where each tab is a separate sub-page. The active tabs vary based on role and feature flags.

## Route

`/organisations/:organisationId/company-settings`

## Sub-routes

- `/organisations/:organisationId/company-settings` -- Details (default)
- `/organisations/:organisationId/company-settings/billing-entities/:billingEntityId` -- Billing entity detail view
- `/organisations/:organisationId/company-settings/manage-users` -- User management
- `/organisations/:organisationId/company-settings/manage-teams` -- Team management
- `/organisations/:organisationId/company-settings/workers-availability` -- Workers availability calendar (conditional)
- `/organisations/:organisationId/company-settings/general-settings` -- General settings toggles (conditional)

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Tabs

The tab bar includes:

1. Details (icon: house) -- always visible
2. Manage Users (icon: person-plus) -- hidden for TeamAdmin
3. Manage Teams (icon: diagram) -- always visible
4. Workers Availability (icon: file-earmark-person) -- conditional on `showWorkersAvailability` feature flag
5. General Settings (icon: diagram) -- conditional on `showOrganisationGeneralSettingsTab` feature flag
