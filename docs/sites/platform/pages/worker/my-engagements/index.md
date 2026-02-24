# My Engagements

View and manage employment and contractor engagements.

## Route

`/my-engagements`

## Sub-routes

- `/my-engagements/:id/details` -- engagement details
- `/my-engagements/:id/agreement/employee` -- employee employment agreement PDF
- `/my-engagements/:id/agreement/contractor` -- contractor assignment sheet PDF
- `/services-agreements/:scheduleType/:contractorType/:version` -- contractor services agreement PDF (linked from timeline)

## Layout

The page displays a title heading and two main sections: the engagement carousel (`EngagementHeader`) and the engagement timeline (`EngagementTimeline`). The currently selected offer ID is passed from the header to the timeline.

## Engagement list

Engagements are fetched via `getCandidateOffers` on mount and displayed as a horizontal carousel of cards. The first engagement is auto-selected on load and its ID is dispatched via the `offer-selected` event.

### Carousel navigation

The carousel is responsive:

- Desktop: cards are 20rem wide with 4rem gaps
- Mobile (at or below 600px): cards are 15rem wide with 1rem gaps, all text scaled to 0.8rem
- The number of visible cards is calculated from the container width using `Math.floor((containerWidth + gapWidthPx) / (cardWidthPx + gapWidthPx))`
- Left/right chevron buttons allow scrolling through cards when the list exceeds the visible area

### Engagement card

Each card shows:

- Company name with profile picture (single initial via `ProfilePicture` with `maxNumberOfInitials={1}`)
- Job title
- Country flag (lowercase ISO code)
- Worker contract type badge via `WorkerTypeTag` (Employee, Contractor, or Individual Contractor)
- Status corner (color-coded by EorStatus via `getStatusCornerCandidate`)
- Status text (only shown when status is not `JoiningDocumentsVerified`; translated with agreement type interpolation -- "contractor" or "employee")

The currently selected card has a primary-color border. Ended contracts appear greyed out (grey background, grey text, 60% grayscale filter, pointer events disabled). Clicking an active card selects it and loads its timeline below.

## Engagement timeline

Below the carousel, the selected engagement shows a status timeline via the Timeline component. Each timeline item includes a timestamp, status text, status color, the signed-by user, and contextual hyperlinks.

The links shown depend on the current EorStatus:

- `Pending`, `Required`, `ClearancePending`, `EorcSigned`, `CandidateSignPending`:
  - Offer Terms only
- `CandidateSigned`, `JoiningDocumentsFailed`, `JoiningDocumentsApprovalPending`:
  - Offer Terms
  - Employment Agreement (for employees) or Service Agreement (for contractors)
  - Assignment Sheet (for contractors only)
- `JoiningDocumentsVerified`:
  - Offer Terms
  - Employment Agreement or Service Agreement
  - Engagement Details
  - Assignment Sheet (for contractors only)
- HR-only engagements: Engagement Details link only

### Offer terms link

Navigates to either `/contractor-candidate-offer/:id/main-terms` or `/candidate-offer/:id/main-terms` depending on the worker contract type.

### Agreement link

For employees: `/my-engagements/:id/agreement/employee`
For contractors: `/services-agreements/:scheduleType/:contractorType/:version` where:
- scheduleType is "ad-hoc" for "On Demand" schedule types, otherwise "standard"
- contractorType is "individual" for individual contractors, otherwise "company"
- version is the agreement version from the engagement

### Engagement statuses

Pending, Required, ClearancePending, EorcSigned, CandidateSignPending, CandidateSigned, JoiningDocumentsApprovalPending, JoiningDocumentsFailed, JoiningDocumentsVerified, Ended, Archived, and others.
