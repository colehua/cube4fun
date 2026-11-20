Status: COMPLETE
Goal / Definition of done:
1. Expand Game Mode in games.html from 8 games to 12 games:
   - Game 9: 🏗️ Cube Tower Stacker (Timing-based arcade layer stacker with slicing mechanics)
   - Game 10: 🔨 Whack-A-Cubie (3x3 speed reflex whack-a-mole with Golden Cubies & Bombs)
   - Game 11: 🪂 Flappy Cubie (Sky scramble flying cubie through Rubik's pillar gaps)
   - Game 12: 🃏 Scramble Match Pairs (4x4 speed memory card flip matching 8 cubing pairs)
2. Ensure every single game includes:
   - Dedicated Pause / Resume button with amber glow indicator
   - Game state preservation during pause
   - Keyboard controls (Space / Arrows / Numbers / P / Escape) + mobile touch controls
   - Web Audio synthesized retro sound FX
   - LocalStorage best score / best time persistence
   - Responsive CSS layouts
3. Verify all 12 games live in Chrome DevTools MCP (tab switching, start, pause, resume, zero console errors).
4. Stage, commit, and push changes to GitHub remote (origin/main).

Next step: Done.

Tasks:
- [x] Update PROGRESS.md to IN PROGRESS
- [x] Add CSS styling for Stacker, Whack-A-Cubie, Flappy Cubie, and Match Pairs
- [x] Add 4 new tab buttons in .game-tabs
- [x] Add 4 HTML game panels with headers, scoreboards, canvases/grids, and control buttons
- [x] Implement game loop & pause/resume logic for Cube Tower Stacker
- [x] Implement game loop & pause/resume logic for Whack-A-Cubie
- [x] Implement game loop & pause/resume logic for Flappy Cubie
- [x] Implement game loop & pause/resume logic for Scramble Match Pairs
- [x] Update switchGame() to auto-pause all 12 games
- [x] Update universal P / Escape keyboard listener for all 12 games
- [x] Verify live rendering and gameplay in Chrome DevTools MCP
- [x] Commit and push to origin/main

Assumptions:
- 12 comprehensive games provides a rich, varied arcade experience for both quick reflex and puzzle lovers.
- Full pause/resume with amber indicators and state preservation applies across all 12 games.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Pushed changes to GitHub remote (origin/main).
- Verified tab switching, game engines, and pause/resume states across all 12 games in Chrome DevTools MCP.
- Implemented Scramble Match Pairs with 4x4 interactive card flip grid, match chimes, timer, and pause controls.
- Implemented Flappy Cubie with canvas physics, fluttering wings, Rubik pillar obstacles, and pause controls.
- Implemented Whack-A-Cubie with 3x3 Rubik face holes, golden cubies, bombs, keyboard triggers 1-9, and pause controls.
- Implemented Cube Tower Stacker with canvas grid, block slicing, rising tones, and pause controls.
- Added CSS styles, 4 new tab buttons, and 4 game panels to games.html.
