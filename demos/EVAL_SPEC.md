# ODDWIN evaluation build — common spec (28/10/2026)

Every ODDWIN game gets an **evaluation build**: the same game, isolated in its own build profile, for B2B buyers who
open it through a private, invitation-only demo site (`https://demo.oddwinstudios.com/play/<slug>/`). Fictional
credits only: no deposits, no real money.

## Hard rules
1. **Backup first.** Before editing anything:
   `tar czf /Users/javiperezz7/Projects/_backups/<slug>-pre-eval-2026-10-28.tgz --exclude node_modules --exclude dist -C <game parent> <game folder>`
   Do not commit, stash, reset or discard anything in git repos; leave existing uncommitted changes exactly as they are.
2. **Isolation.** All evaluation features exist only when built with the evaluation flag (Vite `--mode eval` and/or
   `define`/`import.meta.env.VITE_EVAL`). The normal `npm run build` / dev / production profiles must be unchanged and must
   not contain the evaluation controls (check the production bundle with grep after building).
3. **Never change** RTP, probabilities, reel strips, pay tables, max win, rules, math version or the existing market
   profiles. Run the project's tests (`npm test` and any math check that is fast) before and after; they must pass the
   same way.
4. **No dev/QA surfaces in the eval build:** no `?seed=`, `?seq=`, `?capture=`, fixture loaders, debug overlays, QA
   hooks reachable by URL. Production-only, real RNG resolution.
5. **Base path.** Build to `/Users/javiperezz7/Projects/oddwin-web-v2/demos/builds/<slug>/` with Vite `base:
   '/play/<slug>/'`. Every asset (JS, CSS, fonts, images, audio, JSON, workers) must load under that prefix — grep the
   built files and the source for absolute `'/...'` runtime paths (fonts, art, audio, manifest) and fix them to use
   `import.meta.env.BASE_URL`. Verify by serving the parent folder so the game is reached at
   `http://127.0.0.1:<port>/play/<slug>/` (e.g. `python3 -m http.server <port> --directory
   /Users/javiperezz7/Projects/oddwin-web-v2/demos/builds/..` won't map; instead serve a temp dir where
   `play/<slug>` is a symlink to the build) and check there are zero 404s and zero console errors.
6. Add `<meta name="robots" content="noindex, nofollow">` to the eval build's HTML. No source maps in the eval build.
7. Fonts, art and audio are the game's own (OFL / generated); do not add third-party assets. Do not use vidIQ or any
   paid service.

## Evaluation profile
- **Balance:** 100,000.00 € fictional at start. A discreet **“Reset demo balance”** control restores it (confirm first).
- **Bets per spin:** a ladder that reaches **100 €** and includes **50 €** (for example 0.20 · 0.50 · 1 · 2 · 5 · 10 · 20 ·
  50 · 100 total bet; respect the game's line/coin structure — if bet is per line, make the *total* ladder reach 100 and
  include 50). Default bet: moderate (about 1 €).
- **Bonus buy:** if the game has a bonus buy that is implemented and validated by its math report, enable it in this
  profile at its real price (multiple of the total bet, so it can exceed 100 €). Always show the exact cost and ask for
  confirmation before buying.
- **“Preview feature”:** for each feature that cannot be bought (or when the game has no buy at all), add a selector that
  starts that feature directly so a buyer can see it without hundreds of spins. The feature must then resolve with the
  game's normal logic and RNG (no pre-picked wins, no fixed seeds). Never call it a purchase and never charge or show a
  price for it; label it clearly, e.g. a ribbon “PREVIEW · feature started manually · not a purchase”. Afterwards the
  player returns to the base game and can repeat the preview.
- **Visual distinction** between normal play, bought bonus and manual preview (a small, clear badge/ribbon is enough;
  keep the game's own design language).
- **Controls:** sound on/off, fullscreen, reset balance — discreet, in the game's style, working on desktop and mobile.
- **Numbers:** balances and wins must fit without clipping up to at least 100,000,000.00 € (max win × 100 € bet can be
  500,000 € or more). Check rounding to cents at 100 € bets and after buys.
- A small persistent label: “Evaluation build · fictional credits · no real money · 18+”.
- Language: English by default in the eval build (keep ES available if the game has it).

## Verification you must do
- `npm test` green; production build still builds and its bundle contains no eval controls.
- Eval build served under `/play/<slug>/`: no 404, no console errors; desktop 1920×1080 and mobile 390×844.
- Normal spin, bet change up/down to 100 €, buy (if any) with cost shown and balance debited correctly, each preview
  feature and return to base, reset balance, sound toggle, fullscreen toggle. Check a balance like 99,998,765.43 € fits.
- Look at screenshots yourself.

## Report back (concise)
Build path; features with buy (price) vs preview; bet ladder; what you changed (files); test results; screenshots paths;
any blocker or anything you could not make work (do not present it as ready).
