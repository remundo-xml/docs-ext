# Employee Work Offer

Read-only viewer for a worker's signed work order document.

## Route

`/organisations/:orgId/workers/:id/employee-work-offer`

## Layout

### Close Button

A close button in the top-right corner navigates back to `/organisations/:orgId/workers/:id/engagements`.

### Work Order Viewer

Rendered via the `WorkOrderViewer` shared component. Displays the signed work order for the EOR instance. The `isSigned` flag is set to `true`, indicating the document has been signed and should be displayed in its final form.

## Data Loading

On initialisation, fetches the EOR instance via `getEorInstance` using the worker's ID from the route parameters.

## Behavior notes

- A spinner is shown while the EOR instance is loading.
- The component receives `orgId` and `id` from the route parameters.
