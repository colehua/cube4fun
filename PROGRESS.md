# Summary
- What changed:
  - Redesigned Cube Runner's Nintendo Switch button layout (`#panel-runner`) in `games.html`:
    - Moved `#btn-runner-start` into `.switch-top-start-bar` centered directly **on top of the Nintendo Switch console** and renamed its label from `Dash` to **`▶ START`** across HTML, `startRunnerGame()`, `gameOverRunner()`, `surviveRunnerWithCoins()`, and `renderRunnerIdle()`.
    - Placed **Slide (`#btn-runner-slide`, `▼ SLIDE`)** directly below **Left (`#btn-runner-left`, `◄ LEFT`)** on the Left Joy-Con.
    - Placed **Jump (`#btn-runner-jump`, `▲ JUMP`)** directly below **Right (`#btn-runner-right`, `► RIGHT`)** on the Right Joy-Con.
    - Matched **Left, Right, Slide, and Jump** to the exact same size (`.runner-joy-btn`: `54px × 54px` desktop, `44px × 44px` mobile) and exact same horizontal rows (`Row 3` = Left & Right; `Row 4` = Slide & Jump).
    - Placed **Shoot (`#btn-runner-shoot`, `🔥 SHOOT`)** directly on top of **Right (`#btn-runner-right`)** and made it slightly bigger (`.runner-shoot-btn`: `62px × 62px` desktop, `50px × 50px` mobile — fits cleanly inside the `77px`/`63px` Joy-Con borders with zero overflow).
    - Kept `[-] ⏸️` Pause and `⚡ DASH` (40s reload) on the Left Joy-Con and `🛡️ 100 💰` / `🛡️ Auto` on the Right Joy-Con bottom row.
- How verified: Executed Node structural & CSS audit verifying `#btn-runner-start` sits on top of `.nintendo-switch-console` saying `START` (with 0 JS overwrites to `Dash`), verified Left Joy-Con order (`Pause -> Dash -> LEFT -> SLIDE`) and Right Joy-Con order (`Top spacer -> SHOOT -> RIGHT -> JUMP -> Survive/Auto`), verified equal `54px`/`44px` classes for Left/Right/Slide/Jump and `62px`/`50px` for Shoot inside `77px`/`63px` Joy-Con inner width, and passed JS/CSS/Python `html.parser` checks on `games.html`. BC rankings checked today (2026-11-27): no changes (`bc-rankings.html` untouched).
- What to review: `games.html` (`.switch-top-start-bar`, `.runner-joy-btn`, `.runner-shoot-btn`, `#panel-runner` Joy-Con HTML, and `btn-runner-start` JS updates).
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Place Slide below Left and Jump below Right at the exact same size as Left and Right (`54px` desktop / `44px` mobile), keeping Left/Right on the same row and Slide/Jump on the same row.
2. Place Shoot directly above Right and make it slightly bigger (`62px` desktop / `50px` mobile) while staying inside the Joy-Con.
3. Move Start on top of the Nintendo Switch and make it say `START` instead of `Dash`.
4. Verify layout, JS/CSS/HTML syntax, update `PROGRESS.md`, and push to `origin/main`.

Next step: Ready for future prompts.

Tasks:
- [x] Pre-sync (`git pull origin main`) and inspect Cube Runner Joy-Con layout and Start button JS in `games.html`
- [x] Add `.switch-top-start-bar` above `.nintendo-switch-console` with `#btn-runner-start` labeled `▶ START` and update all JS text references from `Dash` to `START`
- [x] Reorganize Left Joy-Con (`Pause -> Dash -> LEFT -> SLIDE`) and Right Joy-Con (`SHOOT -> RIGHT -> JUMP -> Survive/Auto`) on synchronized 5-row CSS Grid with uniform `54px`/`44px` buttons and slightly bigger `62px`/`50px` Shoot button
- [x] Verify button ordering, sizes, containment, and JS/CSS/HTML syntax
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Scoped the button reorganization to Cube Runner (`#panel-runner`) so the other 11 Switch games keep their existing controls.
- Kept `#btn-side-dash` (40s reload) directly above `◄ LEFT` in Row 2 of the Left Joy-Con across from `🔥 SHOOT` in Row 2 of the Right Joy-Con for clean two-handed balance.

Blockers (what I need to do): None.
Found, not done:
- Unrelated to this task: 14 sub-pages have leftover `<text y='.9em' font-size='90'>...</text></svg>">` markup trailing `<link rel="manifest" href="manifest.webmanifest">` from commit `4c1a4c0`. Left untouched to keep this change minimal and focused.

Log (newest first, one line each):
- 2026-11-27: BC rankings checked: no changes; placed Cube Runner Slide under Left, Jump under Right (same size as Left/Right), bigger Shoot above Right, and moved Start (`▶ START`) on top of the Nintendo Switch in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; linked the rocket emoji under the Nintendo Switch in `games.html` to new Level 2 secret page `rocket-vault.html` (Zero-G Meteor Rush mini-game, Arcade Coin supply drops, Space Terminal codes, Blueprint Bay), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; set Cube Runner Dash reload to exact 40 seconds with live countdown/progress bar and tuned speed to start super slow (`0.25x`), accelerate progressively faster, and reset to `0.25x` on restart in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; fixed Joy-Con button overflow off the Nintendo Switch across all 12 games and added bottom-right `❄️ Freeze Page` lock button (`#btn-freeze-switch-page`) in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; added Tom Hero Run jump/slide obstacle mechanics (`hurdle` bottom-blocked, tall `laser` overhead too-high, `both_bar` jump-or-slide, tall solid walls, 3-lane action waves, slide-cancel jump, fast-drop into slide) in `games.html`, verified across 17 assertions + 1,000 spawn waves, pushed to `origin/main`.
