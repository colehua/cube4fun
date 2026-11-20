Status: COMPLETE
Goal / Definition of done:
1. Make coins in the game:
   - Spawn real 3D spinning gold coins along the highway lanes in streams (3-5 coins), elevated jumping arcs, and diagonal zigzags.
   - Support rare golden Coin Bags (+10 💰).
   - Implement coin collision collection (+1 💰 on ground, elevated jump collection, 2X during hyper dash, audio chime, sparkle particles, floating popups).
2. Make the buttons smaller:
   - All buttons reduced to 20px height with 0.72em font size and 2px 7px padding.
   - Top bar reduced to 26px height; bottom deck reduced to 28px height.
3. Make the game bigger:
   - Container max-width expanded to 1780px, card padding reduced to 16px 12px.
   - Runner arena, canvas container, and canvas expanded to max-width 1720px (display area 1211px x 681px).
4. Verify live in Chrome DevTools MCP (0 console errors, coin spawning and collection confirmed, button heights 20px confirmed, canvas expansion confirmed).
5. Push changes to origin/main.

Next step: Done.

Tasks:
- [x] Implement 3D spinning gold coin renderer with gradient, 3D rim, and star emblem
- [x] Add coin spawner in runnerLoop with streams, elevated jump arcs, and coin bags
- [x] Implement coin collision collection with coin chime audio and golden star sparkles
- [x] Add 2X coin multiplier during hyper dash
- [x] Shrink control buttons to 20px height and slim down top/bottom bars to 26px/28px
- [x] Expand game stage card, container, and canvas max-width to 1720px/1780px
- [x] Verify in Chrome DevTools MCP with 0 console errors
- [x] Commit and push changes to origin/main

Assumptions:
- "make coins in the game" refers to collecting shiny gold coins on the highway while running in Cube Runner 3D.
- "make the buttons smaller and the game bigger" refers to reducing button heights/padding and expanding the game screen picture.

Blockers (what I need to do): None.

Found, not done: None.

Log (newest first, one line each):
- Verified 3D spinning coins, elevated jump collection, 20px button sizes, and expanded canvas in Chrome DevTools MCP.
- Added coin spawning patterns, coin audio, sparkle particles, smaller 20px buttons, and 1720px widescreen arena.
- Initialized coin mechanics, button shrinking, and game picture expansion task.
