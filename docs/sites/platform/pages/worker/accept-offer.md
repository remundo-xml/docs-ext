# Accept Offer

Confirmation page shown after an employment offer has been accepted.

## Route

`/accept-offer`

## Overview

A simple landing page that confirms the offer has been accepted. The page displays a translated header and message from `candidateEor.accept-offer.header` and `candidateEor.accept-offer.message`.

## Layout

The page is centered with generous margins (10rem top, 2rem sides, 20rem bottom on desktop; reduced on mobile). On screens at or below 600px, the heading scales to `x-large` and the message to `medium`.

## Features

- Translated header and confirmation message
- A **Home** button (`ButtonPill` with primary background, large size) that navigates to `/` (the dashboard)
- Responsive layout that adjusts margins and font sizes for mobile devices
