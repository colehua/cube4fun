# Summary
- What changed:
  - Set Cube Runner's Dash button (`#btn-side-dash`) reload time in `games.html` to an exact real-time **40 seconds** (`RUNNER_DASH_COOLDOWN_MS = 40000`, ticking down via `performance.now()` delta time after the dash finishes so it stays accurate across 60Hz/120Hz displays and never ticks while paused). Added a live `⏳ 40s -> 1s` countdown with a cyan loading progress bar fill on `#btn-side-dash` and updated `UPGRADE_CONFIG.dash.desc`.
  - Tuned Cube Runner's speed curve in `games.html` to start **super slow** (`RUNNER_START_SPEED = 0.25x`) and accelerate progressively faster and faster (`(0.00055 + runnerSpeed * 0.00038) * dtFactor`: `0.25x` at 0s -> `0.68x` at 10s -> `1.23x` at 20s -> `1.92x` at 30s -> `2.78x` at 40s -> unbounded). Dying and restarting via `startRunnerGame()` resets speed strictly back to `0.25x` (and Dash ready) and repeats the ramp cleanly.
  - Upgraded obstacle and coin spawning to smooth road-distance accumulators (`runnerSpawnDist`, `runnerCoinDist`) and swept collision checks (`ob.z < 138 && prevZ > 70`) so pacing and collision stay accurate from `0.25x` super slow through `5x+` turbo speeds.
- How verified: Executed Node VM tests against `games.html` proving the exact progressive speed curve (`0.25x -> 0.68x -> 1.23x -> 1.92x -> 2.78x`), die-and-restart reset back to `0.25x`, and exact 40-second Dash reload (`⏳ 40s`, blocked at `39.0s` showing `⏳ 1s`, ready and fireable at `40.1s` showing `⚡ DASH` even at upgrade level 5); verified 0 stale `runnerDashCooldown` refs and clean JS + Python `html.parser` syntax. BC rankings checked today (2026-11-27): no changes (`bc-rankings.html` untouched).
- What to review: `games.html` (`RUNNER_START_SPEED`, `RUNNER_DASH_COOLDOWN_MS`, `startRunnerGame`, `runnerDashAction`, `updateDashButtons`, `runnerLoop`).
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Require exactly 40 seconds of reload time before the Dash button can be used again, with clear visual countdown/loading feedback.
2. Start Cube Runner super slow (`0.25x`), accelerate progressively faster and faster during play, and reset cleanly back to super slow (`0.25x`) on death and restart.
3. Verify with automated timing/speed tests and syntax checks, update `PROGRESS.md`, and push to `origin/main`.

Next step: Ready for future prompts.

Tasks:
- [x] Pre-sync (`git pull origin main`) and inspect Dash cooldown and speed progression in `games.html`
- [x] Implement exact 40-second real-time Dash reload (`RUNNER_DASH_COOLDOWN_MS = 40000`) with `⏳ Xs` countdown and loading fill bar on `#btn-side-dash`
- [x] Implement super-slow start (`0.25x`), progressive speed acceleration, smooth distance-based spawning, swept collision checks, and strict reset to `0.25x` on restart
- [x] Verify 40s Dash reload, speed ramp, restart cycle, and JS/HTML syntax
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Using real elapsed time (`performance.now()` delta clamped to `100ms` and paused when the game is paused) keeps the 40-second Dash reload accurate regardless of monitor refresh rate (60Hz vs. 120Hz/144Hz).
- Restarting a run (`startRunnerGame()`) starts with Dash ready and speed reset to `0.25x`, then enforces the 40-second reload after each Dash use.

Blockers (what I need to do): None.
Found, not done:
- Unrelated to this task: 14 sub-pages have leftover `<text y='.9em' font-size='90'>...</text></svg>">` markup trailing `<link rel="manifest" href="manifest.webmanifest">` from commit `4c1a4c0`. Left untouched to keep this change minimal and focused.

Log (newest first, one line each):
- 2026-11-27: BC rankings checked: no changes; set Cube Runner Dash reload to exact 40 seconds with live countdown/progress bar and tuned speed to start super slow (`0.25x`), accelerate progressively faster, and reset to `0.25x` on restart in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; fixed Joy-Con button overflow off the Nintendo Switch across all 12 games and added bottom-right `❄️ Freeze Page` lock button (`#btn-freeze-switch-page`) in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; added Tom Hero Run jump/slide obstacle mechanics (`hurdle` bottom-blocked, tall `laser` overhead too-high, `both_bar` jump-or-slide, tall solid walls, 3-lane action waves, slide-cancel jump, fast-drop into slide) in `games.html`, verified across 17 assertions + 1,000 spawn waves, pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; aligned Cube Runner Left and Right buttons and thumbsticks onto identical rows/heights in `games.html` (`#panel-runner`), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; fixed duplicate Dark Mode button on `index.html` by moving `#install-app-btn` to `.install-app-btn` and enforcing `[hidden] { display: none !important; }` in `theme.css`, verified and pushed to `origin/main`.
