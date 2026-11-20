Status: COMPLETE
Goal / Definition of done:
1. Fix Flappy Cubie viewport and visibility so the user can see the whole game at once:
   - Make `#canvas-flappy` fully responsive (`max-width: 100%; height: auto; max-height: min(420px, 48vh); aspect-ratio: 640 / 420; object-fit: contain;`) so it never overflows horizontally or vertically.
   - Reorganize controls to top bar right above canvas (`btn-flappy-start`, `btn-flappy-survive`, `btn-flappy-pause`) matching Cube Runner 3D so primary buttons are always visible without scrolling.
   - Add idle/start screen rendering (`renderFlappyIdle()`) with flying 3D cubie preview so the canvas is never a blank box.
   - Render game-over stats and interactive golden Survive button overlay directly on the canvas with click hit-detection.
   - Reduce vertical footprint so the entire Flappy Cubie game fits inside standard viewports without clipping.
2. Verified live in Chrome DevTools MCP across desktop and responsive screen sizes with 0 errors.
3. Committed and pushed changes to GitHub remote `origin/main`.

Next step: Done.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Add responsive styles for `#canvas-flappy` and `.flappy-canvas-wrap`
- [x] Move primary controls to `.flappy-top-bar` above the canvas
- [x] Implement `renderFlappyIdle()` for immediate visual presentation on tab switch and load
- [x] Render interactive game-over canvas overlay with on-canvas Survive button and click hit-testing
- [x] Add smooth scroll into view on `switchGame('flappy')`
- [x] Verify live in Chrome DevTools MCP
- [x] Commit and push to origin main

Assumptions:
- "i cant see the whole thing" means the game was clipped/overflowing the viewport (bottom buttons cut off below the fold, unconstrained 640px width on narrow screens, and blank canvas when idle).

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Pushed changes to GitHub origin main.
- Verified live responsiveness, idle rendering, and survive button in Chrome DevTools MCP.
- Implemented responsive canvas, top control bar, idle state, and on-canvas game-over survive button.
- Initialized Flappy Cubie visibility and layout fix.
