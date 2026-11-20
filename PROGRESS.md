Status: COMPLETE
Goal / Definition of done:
1. 100-Coin Revival System upon Death:
   - When the player dies in Cube Runner (or Flappy Cubie), a prominent glowing Revive button ("❤️ Revive with 100 Coins (100 💰) [Press R]") appears alongside the restart button.
   - Global / persistent coin wallet (`cube_arcade_coins` in localStorage) preserves collected coins across runs.
   - If player has >= 100 coins, clicking Revive or pressing 'R':
     - Deducts exactly 100 coins from the wallet
     - Plays uplifting revival sound fanfare (`playSfx('revive')`)
     - Clears hazards in front of the player (safe zone)
     - Grants a temporary invulnerability forcefield shield (~2.5s) with glowing animated aura that absorbs collisions and zaps hazards
     - Resumes the active run with score and distance preserved
   - If player has < 100 coins, button displays "❤️ Need 100 💰 to Revive (X/100)" and clicking shows instructions to blast monsters for more coins (+10 💰 per kill).
2. Keyboard shortcut 'R' wired for fast revival on game over screen.
3. Verified in Chrome DevTools MCP with automated testing (100% pass rate).
4. Changes committed and pushed to GitHub remote `origin/main`.

Next step: Completed.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Add persistent coin wallet system (`cube_arcade_coins` in localStorage)
- [x] Add synthesized Web Audio revival sound effect (`revive`)
- [x] Add revive UI button (`.btn-game-revive`) and canvas death overlay
- [x] Implement `reviveRunnerWithCoins()`: deducts 100 coins, grants invulnerability shield, clears nearby threats, and resumes game loop
- [x] Implement invulnerability shield aura rendering and collision absorption in `runnerLoop()`
- [x] Add `reviveFlappyWithCoins()` for Flappy Cubie
- [x] Add universal keyboard shortcut 'R' for revival
- [x] Verify live gameplay, death, revive deduction, shield invulnerability, and insufficient coins handling
- [x] Commit and push to origin main

Assumptions:
- 100 coins can be accumulated from monster kills across runs via localStorage wallet.
- Reviving costs 100 coins, clears hazards in front of the player, and gives a 2.5-second glowing shield.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Completed live verification in Chrome DevTools MCP and pushed to origin main.
- Implemented 100-coin revival system, invulnerability forcefield shield, and 'R' shortcut.
