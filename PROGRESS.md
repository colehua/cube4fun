Status: COMPLETE
Goal / Definition of done:
1. Restrict jumping ON monsters to shooting monsters only:
   - Shooting monsters (`gun_monster`): Can be jumped on (aerial jump / dive stomp) to crush for +50 💰.
   - Normal monsters (`monster`): CANNOT be jumped on! Attempting to land on or dive-stomp normal monsters does NOT crush them; normal monsters must be shot down with lasers (🔥 SHOOT).
2. Allow jumping OVER anything that is 1 block tall:
   - Hurdles (`hurdle`): 1 block tall, jump over safely when `runnerIsJumping && runnerJumpY >= 12`.
   - 1-block Rubik Cubes (`barrier` with `blocksTall: 1`): 1 block tall, jump over safely when `runnerIsJumping && runnerJumpY >= 14`.
   - 1-block Mini Monsters (25 HP Imp): 1 block tall, player can leap OVER it safely when `runnerIsJumping && runnerJumpY >= 20` without crushing it.
   - 2-block walls and 2-block/3-block monsters (50 HP, 100 HP): Too tall to jump over; must avoid or shoot down.
3. Updated 3D canvas visuals to indicate 1-block vs multi-block heights and jump-stomp targets.
4. Verified live in Chrome DevTools MCP with 0 errors.
5. Git commit and push changes to GitHub remote `origin/main`.

Next step: Done.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Remove jump-stomp crush from normal monsters (only gun monsters can be jumped on)
- [x] Implement jump-over clearance for all 1-block tall obstacles (hurdles, 1-block cubes, 25 HP 1-block imps)
- [x] Update obstacle rendering with 1-block vs 2-block height indicators
- [x] Update instructions and status text
- [x] Verify live in Chrome DevTools MCP
- [x] Commit and push to origin main

Assumptions:
- "jump on" means crushing from above (stomp attack).
- "jump over" means clearing the obstacle through the air without touching it.
- 1 block tall includes hurdles, 1-block cube barriers, and 1-block (25 HP) imps.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified all 6 collision scenarios in Chrome DevTools MCP (gun monster stomp, normal monster fatal, jump over hurdle/cube/imp, 2-block wall fatal).
- Implemented jump-on shooting monsters only and jump-over 1-block obstacles.
- Initialized jump-on shooting monsters only and jump-over 1-block obstacles task.
