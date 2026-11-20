Status: COMPLETE
Goal / Definition of done:
1. Remove all on-screen HUD buttons/overlays from inside the game canvas container so controls do not block the game view.
2. Relocate all controls cleanly outside the game canvas:
   - Compact top bar docked immediately above the screen picture: Dash Again best!, Sudden Speed Dash, Survive, Pause, and Auto-Survive.
   - Ultra-slim arcade control deck docked immediately below the screen picture: Dash Again best!, Steer Left, Steer Right, Sudden Speed Dash, Jump, Slide, Shoot, Survive, and Auto-Survive.
3. Ensure controls remain snug against the screen borders (3px gap) and compact (38px height) without covering any gameplay pixels.
4. Verify live in Chrome DevTools MCP: containerChildrenCount = 1 (canvas only), topBarOutsideCanvas = true, deckOutsideCanvas = true, 0 console errors, interactive controls verified.
5. Push changes to origin/main.

Next step: Done.

Tasks:
- [x] Remove .runner-hud-top, .runner-hud-bottom-left, and .runner-hud-bottom-right from inside .runner-canvas-container
- [x] Style and place .runner-top-bar immediately above the canvas (outside)
- [x] Dock .arcade-control-deck.runner-slim-deck immediately below the canvas (outside)
- [x] Maintain all button IDs and interactivity (btn-runner-start, btn-deck-start, btn-side-dash, btn-deck-dash, pause, survive, auto-survive)
- [x] Verify live layout and button interactivity in Chrome DevTools MCP (0 console errors)
- [x] Commit and push changes to origin/main

Assumptions:
- "the contrals are inside the game and that blocks the game" refers to the on-screen overlay HUD controls covering the 3D highway, oncoming obstacles, monsters, and laser bullets on the canvas.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified external controls layout, button interactivity, and 0 console errors in Chrome DevTools MCP.
- Moved all Cube Runner controls outside the canvas to sleek docked top and bottom bars.
- Initialized task to remove controls blocking the game view.
