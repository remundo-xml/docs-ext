# Manage Teams

Team management interface for creating teams, assigning workers, and configuring team administrators. Displayed as a tab within Company Settings.

## Route

`/organisations/:organisationId/company-settings/manage-teams`

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Version Router

The page renders either V1 or V2 based on the `useNewTeamsPage` feature flag. This documentation covers V1 (the default).

## Layout

Rendered inside the Company Settings tab container (tab index 3, "Manage Teams"). Contains:

1. Title and description header
2. Unassigned Users section (hidden for TeamAdmin)
3. Create Team section (hidden for TeamAdmin)
4. Teams list

## Unassigned Users

- Lists workers (EOR instances) that are not assigned to any team and whose contracts have not ended.
- Workers can be dragged or assigned to existing teams.
- Refreshing reassigns the unassigned list when team membership changes.

## Create Team

- Available to CompanyAdmin, CompanyOwner, and TenantAdmin only.
- Team name and colour picker input.
- Team admins and pending team admins can be assigned at creation time.

## Teams List

- Displays all teams as cards.
- Each team card shows team name, colour, assigned members, and admins.
- TeamAdmin users see a read-only view of teams (cannot edit, create, or reassign).
- CompanyAdmin and above can edit team membership, assign/remove admins, and rename teams.

## Data Loading

On initialisation, a single `getTeamsPage` API call returns:

- Teams (converted from internalised format)
- Organisation details (with manager sets)
- Users categorised as seniors, team admins, and pending team admins
- All members (EOR instances), partitioned into assigned and unassigned

Users are sorted with CompanyOwner appearing first.

## Behavior notes

- On initialisation failure, the user is redirected to `/pages-404`.
- Team membership changes trigger a refresh of the teams list.
- Pending team admins (invited but not yet accepted) are tracked separately from active admins.
