# Summary
- What changed:
  - Built a local multi-account Sign In & Account Switcher system in new shared module `arcade-accounts.js` (`window.CubeAccounts`), wired into both `games.html` (Nintendo Switch Cube Arcade) and `rocket-vault.html` (Secret Rocket Vault / Cube Ninja):
    - **Make Account (`✨ Make Account` tab):** Type a new player name (up to 20 chars), pick an avatar (`😎`, `🦊`, `🚀`, `👑`, `🤖`, `🐉`, `🦄`, `⚡`), optionally carry over existing Guest progress when creating from Guest, and start with separate coins, XP, upgrades, cube skins, Nintendo Switch themes, all 12 Arcade high scores, and Secret Rocket Vault progress/bounties.
    - **Sign In (`🔑 Sign In` tab):** Type any existing account name (case-insensitive) into the Sign In input box (`#account-signin-input` / `#vault-signin-input`) to switch players immediately on the same device, or tap a saved account card in the Saved Accounts list; includes one-click "Make `<name>`" shortcut if a typed account does not exist yet, plus `🚪 Sign Out (Play as Guest)` and delete account controls.
    - **Safe Live Switching & Persistence:** Automatically snapshots all 19 per-player `localStorage` keys before switching and on coin/XP/upgrade/bounty updates and page exit (`pagehide`, `beforeunload`, `visibilitychange`), live-refreshes all 12 game high-score displays + shop/skins/themes without reloading, and guards all 5 game `keydown` listeners (`isTypingInForm`) so typing names never triggers game shortcuts.
- How verified: Verified `node --check arcade-accounts.js`, CSS brace balance, JS `new Function`, and Python `html.parser` on `games.html` and `rocket-vault.html`. Executed end-to-end cross-page Node VM tests simulating Guest import -> creating `Cole` (`🦊`) -> purchasing upgrades & Switch theme -> creating fresh `Alex` (`🚀`) -> duplicate rejection -> unknown-name error -> case-insensitive typed sign-in (`"COLE"`) -> cross-page `rocket-vault.html` bounty isolation -> sign out to Guest -> delete account -> keyboard input guards. Checked live Speedcubing Canada BC rankings API across all 18 events (`0` errors): no changes (`bc-rankings.html` untouched).
- What to review: `arcade-accounts.js` (`CubeAccounts`), `games.html` (`#btn-open-account`, `#account-modal`, `openAccountModal`, `submitAccountSignIn`, `submitAccountCreate`, `refreshArcadeForActiveAccount`, `isTypingInForm`), and `rocket-vault.html` (`#btn-vault-account`, `#vault-account-modal`, `openVaultAccountModal`, `submitVaultSignIn`, `submitVaultCreate`).
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Add a Sign In Account system so multiple players can switch profiles on the same device with isolated coins, XP, upgrades, skins, themes, and high scores.
2. Provide both a Make Account flow and a typed Sign In input box (plus saved account quick-switcher) across `games.html` and `rocket-vault.html`.
3. Verify cross-page switching, progress isolation, keyboard guards, syntax, and BC rankings; update `PROGRESS.md`; commit and push to `origin/main`.

Next step: Ready for future prompts.

Tasks:
- [x] Pre-sync (`git pull origin main`), check live BC rankings API, and audit all 19 player `localStorage` keys across `games.html` and `rocket-vault.html`
- [x] Create shared multi-account storage engine `arcade-accounts.js` with Guest backup, profile snapshots, case-insensitive Sign In, Make Account, Sign Out, and Delete
- [x] Add Sign In / Make Account modal, header/strip account buttons, live 12-game refresh, and `keydown` form guards to `games.html`
- [x] Add matching Sign In / Make Account modal and live sync hooks to `rocket-vault.html`
- [x] Verify end-to-end cross-page multi-account switching, isolation, syntax, and HTML parsing
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Kept Sign In frictionless with typed account names (case-insensitive, no password required) for quick same-device switching between family/friends.
- Preserved any pre-existing Guest progress safely via `cube_arcade_guest_backup_v1` and offered an optional checkbox when creating an account from Guest so nobody loses existing coins or high scores.

Blockers (what I need to do): None.
Found, not done:
- Unrelated to this task: 14 sub-pages have leftover `<text y='.9em' font-size='90'>...</text></svg>">` markup trailing `<link rel="manifest" href="manifest.webmanifest">` from commit `4c1a4c0`. Left untouched to keep this change minimal and focused.

Log (newest first, one line each):
- 2026-11-27: BC rankings checked: no changes; added multi-player Sign In & Make Account system (`arcade-accounts.js`) with typed account Sign In, avatar picker, saved-account switcher, and full 19-key progress isolation across `games.html` and `rocket-vault.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; raised all paid Power-Up Upgrades, Cube Skins, and Nintendo Switch Theme prices by ~3x in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; added Cube Ninja Pause/Resume button (`#btn-pause-rush`) with frozen overlay/anti-cheat guard and made popping cubes slower (`LAUNCH_GRAVITY = 0.095`, `vy = -7.0..-8.8`) and fewer (`1–2`/wave, `125–174` frame interval, cap `4`) in `rocket-vault.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; added dedicated Restart buttons directly next to Start buttons in `games.html` (`#btn-runner-restart`) and `rocket-vault.html` (`#btn-restart-rush`), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; turned `rocket-vault.html` secret game into Fruit-Ninja-style Cube Ninja with launching cubes, bombs, and a fast zero-gravity bouncing Hyper-Cube that slows down as you slice cubes until you can press it, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; placed Cube Runner Slide under Left, Jump under Right (same size as Left/Right), bigger Shoot above Right, and moved Start (`▶ START`) on top of the Nintendo Switch in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; linked the rocket emoji under the Nintendo Switch in `games.html` to new Level 2 secret page `rocket-vault.html` (Zero-G Meteor Rush mini-game, Arcade Coin supply drops, Space Terminal codes, Blueprint Bay), verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; set Cube Runner Dash reload to exact 40 seconds with live countdown/progress bar and tuned speed to start super slow (`0.25x`), accelerate progressively faster, and reset to `0.25x` on restart in `games.html`, verified and pushed to `origin/main`.
- 2026-11-27: BC rankings checked: no changes; fixed Joy-Con button overflow off the Nintendo Switch across all 12 games and added bottom-right `❄️ Freeze Page` lock button (`#btn-freeze-switch-page`) in `games.html`, verified and pushed to `origin/main`.
