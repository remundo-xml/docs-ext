# Documentation

In-app user documentation for the Remundo Platform, covering both candidate and employer features.

## Route

`/documentation`

## Features

- Single-page documentation with a fixed sidebar navigation and a scrollable content area
- Sidebar highlights the currently visible section as the user scrolls
- Clicking a sidebar item smooth-scrolls to the corresponding section and updates the URL hash
- Supports deep linking via URL hash (e.g., `/documentation#candidate-timesheets`)
- Sets the browser tab title to "Remundo Documentation"
- Responsive layout: sidebar collapses to a top bar on mobile viewports (below 768px)

## Layout

The page is split into two areas:

- **Sidebar** (fixed, 280px wide) -- contains a hierarchical navigation grouped into four sections
- **Content** (scrollable main area) -- contains all documentation sections rendered as a continuous page

## Sections

### Getting Started

- **Overview** -- introduces the platform, the Employer of Record (EOR) model, and the two primary audiences (candidates/workers and employers)
- **Navigating the Platform** -- explains the vertical sidebar navigation and how menu items change based on role and engagement status
- **Roles** -- describes the four user roles: Candidate, Company Owner, Company Admin, and Team Admin
- **Languages** -- lists supported languages (English, Spanish, French, Arabic, Chinese) and explains how to switch language

### Candidate Features

- **Dashboard** -- engagement offers, onboarding progress, tasks, and milestones
- **Onboarding** -- document uploads, electronic signing, progress tracking
- **My Details** -- profile, bank details, emergency contact, service companies, and calendar tabs
- **My Engagements** -- current and historical engagement list with timeline and agreement viewing
- **My Documents** -- central document repository with filtering, preview, and download
- **Timesheets** -- hour logging, submission, history, and automated entries
- **Absences** -- leave requests, half-day support, entitlement tracking
- **Expenses** -- expense creation, receipt upload, draft saving, multi-currency support
- **Invoices** -- contractor invoice generation and payment tracking
- **Payslips** -- monthly payslip viewing and annual tax document downloads

### Employer Features

- **Dashboard** -- organisation statistics, time-off summary, billing entity selector
- **Create Engagement** -- step-by-step wizard for employee or contractor engagements
- **Engagements** -- search, filter, list/grid views, archive management, bulk actions
- **Workers** -- workforce management with team filtering and worker detail tabs
- **Invoices** -- financial overview with active/paid invoice management
- **Pending Approvals** -- review and action holiday, sick leave, expense, and timesheet requests
- **Company Settings** -- details, manage users, manage teams, workers availability, general settings tabs

### Account and Support

- **User Settings** -- account preferences and communication preferences
- **Support** -- in-app support modal and contact information

## Behavior notes

- An `IntersectionObserver` tracks which section is currently in view and updates both the sidebar highlight and the URL hash.
- The observer uses a threshold of 50% visibility and a root margin that prioritises sections near the top of the viewport.
- All content is internationalised via `svelte-i18n` translation keys under the `documentation.*` namespace.
