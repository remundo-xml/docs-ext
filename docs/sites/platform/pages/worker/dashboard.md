# Worker Dashboard

Overview of the worker's engagements, pending offers, onboarding status, and actionable tasks.

## Route

`/dashboard`

## Roles

Visible only to candidate/worker users (the page conditionally renders `CandidateView` when `isCandidateView` is true; otherwise the employer dashboard is shown).

## Features

- Active engagement summary via the **Offers Widget**
- Pending tasks and actions via the **Tasks Widget** (feature-flagged with `useTasksWidget`)
- Onboarding document checklist via the **Onboarding Widget** (feature-flagged with `showOnboardingDocumentsWidget`)
- Congratulation modal on first login after key milestones

## Layout

The dashboard renders up to three side-by-side widgets in a flex-wrap layout:

1. **Offers Widget** (`CandidateOfferWidgetV2`) — always shown
2. **Onboarding Widget** — shown when `showOnboardingDocumentsWidget` is enabled and the worker has outstanding onboarding documents (`$showOnboardingDocuments` is true)
3. **Tasks Widget** — shown when `useTasksWidget` is enabled

### Offers Widget

Displays all current candidate offers (excluding HR-only offers) with the following details per offer card:

- **Entity name** (with profile picture initials)
- **Job title**
- **Country flag**
- **Worker type tag** (Employee or Contractor)
- **Status corner** indicating the engagement stage (e.g. offer pending, agreement signing, active)
- **Status text** — derived from `EorStatus`, with a special `CandidateIdRequired` message for offline-imported workers whose identity is not yet verified

Clicking an offer card navigates to the candidate offer flow:
- Contractors navigate to `/contractor-candidate-offer/:id/main-terms`
- Employees navigate to `/candidate-offer/:id/main-terms`

The widget displays the offer count in the header (e.g. "Engagements (3)"). If there are no offers, a "no offers" message is shown.

The widget subscribes to WebSocket updates via `CandidateOfferUpdatesToken` so new or changed offers appear in real time without a page refresh.

### Tasks Widget

Displays a list of actionable tasks fetched from the task list API. Each task card shows:

- A coloured icon representing the task type
- A title and description with an optional action link
- A three-dot menu with **Pin** / **Unpin** and **Hide** actions

Tasks are sorted with pinned tasks first, then by most recent timestamp. Task types include identity verification (`CompleteIdVerification`), additional nationality requests (`ProvideAdditionalNationality`), right-to-work actions, and work permit statuses. Actioning a task either opens the iDenfy identity verification flow or navigates to the relevant offer page.

The widget subscribes to WebSocket updates via `TaskListToken` so the task list refreshes automatically when tasks change.

### Onboarding Widget

Shown conditionally when the tenant has onboarding documents enabled. Displays a checklist of required onboarding documents the worker must upload or sign.
