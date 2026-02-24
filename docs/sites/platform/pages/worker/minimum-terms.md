# Minimum Terms

Review and confirm employment or contractor minimum terms.

## Routes

- `/candidate-offer/:id/main-terms` - Employee minimum terms
- `/contractor-candidate-offer/:id/main-terms` - Contractor minimum terms

## Overview

The minimum terms page presents the full offer details for an engagement and allows the candidate to review, comment on, and accept or return the offer. The page adapts its content based on whether the worker is an employee or contractor, and transitions between three phases: offer review, identity verification, and agreement signing.

## Page phases

### Phase 1: Offer review (status below `CandidateSignPending`)

Displays the full offer in a centered `Tile` container with a status corner tag. The tile includes:

#### Employee sections
- **Work Offer Header** -- current step indicator ("My Offer")
- **Candidate Details** -- name, email, nationality confirmation, phone confirmation, work permit status; editing is disabled once status is beyond `Pending`
- **Job Details** -- employment terms and conditions
- **Employment Incentives** (conditional) -- signing bonus, vesting bonus, variable compensation, signing bonus one-off/vesting data amounts
- **Insurance and Health Benefits** (conditional) -- medical, dental, death insurance
- **Benefits** (conditional) -- allowances
- **Additional Comments** -- footer section for offer comments

#### Contractor sections
- **Work Offer Header** -- current step indicator ("My Offer")
- **Candidate Details** -- same as employee plus service company selection (with `isContractor` flag and `serviceCompanyDisabled` when read-only)
- **Role Details** -- contractor-specific role information
- **Contractor Incentives** (conditional) -- same financial incentives as employee
- **Insurance and Health Benefits** (conditional)
- **Allowances** (conditional)
- **Additional Comments**

The incentives/benefits section is only shown when at least one incentive, insurance, or allowance exists.

#### Identity check
Once nationality is confirmed by the candidate, an `IdentityCheck` component appears, showing the Idenfy verification status.

#### Offer action buttons
Two buttons at the bottom of the offer:
- **Return** -- return the offer with comments; disabled when nationality or phone is not confirmed, or when polling
- **Accept** -- accept the offer; disabled when phone is not confirmed, nationality is not confirmed, the worker is not eligible to work in the country (employee only), polling is active, or unresolved comments exist

### Phase 2: Identity verification (status is `CandidateSignPending`)

Shown when identity verification is not complete or pre-contract onboarding is incomplete. Displays the `IdentityVerification` component with the appropriate contract type (`Employee` or `Contractor`).

Pre-contract onboarding completion is checked via `getEorPreContractOnboardingComplete`.

### Phase 3: Agreement signing (status is `CandidateSignPending` with verification complete, or `CandidateSigned` and beyond)

Displays the `EmploymentAgreement` component for the candidate to review and sign the employment agreement or assignment sheet. A `candidate-contract-signed` event triggers polling to confirm the signature.

## Tutorial

When the `showTutorial` setting is enabled and the user has not viewed the `CandidateMinimumTermsV1` tutorial, a `TutorialModal` is shown with four pages explaining the offer review process.

## Comments

Comments are fetched via the comments API and stored in `commentStore`. They are sorted by section. The page supports:
- Viewing existing comments inline
- Adding new comments (triggers a "commented" polling flow)
- Read-only mode for contractors when `readOnlyContract()` returns true

## Real-time updates

A WebSocket connection subscribes to `MinimumTermsToken` scoped to the engagement ID. On `agreement-signed` events:
1. Polling confirms the engagement status has reached `CandidateSigned`
2. The agreement document is fetched via `Documenting.getAgreement`
3. The page reloads

## Polling behavior

The page subscribes to the `latestAppliesStore`. When a new `applies` timestamp is set:
- A "updating" notification is shown
- For comments: polls until the comment with the matching timestamp appears
- For other changes: polls until the EOR instance's `applies` matches
- On success: the appropriate notification is shown and the store is updated
- For "accept": the modal is opened and the user is navigated home

## Employee vs contractor differences

| Feature | Employee | Contractor |
|---|---|---|
| Section component | `JobDetails` | `RoleDetails` |
| Incentives component | `EmploymentIncentives` | `ContractorIncentives` |
| Benefits component | `Benefit` | `Allowances` |
| Service company selection | Not shown | Shown |
| Work eligibility check | Verified against `eligibleNationalitiesIsoCodes` + additional nationalities | Always eligible |
| Job constraints API | `getJobConstraintsByCountryAndOrganisationId` | `getContractorJobConstraintsByCountryAndOrganisationId` |
| Read-only mode | Based on status | Based on `readOnlyContract()` |

## Preview mode

Both employee and contractor pages accept a `previewMode` prop. In preview mode:
- No tutorial is shown
- No action buttons are rendered
- Candidate details editing is disabled
- The tile container and status corner are not used
- Comments are loaded from the store instead of the API
