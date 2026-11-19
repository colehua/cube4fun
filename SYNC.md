# Cross-Device Workflow and Auto-Sync Protocol

This document defines how to work on **Cube4Fun** across different environments (Google Cloud Console, Windows PC, or any secondary computer) without losing progress or causing Git conflicts.

---

## 1. Directory Locations

| Environment | Repository Path | How to Open Editor |
| :--- | :--- | :--- |
| **Google Cloud Shell** | `/home/huazicheng/repos/cube4fun` | `cloudshell workspace ~/repos/cube4fun` |
| **Windows PC** | `C:\Users\S\OneDrive\repos\how-to-solve-rubiks-cube\cube4fun` | Open folder in IDE |

---

## 2. Zero-Friction Prompting (Default)

`CLAUDE.md`, `AGENT.md`, and `GEMINI.md` are stored directly in the repository root. Any AI assistant reads these files automatically upon startup.

You only need to state what you want done:

```text
<YOUR TASK HERE>
```

### Examples
- `Fix mobile modal scrolling on trainer.html`
- `Add 2x2 scramble display to practice-speed.html`
- `Update home page schedule for next week`

### What the AI Assistant Does Autonomously
1. **Pre-Sync**: Runs `git pull origin main` and reads `PROGRESS.md`.
2. **Execute**: Makes clean, verified changes to the codebase.
3. **Verify**: Runs syntax checks, local web preview, and validates files.
4. **Post-Sync**: Updates `PROGRESS.md`, commits with a descriptive message, and runs `git push origin main`.

### Explicit Fallback Prompt (For Basic AI Models)
If using an assistant that does not load repository instructions automatically, paste:
```text
Run `git pull origin main`, read CLAUDE.md and PROGRESS.md, then autonomously complete this task:
<YOUR TASK HERE>
When done, verify the work, update PROGRESS.md, and run `git add . && git commit -m "..." && git push origin main`.
```

---

## 3. Fast Commands

### Google Cloud Shell (Linux)
- `./sync.sh check` — Verifies Git identity, GitHub CLI, Python, Node, and Cloud Shell tools.
- `./sync.sh sync "message"` — Full auto-sync: pulls, stages, commits, and pushes in one step.
- `./sync.sh pull` — Pulls latest code from `origin main`.
- `./sync.sh push "commit message"` — Stages, commits, and pushes.
- `./sync.sh serve` — Starts web server on port 8080.
- `./sync.sh open` — Opens Cloud Shell Editor on this folder.

### Windows PC (PowerShell)
- `.\sync.ps1 check` — Verifies environment readiness.
- `.\sync.ps1 sync "message"` — Full auto-sync: pulls, stages, commits, and pushes in one step.
- `.\sync.ps1 pull` — Pulls latest code from `origin main`.
- `.\sync.ps1 push "commit message"` — Stages, commits, and pushes.
- `.\sync.ps1 serve` — Starts web server on port 8080.
