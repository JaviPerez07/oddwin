#!/bin/zsh
# Clean English captures for the website (all frame-stepped). Dev servers: PB :5295, Obsidian :5280, Vice :5260, Aura :5173.
cd "$(dirname "$0")"
for s in reveal rip fight fs; do node capture_pb.mjs $s; done
for f in hold_big fs_epic; do node capture_showcase.mjs 5280 $f clips/obs_$f.mp4; done
for f in collect hold_big fs_epic; do node capture_showcase.mjs 5260 $f clips/vice_$f.mp4; done
A=/Users/javiperezz7/Projects/aura/03_juego/codigo/game
for seed in 9603 47388 7757; do (cd $A && node scripts/capture_game.mjs "http://127.0.0.1:5173/?capture=1&seed=$seed&lang=en&res=1.5" /Users/javiperezz7/Projects/oddwin-web-v2/capture/clips/aura_$seed.mp4 1 1.5); done
echo DONE
