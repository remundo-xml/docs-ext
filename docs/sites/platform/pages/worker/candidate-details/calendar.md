# Calendar

Personal calendar view showing engagement-related events and public holidays.

## Route

`/candidate-details/calendar`

## Overview

Displays a `WorkerCalendar` component tied to the currently selected engagement. The calendar loads event data based on the engagement's country (or region if set) and start date.

## Data loading

- On mount, calendar data is fetched for the previous, current, and next year via `loadCalendarData`
- Additional years are lazy-loaded when the user navigates to them via `loadYearData`
- Already-loaded years are tracked to avoid duplicate fetches

## Display

- A header shows the full country name (resolved from the engagement's ISO code) when an engagement is selected
- A loading state is shown while data is being fetched
- The calendar wrapper supports horizontal scrolling on narrow viewports
