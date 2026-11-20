Status: COMPLETE
Goal / Definition of done:
1. Implement prominent "Survive" feature for 100 coins if you die in Cube Runner 3D:
   - Primary action button on top bar: `[🛡️ SURVIVE WITH 100 COINS (100 💰)]` visible on death and in HUD.
   - Interactive clickable `[ 🛡️ CLICK HERE TO SURVIVE! (100 💰) ]` button rendered directly on the game-over canvas with pointer hit-testing.
   - Hotkey support: pressing 'S' or 'R' immediately triggers Survive for 100 coins.
   - Auto-Survive toggle option: allows players with 100+ coins to auto-absorb fatal hits and keep dashing uninterrupted.
   - Survival effect: deducts 100 coins, plays survival fanfare, grants glowing 2.5s forcefield shield, clears immediate hazards, and resumes highway run.
2. Verified live in Chrome DevTools MCP.
3. Committed and pushed changes to GitHub remote `origin/main`.

Next step: Completed and pushed to origin main.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Rename and style `#btn-runner-survive` ("🛡️ SURVIVE WITH 100 COINS")
- [x] Render interactive clickable Survive button box on canvas game-over screen with click hit-testing
- [x] Add 'S' key shortcut for instant Survive
- [x] Add Auto-Survive toggle chip in controls deck
- [x] Verify live in Chrome DevTools MCP
- [x] Commit and push to origin main

Assumptions:
- "Survive thing for 100 coins" means explicit "Survive" branding, both on the top bar and directly on the game screen, costing 100 coins to keep playing without restarting.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified survive features in Chrome DevTools MCP and committed/pushed to GitHub origin main.
- Implemented Survive buttons (top bar, on-canvas, hotkey S/R, auto-survive toggle) for Cube Runner and Flappy Cubie.
- Initialized Survive for 100 coins enhancement.
