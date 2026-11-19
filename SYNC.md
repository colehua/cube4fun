# Cross-Device Workflow and Auto-Sync Protocol

This document defines how to work seamlessly on **Cube4Fun** across different environments (Google Cloud Console, Windows PC, or any secondary computer) without losing progress or causing Git conflicts.

---

## 1. Directory Locations

| Environment | Repository Path | How to Open Editor |
| :--- | :--- | :--- |
| **Google Cloud Shell** | `/home/huazicheng/repos/cube4fun` | `cloudshell workspace ~/repos/cube4fun` |
| **Windows PC** | `C:\Users\S\OneDrive\repos\how-to-solve-rubiks-cube\cube4fun` | Open folder in VS Code or IDE |

> [!IMPORTANT]
> In Cloud Shell, the repository is located inside `~/repos/cube4fun`, **not** `~/cube4fun`.
> If you are inside the `cube4fun` directory, run `cloudshell workspace .` to open it in the editor.

---

## 2. Fast Commands with Helper Scripts

### On Google Cloud Shell (Linux)
Run `./sync.sh` from the `~/repos/cube4fun` folder:
- `./sync.sh pull` — Pulls latest changes from `origin main`.
- `./sync.sh push "commit message"` — Stages, commits, and pushes to `origin main`.
- `./sync.sh serve` — Starts Python web server on port 8080 (preview via Web Preview).
- `./sync.sh open` — Opens Cloud Shell Editor on this folder.
- `./sync.sh status` — Checks git status and recent commits.

### On Windows PC (PowerShell)
Run `.\sync.ps1` from the `cube4fun` folder:
- `.\sync.ps1 pull` — Pulls latest changes from `origin main`.
- `.\sync.ps1 push "commit message"` — Stages, commits, and pushes to `origin main`.
- `.\sync.ps1 serve` — Starts Python web server on port 8080.
- `.\sync.ps1 status` — Checks git status and recent commits.

---

## 3. The Universal Agent Prompt

Whenever you start an AI session (in Google Cloud Console Gemini, Claude Code, or Antigravity) on **any machine**, paste this prompt at the beginning of your instruction. The AI will automatically sync Git first, read current status, complete your request, verify it, update `PROGRESS.md`, and push back to GitHub:

```text
You are an autonomous senior engineer working on the "Cube4Fun" project in this repository.

Always follow this exact workflow before and after any task:

[STEP 1 - PRE-SYNC]
1. Check environment and run: git pull origin main
2. Read PROGRESS.md to inspect current status, recent changes, and project context.

[STEP 2 - EXECUTION]
3. Implement the requested task accurately according to the instructions.
4. Keep all changes clean, minimal, and reversible.

[STEP 3 - VERIFICATION]
5. Verify the changes (e.g. static inspection, browser test or dry-run).

[STEP 4 - POST-SYNC]
6. Update PROGRESS.md with:
   - What changed
   - How verified
   - Status, Tasks, and new log entry
7. Stage all modified and new files: git add .
8. Commit with a concise descriptive message: git commit -m "..."
9. Push to GitHub: git push origin main

My task for you today is:
<TYPE YOUR TASK HERE>
```

---

## 4. Single Source of Truth: `PROGRESS.md`

`PROGRESS.md` records:
- The current status (`IN PROGRESS` | `COMPLETE` | `BLOCKED`)
- Recent completed tasks and verification details
- Pending tasks
- Assumptions and change log

Every AI session must read `PROGRESS.md` at step 1 and update it before pushing at step 4.
