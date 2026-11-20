Status: COMPLETE
Goal / Definition of done:
1. Prevent unwanted double-click and double-tap zoom across the arcade games:
   - Updated `<meta name="viewport">` with `maximum-scale=1.0, user-scalable=no, shrink-to-fit=no`.
   - Applied `touch-action: manipulation;` and `user-select: none;` across html, body, game cards, and control buttons.
   - Enforced `touch-action: none !important;` on all game canvases to block touch gesture zoom.
   - Added global `dblclick` and `wheel` (Ctrl+scroll) event preventers to completely disable browser double-click magnification.
   - Added double-tap zoom suppression on touchscreens and trackpads while preserving instant button response.
   - Connected `dblclick` on the Cube Runner canvas directly to multi-lane steering without zooming.
2. Verified live in Chrome DevTools MCP: `canvasDblPrevented: true`, `btnDblPrevented: true`, `docDblPrevented: true`, 0 console errors, interactive rapid clicks confirmed.
3. Committed and pushed changes to remote repository `origin/main`.

Next step: Done.

Tasks:
- [x] Update viewport meta tag to disable user zoom (`maximum-scale=1.0, user-scalable=no`)
- [x] Configure CSS `touch-action: manipulation` and `touch-action: none !important` on canvas
- [x] Add global double-click (`dblclick`) event listener with `e.preventDefault()`
- [x] Add touch device double-tap zoom suppression and gesture zoom block
- [x] Add canvas dblclick steering handler for smooth rapid tapping
- [x] Verify live in Chrome DevTools MCP
- [x] Git commit and push changes to origin/main

Assumptions:
- "when you doulble click the things will turn bigger but that should not happen" refers to browser double-click/double-tap viewport zoom magnifying elements when rapidly clicking or tapping to steer/play.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified canvasDblPrevented, btnDblPrevented, docDblPrevented, and rapid steering with 0 errors in Chrome DevTools MCP.
- Implemented viewport meta protection, touch-action CSS rules, and global dblclick prevention in games.html.
- Initialized double-click zoom prevention task.
