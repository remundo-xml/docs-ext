# Manage Offers

Create and manage employment contract offers.

## Route

`/organisations/:organisationId/manage-eorinstances`

## Features

- Create new contract offers for candidates
- View pending offers awaiting acceptance
- Track offer status through the approval workflow
- Resend or withdraw offers as needed

## Layout

The page is divided into four areas: a **statistics header**, a **search/filter bar**, a **results area** (list or grid), and a **pagination bar**.

### Statistics header (`StatisticsList`)

- A **donut chart** (`WheelChart`) shows the count of EOR instances by status.
- Five colour-coded **filter cards** are displayed for each status:
  - **Draft** (light blue)
  - **Pending** (dark blue)
  - **Expired** (red)
  - **Onboarded** (purple)
  - **Archived** (grey)
- Clicking a filter card toggles that status as a filter, resetting pagination.
- A **Hire Worker** button (`ButtonRound`) navigates to `/organisations/:organisationId/create-eorinstance` to start a new contract offer.

### Search and filter bar

The `SearchFilter` component provides:

- **View selector** -- dropdown with options: `All`, `Active`, `Onboarded`, `Archived`. Changing the view resets pagination and re-fetches data.
- **List/Grid view toggle** -- controlled by the `manageOffersListViewSelected` store.
- **Text search** -- type-ahead with suggestions fetched from the backend (`getSearchSuggestions`). Previous in-flight requests are cancelled via `AbortController`. If the typed text matches a known status name, it is automatically added as a status filter rather than a text query.
- **Status filter pills** -- active status filters are displayed as removable pills.
- **Bulk actions dropdown** -- enabled when one or more items are selected via checkboxes. Available actions depend on the selection:
  - **Archive** -- shown when items are not already archived and archival is allowed (disabled for items where `archivalDisabled` returns true).
  - **Unarchive** -- shown when viewing the `Archived` view or when all selected items are archived.
  - **Revert to Draft** -- shown when all selected items have `Expired` status.

### Results area

Offers are displayed in one of two layouts, toggled by the view switch:

#### List view (`EngagementTableRow`)

A table with the following columns:

| Column | Description |
|---|---|
| **Select** | Checkbox for bulk selection |
| **Name** | Profile picture and candidate full name |
| **Ending** | Warning icon if the agreement is ending within 45 days or has ended |
| **Type** | Worker type tag (Employee or Contractor) |
| **Status** | Colour bullet and status description text; shows "Contract Ended" for ended contracts |
| **Location** | Country flag with tooltip |
| **Title** | Job title |
| **Activity** | Status tag (e.g. draft, pending, onboarded) -- hidden for Onboarded and Archived views |
| **Progress** | Mini donut chart showing onboarding progress percentage -- hidden for Onboarded and Archived views |

On smaller viewports, columns are progressively hidden: Progress and Title below 1220px, Location and Type below 1100px, Status below 800px.

#### Grid view (`EngagementItemContainer`)

Each offer is rendered as a card tile containing:

- A **checkbox** for bulk selection.
- An **agreement ending/ended warning** banner (shown for onboarded contracts ending within 45 days or already ended).
- An **archive button**, **contract history** button, and an **expand** button in the top-right icon row.
- A **status label** with colour bullet (hidden for signed/onboarded/archived statuses).
- The candidate's **profile picture**, **name**, **country flag**, **worker type tag**, **job title**, and **end date** (highlighted in red if ending soon).
- The **salary** (for employees) or **pay rate** with time unit (for contractors), displayed with currency formatting.
- A **progress donut chart** in the bottom-left corner (hidden for 0% progress or ended contracts).
- A **status corner indicator** in the bottom-right.
- Ended contracts are greyed out with reduced opacity.

Clicking a card or table row navigates to the contract quote page, preserving the current URL query string:
- Employee: `/organisations/:organisationId/contract-quote/:id`
- Contractor: `/organisations/:organisationId/contractor-quote/:id`

### Pagination

- A centred `Pagination` component handles page navigation.
- An **items per page** dropdown allows selecting 10, 25, 50, 100, or 200. The selection is persisted in the `manageOffersListPageSize` store.

## First worker congratulation modal

When the first worker reaches the `JoiningDocumentsVerified` status and the user has not previously dismissed the congratulation popup (tracked via `dismissedPopups` on the user identity), a `CongratulationModalFirstWorker` is displayed. Viewing this modal triggers a `SetFirstWorkerModalViewed` command so it is not shown again.

## Behavior notes

- **Billing entity scoping** -- all data is fetched for the currently selected billing entity.
- **URL query parameters** -- the current view, status filters, and search queries are read from and written to the URL using `viewKey`, `filterKey`, and `queryKey`. This enables bookmarkable filtered views.
- **Filter deduplication** -- subscription to `filteredEorListOptions` compares serialised query parameters to avoid duplicate API calls.
- Results are sorted by the `applies` date in descending order (newest first).
- On destroy, stores are reset and the EOR list details store is cleared.
