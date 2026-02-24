# Company Settings

Central settings hub for an organisation. Organised as a tabbed interface where each tab is a separate sub-page. The active tabs vary based on role and feature flags.

## Route

`/organisations/:organisationId/company-settings`

## Sub-routes

- `/organisations/:organisationId/company-settings` -- Details (default)
- `/organisations/:organisationId/company-settings/details/` -- Details expanded view (home organisation)
- `/organisations/:organisationId/company-settings/billing-entities/:billingEntityId` -- Billing entity detail view
- `/organisations/:organisationId/company-settings/manage-users` -- User management
- `/organisations/:organisationId/company-settings/manage-teams` -- Team management
- `/organisations/:organisationId/company-settings/workers-availability` -- Workers availability calendar (conditional)
- `/organisations/:organisationId/company-settings/general-settings` -- General settings toggles (conditional)
- `/organisations/:organisationId/company-settings/general-settings/sign` -- Timesheet access permit signing (conditional)

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Tabs

The tab bar is rendered via `OrganisationSettingsTabs`. It supports two layout modes controlled by the `useHorizontalTabs` prop: vertical sidebar (default, via `TabHandler`) or horizontal tabs (via `TabHandlerHorizontal`). V2 Manage Users uses horizontal tabs; all other pages use the vertical sidebar.

Each tab definition includes an `id`, `name`, Bootstrap icon class, `disabled` flag, and `link`. Tabs are translated using the `organisation.company-settings.tabs.` i18n path.

The tab bar includes:

1. **Details** (id: 1, icon: `bi-house`) -- Always visible. Links to the root company settings route. Active tab index 1.
2. **Manage Users** (id: 2, icon: `bi-person-plus`) -- Hidden when the user's principal role is `TeamAdmin`. Links to `.../manage-users`. Active tab index 2.
3. **Manage Teams** (id: 3, icon: `bi-diagram-3-fill`) -- Always visible. Links to `.../manage-teams`. Active tab index 3.
4. **Workers Availability** (id: 4, icon: `bi-file-earmark-person`) -- Shown only when the `showWorkersAvailability` feature flag is true. Links to `.../workers-availability`. Active tab index 4.
5. **General Settings** (id: 5, icon: `bi-diagram-3-fill`) -- Shown only when the `showOrganisationGeneralSettingsTab` feature flag is true. Links to `.../general-settings`. Active tab index 5.

## Navigation

- The root URL (`rootUrl`) is constructed from the current user's `organisationId`: `/organisations/${organisationId}/company-settings`.
- Tab links are absolute paths derived from `rootUrl`.
- The `activeTab` prop (bound two-way) controls which tab is highlighted. Each sub-page sets this prop when rendering `OrganisationSettingsTabs` (e.g., Details sets `activeTab={1}`, Manage Users sets `activeTab={2}`).
- Clicking a tab navigates to its `link` URL.

## Behavior notes

- The user's principal role is determined at render time via `pickPrincipalRole($user.remundoIdentity)`.
- Feature flag values (`showWorkersAvailability`, `showOrganisationGeneralSettingsTab`) are imported from `@src/util/settings` and evaluated once at component initialisation.
- The tab array is built using spread syntax with conditional arrays, so hidden tabs are excluded entirely (not disabled).
