# Tutorial Videos

Platform tutorial and help videos accessible via direct link.

## Route

`/tutorial-videos/:videoId`

- `:videoId` -- identifier for the specific tutorial video to display (maps to a `RemundoTutorialTypes` value)

## Features

- Requires authentication; redirects to `/access-restricted?redirect=<current-path>` if the user is not logged in or logs out while viewing
- Fetches a time-limited video access token from the API via `getTenantTutorialVideoToken`
- Constructs a signed video URL using `getTenantTutorialVideoUrl` with the token
- Displays the video in a full-viewport HTML5 `<video>` player with:
  - Autoplay and muted by default
  - Playback controls visible
  - Download disabled (`controlslist="nodownload"`)
  - Right-click context menu disabled to prevent direct video saving
  - Responsive sizing that adapts to the viewport
- Shows a localised video title above the player, derived from translation keys under `remundo-tutorials.videos.<videoId>`
- Displays a "no videos" message if the video URL cannot be loaded
- Shows an error notification if the token fetch fails
- Rendered outside the main application layout with a Remundo logo header

## Behavior notes

- The component subscribes to the user store and monitors authentication state. If the user is logged out during viewing, they are immediately redirected to the access-restricted page.
- The video URL is token-protected and time-limited, so it cannot be bookmarked or shared directly.
- On mobile viewports (below 600px), the video title font size is reduced.
