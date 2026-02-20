# Workers Availability

Horizontal monthly calendar showing worker availability, time-off, and public holidays. Displayed as a tab within Company Settings, conditional on a feature flag.

## Route

`/organisations/:organisationId/company-settings/workers-availability`

Accepts an optional `query` parameter for pre-filtering by worker name.

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Visibility

Conditional on the `showWorkersAvailability` feature flag. Tab index 4 in Company Settings.

## Layout

### Header

- Title and description text.
- Total worker count display.

### Calendar

A `HorizontalMonthlyCalendar` component with:

- **Month stepper** -- Navigate forward/backward through months. Current month is the default. Changing month resets to page 1 and reloads data.
- **Search** -- Filter workers by name (query parameter). Updating queries resets to page 1.
- **Items per page** -- Configurable; persisted in `workerTimeOffPageSize` store. Changing resets to page 1.
- **Pagination** -- Page navigation controls with total page count.

### Worker Rows

Each row shows:
- Worker profile picture (by `candidateId`)
- Worker full name (truncated with ellipsis)
- Country flag (ISO code)
- Job title (truncated with ellipsis)

### Calendar Cells

Each cell represents a single day for a worker. Cell appearance is determined by `getWorkerDayCellProps` and rendered via the `CalendarDay` component. Cell types (by CSS variable colour):

- Weekend: `#dee6ee`
- Public Holiday: `#b8d4e3`
- Annual Leave: `#9796f2`
- Medical Leave: `#c899a2`
- Unpaid Leave: `#f5c6aa`
- Special Event: inherit background, `#2f93b1` border
- Rejected: `#bd1f37` border
- Pending: `#f1ad0e` border

## Data Loading

Workers fetched via `getWorkersAvailability` with parameters:
- Organisation ID (from user store)
- Billing Entity ID (from local storage)
- Year and month (derived from stepper offset)
- Pagination offset and limit
- Search queries

The request is debounced (500ms) to avoid excessive API calls during rapid navigation.

## Real-time Updates

WebSocket connection via `AbsencesToken` PubSub channel, subscribed per page of worker EOR IDs:

- `absence-submitted` -- Reloads current page silently.
- `absence-approved` -- Reloads current page silently.
- `absence-rejected` -- Reloads current page silently.
- `absence-removed` -- Reloads current page silently.

The WebSocket subscription is re-established when the set of visible worker IDs changes (e.g. after pagination or filtering). Previous connections are stopped before new ones are created.

## Behavior notes

- On data load failure, an error notification is shown.
- The WebSocket listener is registered once and reused across page changes.
- The debounced load function is cancelled on component destroy.
- Worker cards are responsive: on screens narrower than 560px, the worker card content is centred.
