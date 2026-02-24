# Absence Detail

Detail view for a specific absence or annual leave approval request, showing a calendar visualization, entitlement data, and approval actions.

## Route

Rendered within `/organisations/:organisationId/pending-approvals/:approvalId` when the request type is Holiday or Illness.

## Layout

A responsive CSS grid with five areas: profile card, entitlement widget, approval card, calendar, and file attachment. Layout adapts across breakpoints from single-column (mobile) to two-column (desktop).

### Worker Profile Card

Displays the worker's profile: name, country, contract type, job title, team, manager names, HR-only status. Uses a small profile picture size ("xs"). Greyed out when the contract has ended.

### Entitlement Widget

Shown only for Holiday requests when `useAccrual` is enabled. Displays:
- Radial bar chart of entitlement data (fetched via `getEntitlementAt` for the current date)
- `AbsenceWheelChart` showing a breakdown of absence types (excluding holidays), with a wheel width of 90px

### Approval Card

Rendered via the `Approval` component. Shows request details and dispatches approve/decline events.

### Calendar Display

Rendered via the `CalendarDisplay` component. Shows the absence date range with colour-coded cells:
- Start date and end date define the range
- Weekend and public holiday dates are excluded from the count (for working-day-based leave) or highlighted (for calendar-day-based leave via `LeaveBases.CalendarDays`)

Calendar placement:
- When a file is attached, the calendar is in the grid alongside the file viewer.
- When no file is attached, the calendar is displayed separately below the grid.

### File Attachment

Shown when `absence.fileName` is present. Rendered via `ApprovalFileAttached` with full-width display. The file is fetched using the absence ID and file name.

## Data Loading

On initialisation:
1. Fetches worker details via `getWorkerDetails`.
2. If the absence has accrual states and `useAccrual` is enabled, fetches entitlement data via `getEntitlementAt`.
3. Fetches all holiday and illness approvals for the worker via `getPendingApprovalByWorkerId` (for the "All" status view). Filters to current-year holidays and all illness absences.

The component re-initialises when `refreshKey` changes (triggered after entitlement changes).

## Behavior notes

- If worker details fail to load, the profile card section is hidden.
- The grid layout uses different column/row configurations at breakpoints: 767px, 1024px, 1440px, 1600px, and 1920px.
- Excluded dates (weekends and public holidays) are combined from `weekendDates` and `publicHolidayDates` on the absence object.
