# Remundo External Documentation

Public documentation for the Remundo platform, published at [dev.docs.remundo.com](https://dev.docs.remundo.com).

## Structure

All documentation lives under `docs/`. Any markdown added there is automatically included in the site.

```
docs/
├── sites/
│   ├── platform/       # Main platform documentation
│   │   └── pages/
│   │       ├── client/   # Client/employer view pages
│   │       ├── worker/   # Worker/candidate view pages
│   │       └── common/   # Shared pages (auth, errors, etc.)
│   └── tenant/         # Tenant-specific documentation
└── support/            # Support documentation
```

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
```

## Development

```bash
npm install
npm run dev
```

## Raw Markdown

Raw `.md` files are served alongside the HTML site at `/md/{path}`, e.g. `/md/sites/platform/pages/client/dashboard.md`.

An index of all pages is available at [`/llms.txt`](https://dev.docs.remundo.com/llms.txt).
