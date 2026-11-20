Status: COMPLETE
Goal / Definition of done:
1. Dock game controls snug against the Cube Runner 3D picture:
   - Relocated `.arcade-control-deck` inside `.runner-screen-wrap` directly touching the bottom bezel of `#canvas-runner` (reduced vertical gap from 127.8px down to 0px).
   - Reduced `.runner-arena` horizontal gap from 18px down to 8px so the side dock sits tightly alongside the right edge of the canvas.
   - Reorganized `.runner-side-dock` so all movement and action controls (`▶ Dash Again`, `⚡ DASH`, `Left`, `Right`, `Jump`, `Slide`, `Shoot`, `Survive`, `Pause`, `Auto`) sit at eye level directly alongside the highway screen.
   - Added `▶ Dash Again` and survive buttons to the bottom control deck for instant access right below the picture.
   - Synchronized auto-survive checkboxes (`#chk-auto-survive` and `#chk-auto-survive-deck`) across both control decks.
2. Verified live in Chrome DevTools MCP: 0px bottom gap, 8px side gap, 0 console errors, interactive button responsiveness.
3. Committed and pushed changes to remote repository `origin/main`.

Next step: Done.

Tasks:
- [x] Restructure CSS for `.runner-screen-wrap` and `.arcade-control-deck` to dock directly against bottom of canvas (0px gap)
- [x] Reduce horizontal gap between canvas and `.runner-side-dock` to 8px
- [x] Reorder side dock controls so all action buttons are adjacent to the highway picture at eye level
- [x] Add Dash Again and survive controls to the bottom arcade deck
- [x] Sync auto-survive checkboxes across both control locations
- [x] Verify live in Chrome DevTools MCP (measure bounding boxes and test button actions)
- [x] Git commit and push changes to origin/main

Assumptions:
- "the contrels of the game is too far away from the picture" refers to Cube Runner 3D's control buttons being separated from the canvas by large vertical (128px) and horizontal gaps; docking the controls flush against the canvas borders solves the distance problem completely.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified 0px gap below canvas and 8px gap beside canvas with zero console errors in Chrome DevTools MCP.
- Docked arcade control deck flush against canvas bottom and reorganized side dock controls adjacent to the picture in games.html.
- Initialized game control proximity fix for Cube Runner 3D.
