# Absence Detail

Detail view for a specific absence or annual leave approval request, showing a calendar visualization, entitlement data, and approval actions.

## Route

Rendered within `/organisations/:organisationId/pending-approvals/:approvalId` when the request type is Holiday or Illness.

## Layout

A responsive CSS grid (`grid-container`) with five areas: profile card, entitlement widget, approval card, calendar, and file attachment. Layout adapts across breakpoints from single-column (mobile) to two-column (desktop).

### Worker Profile Card

Grid area: `profile-card` (column 1, row 1).

Rendered by the `ProfileCard` component. Displays:
- Worker profile picture (by `userId`, size "xs")
- Full name (`firstName` + `lastName`)
- Country (`jobLocation`)
- Worker contract type (`workerContractType`)
- Job title
- Team name (`teamName`)
- Manager names (derived from `assignedManagers` or, if empty, `managersOfUnassigned`; values extracted via `Object.values`)
- HR-only status (`hrOnly`)
- Contract ended status (`isContractEnded`)
- Greyed out when the contract has ended (`isGreyedOut` prop)

Hidden entirely if worker details fail to load (`hideWorkerDetails` flag).

### Entitlement Widget

Grid area: `entitlement-widget` (column 2, rows 1-2).

Shown only for Holiday requests when the `useAccrual` feature flag is enabled. Contains:

- `EntitlementWidget` component with:
  - `organisationId` from worker details
  - `workerContractType` from worker details
  - `countryIsoCode` from `jobLocationRegion` (if defined) or `jobLocation`
  - `startDate` from worker's contract start date
  - `showLegend` enabled
  - `entitlement` data (fetched via `getEntitlementAt`)
  - Responsive padding adjustments based on `innerWidth` at 1440px and 1600px breakpoints
- Radial bar chart of entitlement data
- `AbsenceWheelChart` (in the `extra-component` slot) showing a breakdown of absence types (excluding holidays), with a wheel width of 90px and `showTotal` disabled

### Approval Card

Grid area: `approval-card` (column 1, row 2).

Rendered via the `Approval` component. Displays request details specific to the absence type:

**For Holiday requests (with `useAccrual`):**
- **Requested days** with leave type (Working or Calendar, determined by `absence.basis`). When outstanding days exist (`approval.absence.outstanding` is truthy), the text is styled in red (`text-danger`) with a warning triangle (`InfoTip`) tooltip showing the `AbsenceRequestedText`.
- **Calendar basis info** (`InfoTip` with info circle icon): shown when `absence.basis === LeaveBases.CalendarDays`, explains calendar-day-based leave for the worker's country.
- **Available days** from `entitlement.state.totalAvailable`
- **Allocated days** from `entitlement.state.totalAllocated`
- **Used days** from `entitlement.state.totalUsed`

**For Holiday requests (without `useAccrual`):**
- **Remaining days**: `absenceDaysAllowed - usedDays - requestedDays` (or `absenceDaysAllowed - usedDays` when approved)
- **Currently used**: `usedDays`

**For Illness requests:**
- **Type**: absence type text from `getAbsenceTypeText(approval.absence.absenceType)`
- Same requested days display as Holiday with outstanding warning

**Common fields (Holiday and Illness):**
- **Start date** (formatted via `formatDateRemundoStandard`)
- **Public holiday dates** (shown when present and basis is not CalendarDays; formatted as "dd MMM", comma-separated)
- **Weekend dates** (shown when present and basis is not CalendarDays; formatted as "dd MMM", comma-separated)
- **End date** (formatted via `formatDateRemundoStandard`)
- **Note** (shown when `absence.note` exists; truncated with `Ellipses` component)
- **File attached** indicator (shown when `absence.fileName` exists; paperclip icon with tooltip showing file name)
- **Submitted date** (formatted via `formatDateRemundoStandard`)
- **Status** with display status, approver/rejector name, and date
- **Approval buttons** (shown via `allowApprovalAction` check; includes second-level pending restriction text)
- **Rejection reason** (shown when status is Rejected; displays `approval.comment` in a bordered card)

### Calendar Display

Rendered via the `CalendarDisplay` component. Shows the absence date range with colour-coded cells.

**When a file is attached**: Calendar is in the grid area `calendar` (column 1, row 3), alongside the file viewer.

**When no file is attached**: Calendar is displayed separately below the grid in a responsive column (`col-xl-5 col-lg-5 col-md-8 col-sm-10 col-12`).

Calendar props:
- `status` -- Approval status (as string)
- `startDate` -- From `approval.absence.startDate` (converted via `getDateOnly`)
- `endDate` -- From `approval.absence.endDate` (converted via `getDateOnly`)
- `excludedDates` -- When basis is CalendarDays: empty array. Otherwise: combined `weekendDates` and `publicHolidayDates`.
- `includedWeekendsAndHolidays` -- When basis is CalendarDays: combined `weekendDates` and `publicHolidayDates`. Otherwise: empty array.

### File Attachment

Grid area: `file-attachment` (column 2, row 3).

Shown when `approval.absence.fileName` is present. Rendered via `ApprovalFileAttached` with `allowFullWidth` enabled. Receives `absenceId` (from `approval.id`) and `fileName` (from `approval.absence.fileName`).

## Data Loading

On initialisation (`pInit`):
1. Fetches worker details via `getWorkerDetails(approval.eorId, approval.organisationId)`. On failure, sets `hideWorkerDetails = true`.
2. If the absence has accrual states (`approval.absence.states`) and `useAccrual` is enabled, fetches entitlement data via `getEntitlementAt(approval.eorId, new Date())`.
3. Fetches all holiday and illness approvals for the worker via `getPendingApprovalByWorkerId(workerDetails.id, [RequestType.Illness, RequestType.Holiday], 'All' status)`.
4. Filters results: includes all illness absences and only current-year holidays (`startDate.getFullYear() == currentYear`). Collects absence data into the `absences` array for the wheel chart.

The component re-initialises when `refreshKey` changes (triggered after entitlement changes via the parent `DetailView`).

## Behavior notes

- If worker details fail to load, the profile card section is hidden but the rest of the page still renders.
- The grid layout uses different column/row configurations at breakpoints:
  - Below 767px: single column (`0.75fr`), all items stack vertically with `width: max-content` (calendar uses `width: min-content`)
  - 768px-1024px: two columns (`45% 55%`)
  - 1025px-1440px: two columns (`35% 65%`), profile card fixed at `19.375rem`
  - 1440px-1600px: two columns (`35% 65%`), profile card fixed at `19.375rem`
  - 1600px-1919px: two columns (`35% 65%`), profile card fixed at `19.375rem`
  - 1920px+: two columns (`25% 75%`)
- Excluded dates (weekends and public holidays) are combined from `weekendDates` and `publicHolidayDates` on the absence object into `absenceWeekendAndHolidays`.
- The `CalendarDisplayPopup` component handles popup interactions within the calendar.
