# Summary
- What changed: Fixed the duplicate "Dark Mode" button on `index.html`. Separated `#install-app-btn` from `.theme-toggle-btn` onto its own `.install-app-btn` class in `index.html`, added `[hidden] { display: none !important; }` plus matching light/dark/reduced-motion pill styles for `.install-app-btn` in `theme.css`. Checked live Cole Hua BC rankings across all 18 Speedcubing Canada events (`bc-rankings.html` left untouched after 0 diffs).
- How verified: Verified every HTML page in the repo has at most one `#theme-toggle`/`.theme-toggle-btn` element; verified `#install-app-btn` stays hidden via `[hidden]` and untouched by `theme.js` during light/dark toggling via a Node VM simulation; checked JS/HTML/CSS syntax (`node --check theme.js`, `index.html` inline script parsing, Python `html.parser`, balanced braces in `theme.css`); checked all 36 live Speedcubing Canada BC ranking endpoints (0 diffs vs. `bc-rankings.html`).
- What to review: `index.html` (`#install-app-btn`), `theme.css` (`[hidden]` and `.install-app-btn` styles).
- Blockers: None.

Status: COMPLETE
Goal / Definition of done:
1. Identify root cause of duplicate "Dark Mode" buttons on `index.html`.
2. Restore single "Dark Mode" toggle button by isolating `#install-app-btn` from `.theme-toggle-btn` and honoring `[hidden]`.
3. Run recurring Cole Hua BC rankings check against Speedcubing Canada (leave `bc-rankings.html` untouched if unchanged).
4. Verify HTML/CSS/JS and push changes to `origin/main`.

Next step: Ready for future prompts.

Tasks:
- [x] Pre-sync (`git pull origin main`) and read `PROGRESS.md` / `GEMINI.md`
- [x] Check live Cole Hua BC rankings across all 18 events (36 endpoints) — 0 changes, left `bc-rankings.html` untouched
- [x] Diagnose duplicate Dark Mode button (`#install-app-btn` reusing `.theme-toggle-btn` + `.theme-toggle-btn { display: inline-flex }` overriding `[hidden]`)
- [x] Update `#install-app-btn` class to `.install-app-btn` in `index.html` and add `[hidden]` + `.install-app-btn` styles in `theme.css`
- [x] Verify single dark-mode toggle invariant across all HTML files, DOM simulation of `theme.js`, and HTML/CSS/JS syntax checks
- [x] Update `PROGRESS.md`, commit, and push to `origin/main`

Assumptions:
- Keep `#install-app-btn` functional for browsers that support PWA install (`beforeinstallprompt` / `navigator.install`), hidden by default via `[hidden]`, with its own `.install-app-btn` class so it never duplicates or mimics the Dark Mode button.
- Stashed obsolete local 1-line `timer.html` edit from before commit `9863657` (already superseded on `origin/main`).

Blockers (what I need to do): None.
Found, not done:
- Unrelated to this task: 14 sub-pages have leftover `<text y='.9em' font-size='90'>...</text></svg>">` markup trailing `<link rel="manifest" href="manifest.webmanifest">` from commit `4c1a4c0`. Left untouched to keep this fix minimal and focused.

Log (newest first, one line each):
- 2026-11-27: BC rankings checked: no changes; fixed duplicate Dark Mode button on `index.html` by moving `#install-app-btn` to `.install-app-btn` and enforcing `[hidden] { display: none !important; }` in `theme.css`, verified and pushed to `origin/main`.
- 2026-11-26: BC rankings checked: no changes; completed full-site review and upgrade across 21 existing files + 7 new PWA/SEO/404 assets, eliminated all 48 legacy-scan findings, fixed audio/XSS/markdown/overflow/contrast bugs, verified 100 A11y/BP/SEO in Lighthouse, pushed to `origin/main`.
- 2026-11-25: Created `bc-rankings.html`, linked across `index.html`/`timer.html`/`news.html`, added recurring BC ranking refresh task to `AGENT.md`/`CLAUDE.md`/`GEMINI.md`, verified desktop/mobile & live API parity, pushed to `origin/main`.
- 2026-11-25: Hardened Google Cloud Console sync rules (`.gitattributes`, `sync.sh`, `sync.ps1`), fixed `timer.html` WCA API 403 error, upgraded `games.html` cross-game abilities & shop UX, verified 0 console errors, and pushed to `origin/main`.
