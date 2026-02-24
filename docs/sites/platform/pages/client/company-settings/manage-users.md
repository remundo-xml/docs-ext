# Manage Users

User management interface for inviting new users, assigning roles, and administering existing organisation members. Supports filtering by billing entity and searching by name. Has two versions controlled by a feature flag.

## Route

`/organisations/:organisationId/company-settings/manage-users`

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

TeamAdmin users can access this page but with reduced permissions: they can only invite other TeamAdmin users and cannot change roles of existing users.

## Version Router

The page entry point (`ManageUsers/Index.svelte`) renders either V1 or V2 based on the `useManageUsersV2` feature flag.

- `useManageUsersV2 = false` -- Renders `ManageUsers/V1/Index.svelte` (default)
- `useManageUsersV2 = true` -- Renders `ManageUsers/V2/Index.svelte`

Both versions receive the `params` object containing `organisationId`.

---

## V1 Layout

Rendered inside the Company Settings tab container (tab index 2, "Manage Users") using the vertical sidebar tab layout. Contains three sections laid out horizontally with flex-wrap:

1. **Invite New Users** (left, 30rem wide)
2. **Pending Users** (centre)
3. **Existing Users** (right)

### Billing Entity Filter

A dropdown at the top allows filtering users by billing entity:

- Default selection: "All Billing Entities"
- CompanyOwner sees all billing entities
- CompanyAdmin associated with the home organisation sees all billing entities
- Other roles see only their associated entities (derived from `$user.remundoIdentity.associatedEntities`)
- A search `InputGroup` beside the dropdown filters the displayed users by name

### Invite Form (V1)

The V1 invite form (`ManageUsers/V1/InviteForm.svelte`) is displayed inline when the "Invite" button is clicked. The form is rendered within the invitation section.

### Pending Users (V1)

Lists users who have been invited but have not yet accepted. Filtered by the selected billing entity and search query.

- Each pending user card shows invitation details.
- Invitations can be voided (removed).
- TeamAdmin users cannot void invitations (disabled state).

### Existing Users (V1)

Lists active organisation members. Filtered by the selected billing entity and search query.

- Role changes dispatch `AddRole` and (if necessary) `RemoveRole` commands with polling until confirmed.
- When changing from CompanyAdmin to TeamAdmin (or vice versa), the old role is removed first via `removeRoleIfNecessary`.
- Associated entities can be changed per user; dispatches `addAssociatedEntities` with polling until confirmed.
- TeamAdmin users cannot change roles or associated entities (disabled state).

---

## V2 Layout

Rendered with a page header (`PageHeader`) above the tab container, then uses the horizontal tab layout (`useHorizontalTabs`). Contains:

1. **Page Header** -- Title and description
2. **Invitation Filter** (`InvitationFilter`) -- billing entity dropdown and search input
3. **Invite Form** (V2, `ManageUsers/Components/InviteForm.svelte`) -- collapsible invite card
4. **Card View** -- Two accordion sections for pending and accepted users

### Invitation Filter (V2)

The `InvitationFilter` component provides:

- A billing entity dropdown with an "All Billing Entities" default option
- A search input bound to `searchQuery`
- Events: `all-billing-entities-selected`, `entity-selected-from-dropdown`

### Card View (V2)

The `CardView` component (`ManageUsers/V2/CardView/Index.svelte`) splits users into two `InvitationAccordion` sections:

- **Pending** -- Invitations where `isPending` is true, mapped to `UserCard` objects showing email, role, job title, associated entities, and status text.
- **Accepted** -- Active users mapped to `UserCard` objects showing display name, email, role, job title, associated entities, and "Accepted" status.

Filtering logic:
- Invitations filtered by `selectedEntity` (associated entities include the entity ID) and `searchQuery` (case-insensitive match on invitee email).
- Users filtered by `selectedEntity` (exact match: user has exactly one associated entity matching the selection) and `searchQuery` (case-insensitive match on display name or email).
- Accepted users are sorted with CompanyOwner, TenantAdmin, and TenantContributor roles appearing first.

Each card provides action icons dispatching events:
- `edit-invitation-icon-click` / `edit-user-icon-click` -- Opens the `EditInvitationModal` or `EditUserModal`.
- `delete-invitation-icon-click` / `delete-user-icon-click` -- Opens the `DeleteInvitationModal` or `DeleteUserModal`.
- `resend-invitation-icon-click` -- Opens the `ResendInvitationModal`.

A table view placeholder exists (`$manageUsersListViewSelected` store) but is not yet implemented in V2 (commented out as `<!-- <TableView /> -->`).

---

## Invite Form (Shared, V2 Component)

The V2 invite form (`ManageUsers/Components/InviteForm.svelte`) is used by both V2 and the expanded details view. It is a collapsible card with the following fields:

- **Email** (required; valid email format; must not already exist in the organisation via `doesEmailExistInOrganisation`; forced lowercase on input; allowed characters: `a-zA-Z0-9@\-\s'.`; duplicate and invalid email errors shown contextually)
- **Job Title** (required; max 50 characters; allowed characters: `a-zA-Z'\- `)
- **Role** (required; dropdown via `RoleSelector`)
  - CompanyAdmin and above can select: CompanyAdmin, TeamAdmin
  - TeamAdmin can only select: TeamAdmin
- **Team** (conditional; shown only when TeamAdmin role is selected; multi-select via `TeamSelector`; toggle individual teams on/off)
- **Create Team inline** (available within team selector via `TeamNameAndColourField`; team name + colour picker; team name max 30 characters; adds team via `createTeamAndAddToStore`)
- **Billing Entity** (required; at least one must be selected via `BillingEntitySelector`; auto-selected if only one entity exists)

Each field has an `InfoTip` tooltip icon with contextual help text.

The **Invite** button is disabled until:
- Email is valid and not a duplicate
- Job title is within range (0-50 characters)
- No inline team creation is in progress (`addingTeam` is false)
- Palette is not open (`showPallete` is false)
- Team name is under 30 characters
- At least one billing entity is selected

### Submission Process

1. A new UUID is generated for the invitation ID.
2. If teams are selected, `addPendingAdminsToTeamAndAddToStore` is called for each selected team.
3. Polls via `pollingGetCondition` on `getTeams` until all selected teams include the invitation ID in their `pendingAdmins`.
4. The invitation is sent via `sendInvitationAndUpdateStore`.
5. Invitation expiry is set to `inviteExpiryTime` minutes from now (via `addMinutes`).
6. Form fields are reset after successful submission.
7. An `invite-added` event is dispatched with the invitation object.

## Data Loading

- On initialisation, a single `getManageUsersPage` API call returns users, teams, and invitations.
- Teams are processed to convert `pendingAdmins`, `admins`, and `members` to `Set` objects.
- Users, teams, and invitations are loaded into their respective stores (`usersStore`, `teamsStore`, `invitationsStore`).

## Behavior notes

- On initialisation failure, the user is redirected to `/pages-404`.
- All polling uses `pollingGetCondition` for eventual consistency.
- The TeamAdmin disabled state is determined by `pickPrincipalRole` at component initialisation.
- V2 modals (Edit, Delete, Resend) are rendered conditionally at the page level and receive the selected invitation or user as a prop.
