# Absences

Request and manage time off. The page displays an entitlement summary, a submission form, and a history of absence requests grouped by status.

## Route

`/absences`

## Features

- Request annual leave, sick leave, unpaid leave, parental leave, TOIL (Time Off In Lieu), and other absence types
- View remaining entitlement (days available, used, pending, and remaining)
- Entitlement widget with wheel chart visualization (when the `useAccrual` feature flag is enabled)
- Track approval status (Pending, Approved, Rejected, Overdue)
- Multi-level approval stage indicator on each absence card
- Attach supporting documents (e.g. medical certificates) via file upload, camera capture, or QR code for mobile upload
- Delete pending, overdue, or future approved requests with an optional comment
- Carry-over allowance display for workers with rolled-over days from the previous year
- Entitlement activation delay — when `useAccrual` is enabled, a message is shown until the activation date has passed (calculated from the contract start date plus `entitlementActivationDelay` months)
- Real-time updates via WebSocket (`AbsencesToken`) — when an absence is approved or rejected, the page reloads automatically and recalculates entitlement
- New vs legacy layout toggle (feature-flagged with `useNewAbsencesLayout`) — the new layout uses accordion sections grouped by status; the legacy layout uses two flat lists (Pending and Concluded)
- Submission disabled when the contract has ended, with a tooltip explaining why

## Behaviour notes

### Entitlement display

When `useAccrual` is **disabled** (legacy mode), the page shows a simple text summary:
- Annual leave allowance (total days)
- Carry-over allowance (if any)
- Annual leave taken (approved days)
- Annual leave pending (pending days)
- Annual leave remaining (calculated as total + carry-over - approved - pending)

When `useAccrual` is **enabled**, the page shows an `EntitlementWidget` with:
- An accrual-based entitlement breakdown fetched from `getEntitlementAt`
- An `AbsenceWheelChart` showing approved absences for the current year (excluding holidays)
- Entitlement rules including reset points, leave policy basis, and maximum negative accrual

### Absence types

Available absence types are fetched per worker from `getAbsenceTypesByWorker` and depend on the worker's contract type and country. Common types include Annual Leave (Holiday), Sick Leave, Unpaid Leave, Parental Leave, Compassionate Leave, and TOIL (Time Off In Lieu).

TOIL absences have special handling: the start and end date are the same (single day only), and duration type controls are disabled.

### Working days calculation

The system fetches working days for the engagement's country and region to correctly calculate absence durations. Weekends and public holidays are excluded from day counts.

### New layout (V2)

When `useNewAbsencesLayout` is enabled, the `AbsenceHistory` component renders four accordion sections:
- **Draft** — draft absences (expanded by default)
- **Pending** — pending and overdue absences (auto-expands after a new submission)
- **Approved** — approved, payment-due, and paid absences
- **Rejected** — rejected absences

Each section sorts absences by most recent first.

### Legacy layout

When `useNewAbsencesLayout` is disabled, absences are split into two lists:
- **Pending** — absences with status Pending or Overdue
- **Concluded** — all other statuses (Approved, Rejected, etc.)

## How to request time off

### Step 1: Check your entitlement

Navigate to the **Absences** page from the sidebar. At the top you can see your entitlement summary: total days entitled, days used, days pending approval, and days remaining. When the accrual system is active, a visual wheel chart shows the breakdown.

### Step 2: Create a new request

Click **Submit Absence Request**. Fill in the form:

- **Absence Type** — select from the dropdown (Annual Leave, Sick Leave, Unpaid Leave, Parental Leave, TOIL, etc.). Available types depend on your contract.
- **Duration Type** — choose All Day or Half Day. If Half Day, select Morning or Afternoon. For TOIL requests, this control is disabled.
- **Start Date** and **End Date** — select the date range. Weekends and public holidays are not counted towards your entitlement. Dates before the entitlement activation date (if accrual is enabled) or before the minimum allowed date are disabled. For TOIL, only a single day can be selected.
- **Note** (optional) — add context for your request.
- **File attachment** (optional) — upload a supporting document such as a medical certificate (PDF, JPG, PNG). You can also use the camera to capture a document directly, or scan the QR code to upload from your mobile device.

### Step 3: Review and submit

The system validates your request against your remaining entitlement and checks for conflicts with submitted timesheets or existing absences. Specific validations include:

- Remaining entitlement must be sufficient for the requested days (unless maximum negative accrual is configured)
- If the request would slightly exceed remaining days, the system may offer to convert to a half-day submission
- If there are timesheet conflicts with approved weeks, you are prompted to raise a support request for timesheet cancellation
- If there are timesheet conflicts with pending weeks, an informational modal explains that those timesheets will be affected
- Cross-cycle absences (spanning an entitlement reset point) are blocked when accrual is enabled

Click **Submit**, review the summary in the confirmation modal, and click **Confirm**.

## Managing absence requests

Your requests appear as cards showing the absence type, dates, number of days, status, attached files, notes, and a multi-level approval stage indicator:

- **Pending** (yellow hourglass) — awaiting manager approval. Can be deleted with an optional comment.
- **Approved** (green check) — confirmed. Can be deleted if the dates are still in the future.
- **Rejected** (red exclamation) — declined, with a rejection note shown in a tooltip. Can be deleted and resubmitted.
- **Overdue** (red clock) — approval delayed beyond the expected timeframe. Can be deleted.

When the accrual system is active, absence cards that exceed the worker's entitlement display a warning icon with the number of days exceeded.
