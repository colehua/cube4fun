# Summary
- What changed:
  - Added a dedicated **🔄 RESTART** button (`#btn-runner-restart`, `.switch-top-restart-btn`) directly next to **▶ START** (`#btn-runner-start`) in `.switch-top-start-bar` on top of the Nintendo Switch in `games.html`, styled with matching pill geometry, mobile responsive sizing, Game Over pulse highlight (`dash-again-highlight`), and `onclick="startRunnerGame()"` (resets speed back to `0.25x`, distance to `0`, and Dash cooldown to `0`).
  - Added a dedicated **🔄 Restart** button (`#btn-restart-rush`, `.vault-btn.restart`) directly next to **⚔️ Start Cube Ninja** (`#btn-start-rush`) inside `.btn-row` in `rocket-vault.html` wired to `onclick="startCubeNinja()"` and kept the Start button label fixed so Start and Restart stay distinct.
- How verified: Ran automated verification across `games.html` and `rocket-vault.html` checking JS syntax (`new Function`), CSS brace balance, Python `html.parser`, DOM button adjacency (`#btn-runner-start` -> `#btn-runner-restart` and `#btn-start-rush` -> `#btn-restart-rush`), and Node VM runtime execution confirming full game reset and Game Over highlight toggling. Checked live Speedcubing Canada BC rankings API across all 18 events (`0` errors): no changes (`bc-rankings.html` untouched).
- What to review: `games.html` (`.switch-top-start-bar`, `#btn-runner-restart`, `startRunnerGame`, `gameOverRunner`, `surviveRunnerWithCoins`) and `rocket-vault.html` (`.vault-btn.restart`, `#btn-restart-rush`, `startCubeNinja`).
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Place a dedicated Restart button immediately next to the Start button on both Cube Runner (`games.html`) and Cube Ninja (`rocket-vault.html`).
2. Verify layout markup, CSS, JS syntax, and reset behavior via automated checks.
3. Check BC rankings, update `PROGRESS.md`, commit, and push to `origin/main`.

Next step: Ready for future prompts.

Tasks:
- [x] Pre-sync (`git pull origin main`) and inspect `games.html` and `rocket-vault.html`
- [x] Add `#btn-runner-restart` (`🔄 RESTART`) directly next to `#btn-runner-start` in `games.html` with matching pill styles and Game Over highlight sync
- [x] Add `#btn-restart-rush` (`🔄 Restart`) directly next to `#btn-start-rush` in `rocket-vault.html` and preserve Start label
- [x] Verify JS/CSS/HTML syntax, DOM adjacency, runtime reset behavior in Node VM, and live BC rankings API
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Added the Restart button next to Start on both `games.html` (top-of-Switch Cube Runner bar) and `rocket-vault.html` (Cube Ninja action row) because both pages were recently updated with prominent Start buttons.

Blockers (what I need to do): None.
Found, not done:
- Unrelated to this task: 14 sub-pages have leftover `<text y='.9em' font-size='90'>...</text></svg>">` markup trailing `<link rel="manifest" href="manifest.webmanifest">` from commit `4c1a4c0`. Left untouched to keep this change minimal and focused.

Log (newest first, one line each):
- 2026-11-27: BC rankings checked: no changes; added dedicated Restart buttons directly next to Start buttons in `games.html` (`#btn-runner-restart`) and `rocket-vault.html` (`#btn-restart-rush`), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; turned `rocket-vault.html` secret game into Fruit-Ninja-style Cube Ninja with launching cubes, bombs, and a fast zero-gravity bouncing Hyper-Cube that slows down as you slice cubes until you can press it, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; placed Cube Runner Slide under Left, Jump under Right (same size as Left/Right), bigger Shoot above Right, and moved Start (`▶ START`) on top of the Nintendo Switch in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; linked the rocket emoji under the Nintendo Switch in `games.html` to new Level 2 secret page `rocket-vault.html` (Zero-G Meteor Rush mini-game, Arcade Coin supply drops, Space Terminal codes, Blueprint Bay), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; set Cube Runner Dash reload to exact 40 seconds with live countdown/progress bar and tuned speed to start super slow (`0.25x`), accelerate progressively faster, and reset to `0.25x` on restart in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; fixed Joy-Con button overflow off the Nintendo Switch across all 12 games and added bottom-right `❄️ Freeze Page` lock button (`#btn-freeze-switch-page`) in `games.html`, verified and pushed to `origin/main`.
