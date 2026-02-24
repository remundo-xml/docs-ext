# Manage Teams

Team management interface for creating teams, assigning workers, and configuring team administrators. Displayed as a tab within Company Settings.

## Route

`/organisations/:organisationId/company-settings/manage-teams`

## Roles

CompanyAdmin, CompanyOwner, TeamAdmin, TenantAdmin

## Version Router

The page entry point (`OrganisationStructure/VersionRouter.svelte`) renders either V1 or V2 based on the `useNewTeamsPage` feature flag.

- `useNewTeamsPage = false` -- Renders `OrganisationStructure/Index.svelte` (V1, default)
- `useNewTeamsPage = true` -- Renders `OrganisationStructure/V2/Index.svelte` (V2)

Both versions receive the `params` object containing `organisationId`.

---

## V1 Layout

Rendered inside the Company Settings tab container (tab index 3, "Manage Teams"). Contains:

1. **Title and description header** -- i18n keys `organisation.structure.title` and `organisation.structure.desc`
2. **Unassigned Users section** (hidden for TeamAdmin)
3. **Create Team section** (hidden for TeamAdmin)
4. **Teams list**

### Unassigned Users (V1)

Rendered by the `UnassignedUsers` component.

- Lists workers (EOR instances) that are not assigned to any team and whose contracts have not ended (`isContractEnded` is false).
- Workers can be assigned to existing teams via the `UnassignedUsersDropdown`.
- Reassigning triggers a refresh event that updates the teams list.

### Create Team (V1)

Rendered by the `CreateTeam` component.

- Available to CompanyAdmin, CompanyOwner, and TenantAdmin only (hidden for TeamAdmin via `lineManagerView`).
- Inputs: team name and colour picker (via `TeamNameAndColourField`).
- Team admins and pending team admins can be assigned at creation time.

### Teams List (V1)

Rendered by the `Teams` component.

- Displays all teams from the `teamsStore`.
- The `readonly` prop is set to `true` for TeamAdmin users, preventing edits.
- Each team card (`TeamCard`) shows team name, colour, assigned members, and admins.
- CompanyAdmin and above can edit team membership, assign/remove admins, and rename teams.

---

## V2 Layout

Rendered inside the Company Settings tab container (tab index 3, "Manage Teams"). Contains:

1. **Title and description header** -- Same i18n keys as V1
2. **Unassigned Users section** (hidden for TeamAdmin)
3. **Create Team section** (hidden for TeamAdmin)
4. **Teams list** with `TeamCard` components rendered in a flex-wrap container

### Unassigned Users (V2)

Rendered by `OrganisationStructure/V2/UnassignedUsers.svelte`.

- Lists workers from `teamsPage.unassignedWorkers`.
- Workers can be added to teams, dispatching `add-members-to-team` or `add-members-to-pending-team` events.
- Adding to a pending team triggers a confirmation modal.

### Create Team (V2)

Rendered by `OrganisationStructure/V2/CreateTeam.svelte`.

- Available when `lineManagerView` is false.
- Binds to the `teamsPage` object to update the teams list reactively.

### Teams List (V2)

Iterates over `Object.values(teamsPage.teams)`, rendering a `V2/TeamCard` for each.

Each `TeamCard` receives:
- `team` -- The team object
- `lineManagerView` -- Read-only flag for TeamAdmin users
- `companyAdmins` -- Available company admins from `teamsPage.companyAdmins`
- `lineManagers` -- Available line managers from `teamsPage.lineManagers`
- `workersNotInTeam` -- A collated map of all workers not in the current team (including workers from other teams, annotated with their team name)
- `otherTeams` -- A map of other team IDs to names for move-to-team functionality

Team card actions dispatch events handled via a `ConfirmationModal`:
- `delete-team` -- Deletes the team via `deleteTeam` helper, updates `teamsPage`
- `remove-members` -- Removes members from the team via `removeMembersFromTeam` helper
- `add-members-to-team` -- Adds members via `addMembersToTeam` helper
- `move-members-to-team` -- Moves members from one team to another (add with `previousTeamId`)

The confirmation modal shows localised content from `organisation.structure.confirmation-modals.*` including member names and team name.

## Data Loading

### V1

On initialisation, a single `getTeamsPage` API call returns:

- Teams (converted from internalised format via `convertTeamsInternalisedToTeam`)
- Organisation details (with `managers` converted to a `Set`)
- Users categorised as `seniors`, `teamAdmins`, and `pendingTeamAdmins`
- All members (EOR instances), partitioned into assigned (in a team) and unassigned (not in any team, contract not ended)

Users are sorted with CompanyOwner appearing first. All data is loaded into stores (`teamsStore`, `organisation`, `seniors`, `teamAdmins`, `pendingTeamAdmins`, `usersStore`, `unassigned`, `assigned`, `invitationsStore`).

### V2

On initialisation, a single `getTeamsPageV2` API call returns a `TeamsPageV2` object containing:

- `teams` -- Record of team ID to team objects, each with `workers`, `name`, `id`
- `unassignedWorkers` -- Record of EOR ID to `MinimalUserDetails`
- `companyAdmins` -- Available company admins
- `lineManagers` -- Available line managers

The `teamsPage` object is bound reactively, so all mutations (add, remove, delete, move) update the UI automatically.

## Behavior notes

- On initialisation failure: V1 redirects to `/pages-404`; V2 displays an inline error message.
- Team membership changes trigger a refresh of the teams list.
- Pending team admins (invited but not yet accepted) are tracked separately from active admins.
- The `lineManagerView` flag is determined by `pickPrincipalRole($user.remundoIdentity!) == Role.TeamAdmin`.
- V2 uses a `ConfirmationModal` component with a `polling` state to prevent double-actions while an operation is in progress.
