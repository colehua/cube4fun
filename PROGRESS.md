Status: COMPLETE
Goal / Definition of done:
1. "Dash Again" Button Placed Right on Top of the Game:
   - Moved the primary action controls bar (`#btn-runner-start`, `#btn-runner-revive`, `#btn-runner-pause`) directly above `canvas-runner`.
   - On game over, `#btn-runner-start` switches to `▶ Dash Again [Space]` with pulsating neon highlight (`.dash-again-highlight`).
   - Wired canvas click event so clicking or tapping anywhere on the game screen also triggers "Dash Again".
2. Made the Game Bigger:
   - Expanded `canvas-runner` from 680x420 to 880x520 widescreen arcade resolution (+60% larger screen area).
   - Dynamically scaled 3D highway perspective (horizon, road bounds, lanes, player cube, obstacles, sun) to match the larger canvas.
   - Expanded arcade control deck max-width to 880px to align with the larger canvas.
3. Verified live layout, canvas sizing, and click triggers in Chrome DevTools MCP.
4. Changes committed and pushed to GitHub remote `origin/main`.

Next step: Completed.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Move game-controls-row right on top of canvas-runner
- [x] Increase canvas-runner resolution to 880x520
- [x] Update 3D highway perspective math in `draw3DHighway` and collision coordinates to scale with canvas dimensions
- [x] Add `.dash-again-highlight` pulsating animation for `#btn-runner-start`
- [x] Add canvas click listener to dash again on tap
- [x] Verify live in Chrome DevTools MCP
- [x] Commit and push to origin main

Assumptions:
- "Right on top of the game thing" means placing the Dash Again action row directly above the canvas, plus allowing clicks directly on the canvas screen.
- Making the game bigger means expanding the canvas dimensions from 680x420 to 880x520 widescreen with proportional 3D rendering.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Completed live verification in Chrome DevTools MCP and pushed to origin main.
- Repositioned Dash Again controls above canvas, expanded canvas to 880x520 (+60% size), and added canvas tap-to-dash.
