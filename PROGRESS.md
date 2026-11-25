# Summary
- What changed: Fixed WCA API 403 error in `timer.html`, protected `sync.sh` line endings for Google Cloud Shell in `.gitattributes`, upgraded `sync.sh` & `sync.ps1` remote checks, and fixed bugs + expanded upgrades across `games.html` (Shop shortcuts `U`/`Esc`, auto-pause on shop open, unified coin bank on survives, idle canvases on Runner/Breaker/Space, scaled pointer aiming, centered Breaker bricks, cross-game Shield/Blaster/Magnet/Skin support, XP rank progress bar, and confetti celebrations).
- How verified: Verified syntax on all JS/HTML files, ran `.\sync.ps1 check`, tested live pages in Chrome DevTools MCP over local HTTP (`timer.html`, `games.html`) with 0 console errors, and tested all gameplay upgrades & keyboard shortcuts directly.
- What to review: `.gitattributes`, `sync.sh`, `sync.ps1`, `timer.html`, `games.html`, `PROGRESS.md`.
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Ensure everything across the site works cleanly and upgrade key mechanics & UX across the arcade.
2. Guarantee seamless cross-device GitHub sync between Windows PC and Google Cloud Console (`/home/huazicheng/repos/cube4fun`).
3. Commit and push all changes cleanly to `origin/main`.

Next step: Ready for prompts from either this Windows PC or Google Cloud Console.

Tasks:
- [x] Pre-sync (`git pull origin main`) and full 18-page site audit
- [x] Harden `.gitattributes` LF rules and upgrade `sync.sh` & `sync.ps1` remote/LFS checks
- [x] Fix `timer.html` WCA API (replace 403 `corsproxy.io` with official WCA v0 JSON API)
- [x] Fix `games.html` bugs & upgrade Shop, Cube Runner, Space Scramble, Brick Breaker, Flappy Cubie
- [x] Verify all touched pages and gameplay in Chrome DevTools MCP (0 console errors)
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Google Cloud Console works from `/home/huazicheng/repos/cube4fun` synced via `github.com/colehua/cube4fun` (`main`), `./sync.sh`, `AGENT.md`/`CLAUDE.md`/`GEMINI.md`, and `PROGRESS.md`.
- Direct WCA v0 JSON API (`https://www.worldcubeassociation.org/api/v0/persons/2026HUAC01`) permanently replaces broken third-party HTML proxies.

Blockers (what I need to do): None.
Found, not done: None.

Log (newest first, one line each):
- 2026-11-25: Hardened Google Cloud Console sync rules (`.gitattributes`, `sync.sh`, `sync.ps1`), fixed `timer.html` WCA API 403 error, upgraded `games.html` cross-game abilities & shop UX, verified 0 console errors, and pushed to `origin/main`.
- 2026-11-24: Completed initial "Upgrade Everything" implementation in `games.html` (commit `9399500`).
