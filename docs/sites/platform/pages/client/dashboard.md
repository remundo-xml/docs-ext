# Dashboard

Organisation overview and key metrics.

## Route

`/organisations/:organisationId/dashboard`

## Layout

The dashboard renders one of two views based on the current user context:

- **Candidate view** -- shown when the user is in candidate mode (`isCandidateView` store).
- **Employer view** -- shown for organisation users. The rest of this page describes the employer view.

Within the employer view, the page further branches based on whether the organisation has any EOR instances:

- **Empty state (`Organisation`)** -- displayed when there are zero EOR instances. Shows a personalised welcome greeting ("Hello, {firstName}!"), an illustration, a description message, and a **Hire a Team Member** button that navigates to `/organisations/:organisationId/create-eorinstance`.
- **Full dashboard (`EORCWidgetPage`)** -- displayed when at least one EOR instance exists. Contains the widget grid described below.

## Features

- Summary of active workers
- Pending actions and approvals
- Recent activity feed

## Widgets (employer view with data)

The full dashboard is composed of the following widgets, rendered in a flex-wrap layout:

### EOR List Widget (Engagements)

- Displays a donut chart of EOR instance statuses: **Draft**, **Pending**, **Expired**, **Onboarded**, **Archived**.
- Each status shows its count alongside a colour-coded bullet.
- Shows a total count of all engagements.
- Clicking the chart navigates to the **Manage Offers** page. If there are action-required items, the `ActionRequired` filter is applied automatically.
- The widget menu icon is conditionally shown via the `showManageOfferWidgetMenuIcon` feature flag.

### EOR Team Widget (Workers)

- Displays a donut chart breaking down workers by team, with each team shown in its assigned colour.
- Lists team names and member counts in a vertical carousel (up to 4 visible at a time).
- Shows a total worker count at the bottom.
- An expand button navigates to the **Workers** page (`/organisations/:organisationId/workers`).
- Real-time updates via WebSocket (`WorkerDetailsTeamUpdateToken`) -- the chart refreshes when team membership changes.
- Falls back to a skeleton placeholder when no team data is available.

### Tasks Widget

- Conditionally rendered when the `useTasksWidget` feature flag is enabled.
- Fetches a list of tasks for the current user via `getTaskList` and sorts them (pinned first, then by date descending).
- Each task card displays an icon (colour-coded by type), a title, a description with an optional action link, and a three-dot menu with **Pin/Unpin** and **Hide** actions.
- Task types trigger specific navigation: `CompleteIdVerification` and `ProvideAdditionalNationality` open an iDenfy verification modal; work-permit tasks navigate to the relevant contract quote page.
- Real-time updates via WebSocket (`TaskListToken`) -- the task list re-fetches when a `task-list-updated` event is received.
- Shows a placeholder skeleton while loading; displays a "no tasks" message with a checklist icon when the list is empty.

### Onboarding Status Widget

- Shows the onboarding progress of engagements that have started the process.
- Data is paginated (50 items per page) and fetched for the selected billing entity.
- Filters out items with zero progress unless they are in `Pending` or `Required` status.
- Displays up to 4 items at a time in a scrollable list with up/down navigation buttons; loads more data on demand.
- An expand button navigates to the **Manage Offers** page.

### Workers by Country Widget

- Visualises the geographic distribution of workers using organisation statistics.

### Time Off Widget

- Shown only when there are country-level employee counts.
- Displays upcoming regional holidays for countries where the organisation has workers.

### Worker Timezone Widget

- Conditionally rendered when the `showWorkerTimeZoneWidget` feature flag is enabled and the organisation has employees in at least one country.
- Shows timezone information for the organisation's workforce relative to the organisation's own country.

## Behavior notes

- On initialisation, the dashboard fetches organisation details (cached in local storage for `CompanyOwner` and `CompanyAdmin` roles), organisation statistics, country employee counts, and the selected billing entity.
- If the organisation ID is missing or API calls fail, the user is redirected to the 404 page.
- Skeleton widget placeholders are displayed while data is loading.
