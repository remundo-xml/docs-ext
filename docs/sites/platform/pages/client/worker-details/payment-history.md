# Payment History

Worker payment history tab (not yet implemented).

## Route

`/organisations/:orgId/workers/:id/payment-history`

## Status

This tab is permanently disabled in the tab bar. No component is loaded when this route is accessed; the user is redirected to the default `details` tab.

## Behavior notes

- The tab appears in the tab bar with the `bi-wallet2` icon but cannot be selected.
- If the route is navigated to directly, the `getTab` function in `Index.svelte` finds the tab disabled and redirects to `/organisations/:orgId/workers/:id/details` (preserving any query string).
