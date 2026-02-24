# Workers

View and manage employees across your organisation.

## Route

`/organisations/:organisationId/workers`

## Sub-routes

`/organisations/:organisationId/workers/:workerId/details` -- individual worker detail view.

## Features

- List all workers with contract status
- Filter by country, status, or department
- View individual worker details and onboarding progress
- Access employment agreements and documents

## Layout

The page is divided into three main areas: a **header** with team statistics, a **search/filter bar**, and a **results area** with pagination.

### Header (team statistics)

- A **donut chart** (`WheelChart`) shows the distribution of workers across teams, with each team rendered in its assigned colour.
- The total member count is displayed in the centre of the chart.
- Next to the chart, a **carousel of team filter cards** shows each team's name, colour bullet, and member count. The number of visible cards adapts to the viewport width (1 on small screens, up to 4 on wide screens).
- Clicking a team card toggles a filter on that team. Active filters are highlighted on the card. Empty teams are filtered out of the display.
- Teams with no assigned name display as "Unassigned".

### Search and filter bar

The `SearchFilter` component provides:

- **View toggle** -- switch between `All`, `Active`, and `Inactive` workers. The selection is stored in `filteredEorListOptions.viewOption`.
- **List/Grid view toggle** -- controlled by the `workersListViewSelected` store. When enabled the list (table) view is shown; when disabled the grid (card) view is shown.
- **Text search** -- type-ahead search with suggestions fetched from the backend (`getSuggestionsForManagerWorkersPageByOrganisationId`). Previous in-flight requests are cancelled with `AbortController`. Entering a team name automatically converts it to a team filter.
- **Team filters** -- displayed as removable pills. Teams are resolved by name from the current `teamStats`.
- **HR-only filter** -- in the list view, clicking the **Type** column header cycles through three states: HR-only, non-HR-only, and unfiltered.
- **Bulk actions** -- enabled when one or more workers are selected via checkboxes. The actions dropdown contains a **Change Team** nested submenu listing all teams. Select a target team and click **Move** to reassign workers.

### Results area

Workers are displayed in one of two layouts:

#### List view (`ManageEmployeesList`)

A table with the following columns:

| Column | Description |
|---|---|
| **Select** | Checkbox for bulk selection |
| **Name** | Profile picture and full name |
| **Status** | Warning icon if the agreement is ending within 45 days or has ended |
| **Type** | Worker contract type tag (Employee/Contractor) plus an HR-only badge if applicable |
| **Team** | Team colour dot and team name; shows "Inactive" for ended contracts |
| **Title** | Job title |
| **Location** | Country flag with a tooltip showing the full country name |
| **Action** | Pending approval count badge; clicking navigates to the pending approvals page |
| **Managers** | Up to 3 stacked profile pictures with a tooltip listing all assigned managers |
| **History** | Employment history tooltip |

On mobile (below 768px), the **Type**, **Team**, **Title**, **Managers**, and **History** columns are hidden.

#### Grid view (`ManageEmployeesGrid`)

Workers are rendered as card tiles using `TeamsItemContainer`. Each card contains the worker's profile picture, name, team colour, contract type, and a select checkbox. Cards dispatch the same navigation and approval events as table rows.

### Pagination

- Displayed at the bottom of the page in a sticky bar.
- A centred `PaginationTeams` component handles page navigation.
- An **items per page** dropdown on the right allows selecting 10, 25, 50, 100, or 200 items. The selection is persisted in the `workersListPageSize` store.

## Behavior notes

- **Billing entity scoping** -- all data is fetched for the currently selected billing entity (stored in `Local.Keys.SelectedBillingEntityId`).
- **Real-time updates** -- a WebSocket connection (`WorkerDetailsTeamUpdateToken`) listens for `worker-details-team-members-updated` events. When received, both the worker list and team statistics are refreshed.
- **URL query parameters** -- the current view, team filters, and search queries are read from and written to the URL query string using the `viewKey`, `filterKey`, and `queryKey` constants. This allows bookmarking and sharing filtered views.
- **Navigation** -- clicking a worker row or card navigates to `/organisations/:organisationId/workers/:workerId/details`, preserving the current query string. Clicking the approval badge navigates to the pending approvals page with the worker's name pre-filled as a search query.
- **Filter deduplication** -- filter changes are debounced by comparing the serialised query parameters; duplicate requests are skipped.
- On destroy, the `filteredEorListOptions` store is reset and the WebSocket connection is disposed.
