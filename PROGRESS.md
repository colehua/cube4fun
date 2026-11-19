# Summary
- **What changed**:
  1. **Zero-Touch User Workflow**:
     - Updated [CLAUDE.md](file:///home/huazicheng/repos/cube4fun/CLAUDE.md), [AGENT.md](file:///home/huazicheng/repos/cube4fun/AGENT.md), and added [GEMINI.md](file:///home/huazicheng/repos/cube4fun/GEMINI.md) with the Zero-Touch User Interaction rule.
     - Mandates that any AI assistant autonomously runs the 4-step auto-sync loop (pull -> execute -> verify -> update PROGRESS.md -> commit/push) on every user prompt without asking or requiring boilerplate.
  2. **Simplified User Prompting in [SYNC.md](file:///home/huazicheng/repos/cube4fun/SYNC.md)**:
     - Promoted direct task prompting (`<YOUR TASK HERE>`) as the default workflow across all environments.
     - Preserved explicit fallback prompt for basic models.
  3. **Enhanced Cross-Device Sync Scripts**:
     - Added `check` command to [sync.sh](file:///home/huazicheng/repos/cube4fun/sync.sh) and [sync.ps1](file:///home/huazicheng/repos/cube4fun/sync.ps1) for automated environment diagnosis.
     - Added single-command `sync` (`./sync.sh sync "msg"`) for instant pull, stage, commit, and push.
- **How verified**:
  - Ran `./sync.sh check` to confirm automated diagnostic checks.
  - Ran `./sync.sh status` to inspect modified files.
  - Validated all markdown links and documentation structure.
- **What to review**:
  - Review [CLAUDE.md](file:///home/huazicheng/repos/cube4fun/CLAUDE.md), [AGENT.md](file:///home/huazicheng/repos/cube4fun/AGENT.md), [GEMINI.md](file:///home/huazicheng/repos/cube4fun/GEMINI.md), and [SYNC.md](file:///home/huazicheng/repos/cube4fun/SYNC.md).
- **Blockers**: None.

Status: COMPLETE
Goal / Definition of done:
1. Allow user to provide only their task description in future sessions while the agent autonomously handles the complete sync and progress workflow.
2. Embed zero-touch guidelines across CLAUDE.md, AGENT.md, and GEMINI.md.
3. Enhance sync helper scripts with check and sync commands.
4. Verify, update PROGRESS.md, and push to origin main.

Next step: User can now prompt with only their task description on any computer or Cloud Console.

Tasks:
- [x] Update CLAUDE.md with Zero-Friction User Interaction (The Golden Rule)
- [x] Update AGENT.md with identical standalone autonomous guidelines
- [x] Create GEMINI.md for Google/Gemini agents
- [x] Update SYNC.md with direct task prompting instructions
- [x] Add check and sync commands to sync.sh and sync.ps1
- [x] Verify script commands and test readiness
- [x] Update PROGRESS.md
- [x] Stage, commit, and push changes to origin main

Assumptions:
- Storing identical instructions in CLAUDE.md, AGENT.md, and GEMINI.md guarantees any AI agent across different IDEs/CLIs will automatically execute the 4-step sync loop.

Blockers (what I need to do): None.
Found, not done: None.
Log (newest first, one line each):
- 2026-11-19: Implemented Zero-Touch User Workflow across CLAUDE.md, AGENT.md, GEMINI.md, SYNC.md, and added sync/check commands to sync scripts.
- 2026-11-19: Verified Cloud Console readiness, configured git author credentials, tested runtimes and web preview, and updated AGENT.md.
- 2026-11-18: Embedded Level 4 autonomy guidelines in CLAUDE.md/AGENT.md and simplified cross-device prompt in SYNC.md.
- 2026-11-18: Added cross-device sync scripts (sync.sh, sync.ps1) and SYNC.md.
- 2026-11-18: Added comments network status badge ("need network" / "WIFI needed"), freeze/unfreeze button on cube solving robot, and side-by-side camera scanner layout.
- 2026-11-18: Fixed Megaminx 3D dodecahedron geometry, face transforms, turn permutations, and solver.
- 2026-11-17: Added 100x100x100 cube solver and fixed white color on 3D guide cube in scanner.
- 2026-11-17: Implemented auto face memorization and slow 1.6s 3D cube rotation after snapping picture in scanner.
