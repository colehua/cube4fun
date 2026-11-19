# Summary
- **What changed**:
  1. **Cross-Device Workflow & Synchronization Support**:
     - Added [sync.sh](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/sync.sh): Bash automation script for Google Cloud Shell / Linux supporting `pull`, `push`, `status`, `serve`, and `open`.
     - Added [sync.ps1](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/sync.ps1): PowerShell automation script for Windows supporting `pull`, `push`, `status`, and `serve`.
     - Added [SYNC.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/SYNC.md): Complete cross-device guide documenting paths in Cloud Shell (`~/repos/cube4fun`), editor opening (`cloudshell workspace .`), and the Universal Agent Prompt.
  2. **Comments Section Network Status Indicator ("need network" / "WIFI needed")**:
     - Added `#comment-network-badge` in comments header and `#comment-network-note` below post button in [index.html](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/index.html).
  3. **Freeze / Unfreeze Button on Cube Solving Robot**:
     - Added `#btn-freeze-cube` (`❄️ Freeze Cube` / `🧊 Unfreeze Cube`) in [cube-solving-machine.html](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/cube-solving-machine.html).
  4. **Camera Scanner Layout Side-by-Side View**:
     - Redesigned `#camera-scanner-modal` using a responsive 2-column grid (`.scanner-content-grid`).
- **How verified**:
  - Ran `.\sync.ps1 status` in PowerShell: verified branch `main`, repo directory detection, and recent commit history.
  - Inspected `sync.sh` syntax and permissions.
  - Verified `SYNC.md` directory paths match Cloud Shell environment (`/home/huazicheng/repos/cube4fun`).
- **What to review**:
  - Review [SYNC.md](file:///C:/Users/S/OneDrive/repos/how-to-solve-rubiks-cube/cube4fun/SYNC.md) for cross-device usage instructions and the universal agent prompt.
  - Run `git pull origin main` in Google Cloud Shell to pull these new scripts.
- **Blockers**: None.

Status: COMPLETE
Goal / Definition of done:
1. Provide exact reason and fix for Cloud Shell path mismatch (`~/repos/cube4fun` vs `~/cube4fun`).
2. Provide reusable cross-device sync scripts (`sync.sh`, `sync.ps1`).
3. Create `SYNC.md` with instructions and Universal Agent Prompt for seamless handoff between Google Cloud Console and any PC.
4. Commit and push all changes to origin main.

Next step: Done.

Tasks:
- [x] Create sync.sh for Linux / Google Cloud Shell
- [x] Create sync.ps1 for Windows PowerShell
- [x] Create SYNC.md with cross-device workflow and Universal Agent Prompt
- [x] Update PROGRESS.md
- [x] Commit and push changes to origin main

Assumptions:
- In Google Cloud Shell, repo is cloned into `/home/huazicheng/repos/cube4fun`.

Blockers (what I need to do): None.
Found, not done: None.
Log (newest first, one line each):
- 2026-11-18: Added cross-device sync scripts (sync.sh, sync.ps1) and SYNC.md with universal auto-sync agent prompt.
- 2026-11-18: Added comments network status badge ("need network" / "WIFI needed"), freeze/unfreeze button on cube solving robot, and side-by-side camera scanner layout.
- 2026-11-18: Fixed Megaminx 3D dodecahedron geometry, face transforms, turn permutations, and solver.
- 2026-11-17: Added 100x100x100 cube solver and fixed white color on 3D guide cube in scanner.
- 2026-11-17: Implemented auto face memorization and slow 1.6s 3D cube rotation after snapping picture in scanner.
