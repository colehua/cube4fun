# Cube4Fun Development & Autonomous Agent Guidelines

## 1. Zero-Friction User Interaction (The Golden Rule)
The user only needs to mention what they want done (e.g. "Add 2x2 scramble timer", "Fix mobile navigation").
The AI agent MUST autonomously handle the complete lifecycle:
- Never require the user to ask for git pull, git push, or progress updates.
- Automatically execute the full 4-step loop below on EVERY prompt.

## 2. Autonomy: Always Operate at Level 4
Assume the user is away from the keyboard. Work end to end independently without waiting:
- **Perception:** Understand the full context before editing. Fix root causes, not symptoms.
- **Decision making:** Make reasonable engineering decisions toward the goal. Record assumptions in `PROGRESS.md`.
- **Never ask:** Do not ask questions or wait for approval. Decide, log in `PROGRESS.md`, and continue.
- **Agency:** Own the task through to a verified finish.

## 3. Mandatory 4-Step Auto-Sync Loop
On every user task prompt, execute these steps unconditionally:
1. **Pre-Sync:**
   - Run `git pull origin main`.
   - Read `PROGRESS.md` to get the latest status and context.
2. **Execute:**
   - Implement the requested task with clean, minimal, reversible edits.
   - **Recurring Refresh Check — Cole Hua BC Rankings (`bc-rankings.html`):**
     On every refresh or site-update prompt, check `https://www.speedcubingcanada.org/en/rankings` via `https://www.speedcubingcanada.org/api/province_rankings/{event}/bc/{0|1}` (`0` = Single, `1` = Average; query sequentially or in small batches of <= 4 to avoid connection timeouts) across WCA/SC events (`333`, `222`, `444`, `555`, `666`, `777`, `333bf`, `333fm`, `333oh`, `clock`, `minx`, `pyram`, `skewb`, `sq1`, `fto`, `444bf`, `555bf`, `333mbf`) for `wca_id === "2026HUAC01"` (`Cole Hua`).
     - Compare live `rank` and `time` values against `<script type="application/json" id="bc-rankings-snapshot">` inside `bc-rankings.html`.
     - **If any ranking or official result changed:** update the summary cards, standings table, `<script id="bc-rankings-snapshot">`, and prepend a new timestamped row (date/time with timezone, event, change status/delta, and recorded rankings) to `#changelog-tbody` in `bc-rankings.html`. Let the user know the updated page (`bc-rankings.html`) and what changed.
     - **If no ranking changed:** leave `bc-rankings.html` completely untouched (do not modify timestamps or HTML) and note "BC rankings checked: no changes" in `PROGRESS.md` log.
3. **Verify:**
   - Prove the change works (syntax checks, local web preview, or browser tests).
4. **Post-Sync:**
   - Update `PROGRESS.md` (Summary, How Verified, Status, Tasks, and Log).
   - Run `git add .`.
   - Run `git commit -m "<concise descriptive summary>"`.
   - Run `git push origin main`.

## 4. Single Source of Truth: PROGRESS.md
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

## 5. Communication Style (ASD-STE100, ~80% strict)
- Result first, then details.
- Short sentences in the active voice (~20 words max per instruction).
- Keep exact technical names, paths, and numbers.
- Never end with a question or open offer.
