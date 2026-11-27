# Summary
- What changed:
  - Raised all paid prices (~3x) across the Arcade **Upgrades & Skins** shop in `games.html` (`UPGRADE_CONFIG`, `CUBE_SKINS`, and `SWITCH_THEMES`) while keeping default starter skins free (`0 💰`):
    - **Power-Up Upgrades (`UPGRADE_CONFIG`):**
      - `dash` (Hyper Dash Boost): `[50, 120, 250, 500, 1000]` -> `[150, 350, 750, 1500, 3000]`
      - `magnet` (Super Coin Magnet): `[60, 140, 300, 600, 1200]` -> `[180, 420, 900, 1800, 3600]`
      - `blaster` (Blaster Cannon): `[75, 180, 400, 800, 1500]` -> `[225, 550, 1200, 2400, 4500]`
      - `shield` (Energy Forcefield): `[50, 120, 250, 500, 1000]` -> `[150, 350, 750, 1500, 3000]`
      - `multiplier` (Wealth Multiplier): `[100, 250, 600, 1200, 2500]` -> `[300, 750, 1800, 3600, 7500]`
      - `doubleJump` (Rocket Double Jump): `[200]` -> `[600]`
    - **Cube Skins (`CUBE_SKINS`):** `gold` `250 -> 750`, `matrix` `350 -> 1050`, `rainbow` `400 -> 1200`, `void` `500 -> 1500` (`default` stays `0`).
    - **Nintendo Switch Themes (`SWITCH_THEMES`):** `oled` `200 -> 600`, `zelda` `300 -> 900`, `synthwave` `400 -> 1200`, `gold` `600 -> 1800` (`neon` stays `0`).
- How verified: Ran automated Node VM tests on `games.html` confirming rendered shop cards display all updated prices, purchases under the new thresholds are rejected with insufficient-coins alerts, and exact-price purchases deduct coins and unlock/equip upgrades, cube skins, and Switch themes cleanly; validated CSS braces, JS syntax (`new Function`), and Python `html.parser`. Checked live Speedcubing Canada BC rankings API across all 18 events (`0` errors): no changes (`bc-rankings.html` untouched).
- What to review: `games.html` (`UPGRADE_CONFIG`, `CUBE_SKINS`, `SWITCH_THEMES` at lines 4430–4496).
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Increase prices across all paid Power-Up Upgrades, Cube Skins, and Nintendo Switch Themes in `games.html`.
2. Verify shop rendering, purchase guards, and syntax in Node VM and Python `html.parser`.
3. Check BC rankings, update `PROGRESS.md`, commit, and push to `origin/main`.

Next step: Ready for future prompts.

Tasks:
- [x] Pre-sync (`git pull origin main`), check live BC rankings API, and locate all shop/upgrade/skin price configs
- [x] Increase prices (~3x) in `UPGRADE_CONFIG`, `CUBE_SKINS`, and `SWITCH_THEMES` in `games.html` while preserving free starter defaults
- [x] Verify shop UI rendering, purchase guards, deductions, CSS/JS syntax, and Python `html.parser`
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Scaled all paid items cleanly by ~3x to balance the larger coin payouts from Cube Runner multipliers and Secret Rocket Vault bounties/Cube Ninja rewards, while keeping starter skins (`default` Neon Cyan and `neon` Classic Neon) free at `0`.

Blockers (what I need to do): None.
Found, not done:
- Unrelated to this task: 14 sub-pages have leftover `<text y='.9em' font-size='90'>...</text></svg>">` markup trailing `<link rel="manifest" href="manifest.webmanifest">` from commit `4c1a4c0`. Left untouched to keep this change minimal and focused.

Log (newest first, one line each):
- 2026-11-27: BC rankings checked: no changes; raised all paid Power-Up Upgrades, Cube Skins, and Nintendo Switch Theme prices by ~3x in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; added Cube Ninja Pause/Resume button (`#btn-pause-rush`) with frozen overlay/anti-cheat guard and made popping cubes slower (`LAUNCH_GRAVITY = 0.095`, `vy = -7.0..-8.8`) and fewer (`1–2`/wave, `125–174` frame interval, cap `4`) in `rocket-vault.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; added dedicated Restart buttons directly next to Start buttons in `games.html` (`#btn-runner-restart`) and `rocket-vault.html` (`#btn-restart-rush`), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; turned `rocket-vault.html` secret game into Fruit-Ninja-style Cube Ninja with launching cubes, bombs, and a fast zero-gravity bouncing Hyper-Cube that slows down as you slice cubes until you can press it, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; placed Cube Runner Slide under Left, Jump under Right (same size as Left/Right), bigger Shoot above Right, and moved Start (`▶ START`) on top of the Nintendo Switch in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; linked the rocket emoji under the Nintendo Switch in `games.html` to new Level 2 secret page `rocket-vault.html` (Zero-G Meteor Rush mini-game, Arcade Coin supply drops, Space Terminal codes, Blueprint Bay), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; set Cube Runner Dash reload to exact 40 seconds with live countdown/progress bar and tuned speed to start super slow (`0.25x`), accelerate progressively faster, and reset to `0.25x` on restart in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; fixed Joy-Con button overflow off the Nintendo Switch across all 12 games and added bottom-right `❄️ Freeze Page` lock button (`#btn-freeze-switch-page`) in `games.html`, verified and pushed to `origin/main`.
