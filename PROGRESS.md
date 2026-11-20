Status: COMPLETE
Goal / Definition of done:
1. Fix score and record spacing in Scramble Match Pairs (games.html):
   - Prevent text wrapping or clipping of record text
   - Use stacked column header layout (.header-stacked) for games with 4 statistics
   - Style statistics into individual responsive pill badges with distinct gold record pill
   - Allow flexible wrapping and centered display on mobile and tablet screens
2. Verify live rendering in Chrome DevTools MCP.
3. Commit and push changes to GitHub remote (origin/main).

Next step: Done.

Tasks:
- [x] Fix .game-score-display CSS with flex-wrap, pill badge styling, and centered alignment
- [x] Add .header-stacked layout class for spacious title and scoreboard separation
- [x] Update panel-pairs and panel-whack to use .header-stacked and .record-pill
- [x] Verify live rendering across desktop and mobile widths in Chrome DevTools MCP
- [x] Commit and push to origin/main

Assumptions:
- Stacking the header and wrapping score items as pills provides ample space for the full record string (e.g. "00:45 (14m)").

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Pushed record spacing fix to GitHub remote (origin/main).
- Verified responsive layout and record visibility across viewports in Chrome DevTools MCP.
- Updated Scramble Match Pairs and Whack-A-Cubie header layout to .header-stacked with dedicated .record-pill badges.
- Enhanced .game-score-display with flex-wrap and individual stat pill formatting.
