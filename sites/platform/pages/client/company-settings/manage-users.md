# Manage Users

User management interface for inviting new users, assigning roles, and administering existing organisation members. Supports filtering by billing entity and searching by name. Has two versions controlled by a feature flag.

## Route

`/organisations/:organisationId/company-settings/manage-users`

## Roles

CompanyAdmin, CompanyOwner, TenantAdmin

TeamAdmin users can access this page but with reduced permissions: they can only invite other TeamAdmin users and cannot change roles of existing users.

## Version Router

The page renders either V1 or V2 based on the `useManageUsersV2` feature flag. This documentation covers V1 (the default).

## Layout

The page is rendered inside the Company Settings tab container (tab index 2, "Manage Users"). It contains three sections laid out horizontally:

1. Invite New Users (left)
2. Pending Users (centre)
3. Existing Users (right)

## Billing Entity Filter

A dropdown at the top allows filtering users by billing entity:

- Default selection: "All Billing Entities"
- CompanyOwner sees all billing entities
- CompanyAdmin associated with the home organisation sees all billing entities
- Other roles see only their associated entities
- A search input beside the dropdown filters the displayed users

## Invite Form

Displayed when the "Invite" button is clicked. Fields:

- Email (required; valid email format; must not already exist in the organisation; forced lowercase; allowed characters: `a-zA-Z0-9@\-\s'.`)
- Job Title (required; max 50 characters; allowed characters: `a-zA-Z'\- `)
- Role (required; dropdown)
  - CompanyAdmin and above can select: CompanyAdmin, TeamAdmin
  - TeamAdmin can only select: TeamAdmin
- Team (conditional; shown only when TeamAdmin role is selected; multi-select; toggle individual teams on/off)
- Create Team inline (available within team selector; name + colour picker; team name max 30 characters)
- Billing Entity (required; at least one must be selected; auto-selected if only one entity exists)

The Invite button is disabled until:
- Email is valid and not a duplicate
- Job title is within range (0-50 characters)
- No inline team creation is in progress
- Team name is under 30 characters
- At least one billing entity is selected

### Submission Process

1. If teams are selected, `addPendingAdminsToTeam` is called for each team and polled until confirmed.
2. The invitation is sent via `sendInvitationAndUpdateStore`.
3. Invitation expiry is set to `inviteExpiryTime` minutes from now.
4. Form fields are reset after successful submission.

## Pending Users

Lists users who have been invited but have not yet accepted. Filtered by the selected billing entity and search query.

- Each pending user card shows invitation details.
- Invitations can be voided (removed).
- TeamAdmin users cannot void invitations (disabled state).

## Existing Users

Lists active organisation members. Filtered by the selected billing entity and search query.

- Role changes dispatch `AddRole` and (if necessary) `RemoveRole` commands with polling until confirmed.
- When changing from CompanyAdmin to TeamAdmin (or vice versa), the old role is removed first.
- Associated entities can be changed per user; dispatches `addAssociatedEntities` with polling until confirmed.
- TeamAdmin users cannot change roles or associated entities (disabled state).

## Behavior notes

- On initialisation failure, the user is redirected to `/pages-404`.
- The page fetches users, teams, and invitations in a single `getManageUsersPage` API call.
- All polling uses `pollingGetCondition` for eventual consistency.
