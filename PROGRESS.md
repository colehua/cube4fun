Status: COMPLETE
Goal / Definition of done:
1. Write "best!" right next to Cube Runner:
   - On the tab switcher button: `🎮 Cube Runner <span class="badge-best">best!</span>`
   - In the game panel header: `🎮 Cube Runner 3D <span class="badge-best">best!</span> • Highway Dash`
   - On the primary action button: `▶ Start 3D Cube Runner <span class="badge-best">best!</span>` (and `🔄 Restart Highway Dash <span class="badge-best">best!</span>`, `▶ Dash Again <span class="badge-best">best!</span>`)
   - Added animated vibrant CSS styling for `.badge-best` with pulse glow animation.
2. Differentiate monster health in Cube Runner:
   - Implemented varied health pools: 100 HP (Boss/Goliath), 50 HP (Brute/Fiend), 25 HP (Imp/Scout).
   - Each laser shot deals exactly 25 damage:
     - 100 HP monster requires exactly 4 shots to defeat (100 -> 75 -> 50 -> 25 -> 0).
     - 50 HP monster requires exactly 2 shots to defeat (50 -> 25 -> 0).
     - 25 HP monster requires exactly 1 shot to defeat (25 -> 0).
   - Rendered dynamic 3D health bars above monsters with remaining HP and hits counter (`100 HP (4 Shots)`, `50 HP (2 Shots)`, `25 HP (1 Shot)`).
   - Scaled and colored monsters based on health (100 HP Crimson Titan 1.35x, 50 HP Purple Brute 1.05x, 25 HP Emerald Imp 0.82x).
   - Added hit flash visual feedback and floating damage numbers (`-25 HP! 💥 [X shots left]`).
   - Rewarded bags of coins based on difficulty (25 HP: +10 💰, 50 HP: +20 💰, 100 HP: +50 💰).
   - Supported both laser shooting (4 shots) and jump-stomping on Gun Monsters (+50 💰).
3. Verified live in Chrome DevTools MCP with 0 errors across viewports.
4. Git commit and push changes to GitHub remote `origin/main`.

Next step: Done.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Add `.badge-best` CSS and update HTML tab, title, and start button
- [x] Implement monster health system (100, 50, 25 HP) with 25 damage per shot
- [x] Implement 3D health bar and hits counter above monsters
- [x] Implement distinct colors, sizes, and hit flash feedback for 100, 50, 25 HP
- [x] Verify in Chrome DevTools MCP
- [x] Commit and push to origin main

Assumptions:
- "cube runner thingy" refers to the game tab, header, and start button.
- 100 HP takes 4 shots, 50 HP takes 2 shots, 25 HP takes 1 shot (25 damage per laser shot).

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified monster health depletion (100 HP 4 shots, 50 HP 2 shots, 25 HP 1 shot) and badge in Chrome DevTools MCP.
- Implemented monster HP tiers (100, 50, 25), 3D health bars, and "best!" badge.
- Initialized Cube Runner "best!" badge and monster HP (100, 50, 25) implementation.
