# Calendar

Personal calendar view showing engagement-related events and public holidays.

## Route

`/candidate-details/calendar`

## Overview

Renders at `activeTab={5}` within `CandidateDetailsTabs`. Displays a `WorkerCalendar` component tied to the currently selected engagement via the `currentEngagement` store. The calendar loads event data based on the engagement's country (or region if set) and start date.

## Data loading

- On mount, calendar data is fetched for the previous, current, and next year via `loadCalendarData`
- The effective country ISO is determined by `currentEngagement.region` (preferred) or `currentEngagement.country` (fallback)
- The effective start date is taken from `currentEngagement.startDate`
- Additional years are lazy-loaded when the user navigates to them via `loadYearData` and the `onYearChange` handler
- Already-loaded years are tracked in a `Set<number>` to avoid duplicate fetches
- When a new year is loaded, the `calendarData` map is replaced with a new reference to trigger Svelte reactivity

## Reactive engagement loading

If `currentEngagement` becomes available after mount (was not set during initial `onMount`), the calendar data is reactively loaded via a `$:` block that checks `$currentEngagement && !hasLoadedInitialData`.

## Display

- A header shows the full country name (resolved from the engagement's ISO code via `isoToCountryName`) when an engagement is selected
- A loading state is shown while data is being fetched (`isLoading` flag)
- The calendar wrapper supports horizontal scrolling on narrow viewports (`overflow-x: auto`)
