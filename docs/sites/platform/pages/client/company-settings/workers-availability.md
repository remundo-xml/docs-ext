# Workers Availability

Horizontal monthly calendar showing worker availability, time-off, and public holidays. Displayed as a tab within Company Settings, conditional on a feature flag.

## Route

`/organisations/:organisationId/company-settings/workers-availability`

Accepts an optional `query` parameter for pre-filtering by worker name. Multiple names can be comma-separated.

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Visibility

Conditional on the `showWorkersAvailability` feature flag. Tab index 4 in Company Settings.

## Layout

### Header

- Title and description text (i18n keys: `organisation.workers-availability.title` and `organisation.workers-availability.description`).
- Total worker count display in the calendar header's first column slot: "Total: {totalItems}".

### Calendar

A `HorizontalMonthlyCalendar` component with:

- **Month stepper** -- Navigate forward/backward through months. Current month is the default (`stepperValue = 0`). Changing month updates `year` and `month` via `addMonths(new Date(), stepperValue)`, resets to the current page, and reloads data.
- **Search** -- Filter workers by name (`queries` parameter, bound two-way). Updating queries resets to page 1 and triggers a reload via the `queriesUpdated` event.
- **Items per page** -- Configurable; persisted in `workerTimeOffPageSize` store. Changing page size resets to page 1.
- **Pagination** -- Page navigation controls with `totalPages` computed as `Math.max(1, Math.ceil(totalItems / itemsPerPage))`. Page number is clamped between 1 and `totalPages`.

### Worker Rows

Each row shows (via the `first-column` slot):
- Worker profile picture (by `candidateId`) via `ProfilePicture` component (size: "xs")
- Worker full name (truncated with `Ellipses` component)
- Country flag (ISO code, lowercase)
- Job title (truncated with `Ellipses` component)

### Calendar Cells

Each cell represents a single day for a worker. Cell appearance is determined by `getWorkerDayCellProps` and rendered via the `CalendarDay` component. Cell types (by CSS variable colour):

- **Weekend**: `#dee6ee`
- **Public Holiday**: `#b8d4e3`
- **Annual Leave**: `#9796f2`
- **Medical Leave**: `#c899a2`
- **Unpaid Leave**: `#f5c6aa`
- **Bonus Day**: `#a5d6a7`
- **Special Event**: inherit background, `#2f93b1` border
- **Rejected**: `#bd1f37` border
- **Pending**: `#f1ad0e` border

## Data Loading

Workers fetched via `getWorkersAvailability` with parameters:
- Organisation ID (from user store)
- Billing Entity ID (from local storage via `Local.Keys.SelectedBillingEntityId`)
- Year and month (derived from stepper offset)
- Pagination offset (`(currentPage - 1) * itemsPerPage`) and limit (`itemsPerPage`)
- Search queries

The request is debounced (500ms via lodash `debounce`) to avoid excessive API calls during rapid navigation.

Workers are transformed into a map (`workersMap`) keyed by worker ID for efficient lookup during calendar rendering. A `workerIds` array is derived for the calendar's `itemIds` prop.

## Real-time Updates

WebSocket connection via `AbsencesToken` PubSub channel, subscribed per page of worker EOR IDs using `subscribePubSub`:

- `absence-submitted` -- Reloads current page silently (no loading indicator).
- `absence-approved` -- Reloads current page silently.
- `absence-rejected` -- Reloads current page silently.
- `absence-removed` -- Reloads current page silently.

The WebSocket subscription is re-established when the set of visible worker IDs changes (e.g. after pagination or filtering). Previous connections are stopped via `stopPubSubConnection(wsPubSubAbsencesStore)` before new ones are created. The event listener is registered once (`isListenerRegistered` flag) and reused across page changes via `createPubSubEmitter`.

## Behavior notes

- On data load failure, an error notification is shown via `showErrorNotification`.
- The debounced load function is cancelled on component destroy via `loadWorkers.cancel()`.
- The absences listener is disposed on component destroy via `absencesListener.dispose()`.
- Worker cards are responsive: on screens narrower than 560px, the worker card content is centred.
- The `setPage` function accepts a `showLoad` parameter; when `false` (used by WebSocket handlers), the loading indicator is not shown during reload.
