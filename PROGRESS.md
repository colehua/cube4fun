Status: COMPLETE
Goal / Definition of done:
1. Implement Armed Gun Monsters in Cube Runner 3D:
   - Armed Gun Monster entity (`gun_monster`) with cybernetic armor, dual blaster guns, and laser sight.
   - Guns shoot forward down the highway towards the player with animated plasma bullets and muzzle flashes.
   - Bullets cannot shoot or damage the player if jumping in the air (harmlessly pass underneath with "💨 AIR DODGE!").
   - Gun Monsters have heavy bulletproof armor deflecting normal lasers; player must kill them by jumping on them with complex moves (Jump-Stomp or Jump + S Aerial Dive-Stomp).
   - Killing an Armed Gun Monster rewards +50 coins (saved persistently to wallet) with explosive fanfare.
2. Verified live in Chrome DevTools MCP (bullet dodging while jumping, bullet hit while grounded, jump-stomp kill giving +50 coins, laser deflection).
3. Committed and pushed changes to GitHub remote `origin/main`.

Next step: Completed and pushed to origin main.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Add `runnerMonsterBullets` and `runnerIsDiveStomping` state variables
- [x] Implement `gun_monster` spawning and gun firing logic (shoots forward down track)
- [x] Implement bullet flight and air-dodge immunity (bullets cannot hit player when jumping in the air)
- [x] Implement heavy armor laser deflection on gun monsters
- [x] Implement complex move jump-stomp kill (Jump + S Dive-Stomp / Jump-Stomp) awarding +50 coins
- [x] Render 3D Gun Monster with dual cannons, muzzle flashes, and bullets on canvas
- [x] Update controls guide banner with Gun Monster and Air Dodge instructions
- [x] Verify live in Chrome DevTools MCP
- [x] Commit and push to origin main

Assumptions:
- "shoot 1m forwards" means high-speed plasma blasts shot down the highway lane towards the player.
- "complex moves" means jumping directly onto the monster's head and the mid-air Jump + Slide Aerial Dive-Stomp combo.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified all Armed Gun Monster mechanics live in Chrome DevTools MCP and pushed to origin main.
- Implemented Armed Gun Monster, forward bullets, air-dodge immunity, complex jump-stomp moves, and +50 coins reward.
- Initialized Armed Gun Monster (+50 coins, jump stomp, bullet air dodge) task.
