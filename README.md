# Remundo External Documentation

Public documentation for the Remundo platform.

## Structure

```
docs-ext/
└── sites/
    ├── admin/          # Admin site documentation
    ├── platform/       # Main platform documentation
    │   └── pages/
    │       ├── client/   # Client/employer view pages
    │       ├── worker/   # Worker/candidate view pages
    │       └── common/   # Shared pages (auth, errors, etc.)
    └── tenant/         # Tenant-specific documentation
```

## Page Types

Pages are organised by view type:

- `client` - Pages for organisation administrators and employers
- `worker` - Pages for employees and contractors
- `common` - Pages shared across all user types (authentication, errors, settings)

View type is optional. Pages that don't fit a specific view type should go in `common/`.

## Page Format

Each page document follows this structure:

```markdown
# Page Title

Brief description of the page purpose.

## Route

`/path/to/page`

## Features

- Feature one
- Feature two
- Sub-route at `/path/to/sub-route`
```
