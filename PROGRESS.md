# Summary
- **What changed**:
  1. **Added In-Repository Project Rules ([CLAUDE.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/CLAUDE.md) & [AGENT.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/AGENT.md))**:
     - Embedded Level 4 autonomy guidelines, verification rules, STE-100 formatting, and cross-device auto-sync protocol directly inside the repository.
     - Ensures Google Cloud Console and fresh computers automatically have project rules without needing external/global configurations.
  2. **Simplified Universal Agent Prompt in [SYNC.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/SYNC.md)**:
     - Replaced hardcoded update lists with a concise 3-line static prompt that instructs any AI assistant to pull code, read `CLAUDE.md` and `PROGRESS.md` dynamically, perform the task, and commit/push on finish.
- **How verified**:
  - Verified `CLAUDE.md`, `AGENT.md`, and `SYNC.md` render cleanly and point to correct project paths.
  - Committed and pushed changes to `origin/main` on GitHub.
- **What to review**:
  - Run `git pull origin main` in Google Cloud Shell.
  - Review [CLAUDE.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/CLAUDE.md) and the updated prompt in [SYNC.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/SYNC.md).
- **Blockers**: None.

Status: COMPLETE
Goal / Definition of done:
1. Remove manual status copying from prompts by storing project rules directly in the repository.
2. Provide a short, static prompt for Google Cloud Console and any PC.
3. Commit and push all changes to origin main.

Next step: Done.

Tasks:
- [x] Create CLAUDE.md with Level 4 autonomy and auto-sync guidelines
- [x] Create AGENT.md reference
- [x] Simplify SYNC.md with short universal prompt
- [x] Update PROGRESS.md
- [x] Commit and push changes to origin main

Assumptions:
- Storing autonomy guidelines in CLAUDE.md allows any assistant in Cloud Console or new machines to act with Level 4 agency.

Blockers (what I need to do): None.
Found, not done: None.
Log (newest first, one line each):
- 2026-11-18: Embedded Level 4 autonomy guidelines in CLAUDE.md/AGENT.md and simplified cross-device prompt in SYNC.md.
- 2026-11-18: Added cross-device sync scripts (sync.sh, sync.ps1) and SYNC.md.
- 2026-11-18: Added comments network status badge ("need network" / "WIFI needed"), freeze/unfreeze button on cube solving robot, and side-by-side camera scanner layout.
- 2026-11-18: Fixed Megaminx 3D dodecahedron geometry, face transforms, turn permutations, and solver.
- 2026-11-17: Added 100x100x100 cube solver and fixed white color on 3D guide cube in scanner.
- 2026-11-17: Implemented auto face memorization and slow 1.6s 3D cube rotation after snapping picture in scanner.
