# Calendar

Monthly calendar view for an individual worker, showing public holidays, absences, and leave entries colour-coded by type.

## Route

`/organisations/:orgId/workers/:id/calendar`

## Layout

### Calendar Header

Displays the worker's city and full country name (resolved from the ISO code via `isoToCountryName`).

### Calendar Component

Rendered via the `WorkerCalendar` component. Shows a monthly grid with colour-coded cells for different event types (public holidays, annual leave, absences, etc.).

## Data Loading

On initialisation:
1. Fetches the EOR instance via `getEorInstance`.
2. Fetches worker details via `getWorkerDetails`.
3. Loads calendar data via `loadCalendarData` for the worker's EOR ID, effective country ISO (preferring `jobLocationRegion` over `jobLocation`), and start date.
4. Initial load covers three years: previous, current, and next.

### Lazy Loading

When the user navigates to a year that has not yet been loaded, `loadYearData` is called for that year. Loaded years are tracked in a `Set` to avoid duplicate requests. A new `Map` reference is created after loading to trigger Svelte reactivity.

## Behavior notes

- The calendar container has horizontal scrolling enabled.
- If worker data cannot be loaded, an alert warning is displayed: "Unable to load calendar data for this worker."
- The effective country ISO code is `jobLocationRegion` when available, otherwise `jobLocation`.
