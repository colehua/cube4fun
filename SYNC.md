# Cross-Device Workflow and Auto-Sync Protocol

This document defines how to work on **Cube4Fun** across different environments (Google Cloud Console, Windows PC, or any secondary computer) without losing progress or causing Git conflicts.

---

## 1. Directory Locations

| Environment | Repository Path | How to Open Editor |
| :--- | :--- | :--- |
| **Google Cloud Shell** | `/home/huazicheng/repos/cube4fun` | `cloudshell workspace ~/repos/cube4fun` |
| **Windows PC** | `C:\Users\S\OneDrive\repos\how-to-solve-rubiks-cube\cube4fun` | Open folder in IDE |

---

## 2. Universal Short Prompt (Use This Every Day)

Paste this single prompt into your AI assistant in Cloud Shell or any computer:

```text
Run `git pull origin main`, read CLAUDE.md and PROGRESS.md, then autonomously complete this task:
<YOUR TASK HERE>
When done, verify the work, update PROGRESS.md, and run `git add . && git commit -m "..." && git push origin main`.
```

Why this works everywhere:
- **No hardcoded updates:** The assistant reads `PROGRESS.md` dynamically to see recent work.
- **Rules travel with Git:** `CLAUDE.md` contains Level 4 autonomy, auto-sync rules, and verification standards directly inside the repository.
- **Cross-device ready:** Automatically pulls before working and pushes after working.

---

## 3. Fast Commands

### Google Cloud Shell (Linux)
- `./sync.sh pull` — Pulls latest code.
- `./sync.sh push "commit message"` — Stages, commits, and pushes.
- `./sync.sh serve` — Starts web server on port 8080.
- `./sync.sh open` — Opens Cloud Shell Editor on this folder.

### Windows PC (PowerShell)
- `.\sync.ps1 pull` — Pulls latest code.
- `.\sync.ps1 push "commit message"` — Stages, commits, and pushes.
- `.\sync.ps1 serve` — Starts web server on port 8080.
