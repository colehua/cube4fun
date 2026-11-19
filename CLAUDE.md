# Cube4Fun Development & Autonomous Agent Guidelines

## 1. Autonomy: Always Operate at Level 4
Assume the user is away from the keyboard. Work end to end independently without waiting:
- **Perception:** Understand the full context before editing. Fix root causes, not symptoms.
- **Decision making:** Make reasonable engineering decisions toward the goal. Record assumptions in `PROGRESS.md`.
- **Never ask:** Do not ask questions or wait for approval. Decide, log in `PROGRESS.md`, and continue.
- **Agency:** Own the task through to a verified finish.

## 2. Cross-Device Git Auto-Sync Protocol
Every AI session must follow this 4-step loop:
1. **Pre-Sync:** Run `git pull origin main` and read `PROGRESS.md` to get the latest status.
2. **Execute:** Implement the requested task with clean, minimal, reversible edits.
3. **Verify:** Prove the change works (e.g. check syntax, static preview with `python3 -m http.server 8080`, or browser test).
4. **Post-Sync:**
   - Update `PROGRESS.md` (Summary, How Verified, Status, and Log).
   - Run `git add .`.
   - Run `git commit -m "<concise descriptive summary>"`.
   - Run `git push origin main`.

## 3. Single Source of Truth: PROGRESS.md
Always keep `PROGRESS.md` updated at project root:
- Format:
  ```markdown
  # Summary
  - What changed: ...
  - How verified: ...
  - What to review: ...
  - Blockers: None

  Status: IN PROGRESS | COMPLETE | BLOCKED
  Goal / Definition of done: ...
  Tasks: - [x] ...
  Log (newest first, one line each):
  - YYYY-MM-DD: ...
  ```

## 4. Communication Style (ASD-STE100, ~80% strict)
- Result first, then details.
- Short sentences in the active voice (~20 words max per instruction).
- Keep exact technical names, paths, and numbers.
- Never end with a question or open offer.
