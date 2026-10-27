# oddwinstudios.com · v2 (B2B)

Static site generated with Node (no dependencies). Direction A, "Release Slate": ODDWIN gold, Archivo wide for headings,
and one room per game in that game's own identity.

**Nothing is published.** The live site is still `~/Projects/oddwin-studios-web` (Next.js on the Worker `oddwin`).

## Commands

```bash
node generate-site.mjs            # → dist/ (draft: missing legal data shows as gaps)
node generate-site.mjs --release  # fails if the legal data in data/site.mjs is incomplete
node serve.mjs                    # dist/ on http://localhost:5310 with clean URLs, _redirects, _headers and 404
node qa/qa.mjs                    # overlaps, clipping, horizontal scroll, console/CSP errors, 301s → qa/shots/
```

The generator also checks every local link and asset, that no file exceeds 25 MiB (the Pages limit), and that there is no
inline style or script (the CSP forbids them).

## Where to change things

| What | Where |
|---|---|
| Figures, copy, loops and kit for each game | `data/games.mjs` (the source of each figure is in `source`) |
| Email, legal data, menu, retired routes (301) | `data/site.mjs` |
| Home · game rooms · legal, privacy, 404 | `src/home.mjs` · `src/room.mjs` · `src/pages.mjs` |
| Shared head, header and footer | `src/layout.mjs` |
| Brand · home · each room | `static/css/oddwin.css` · `home.css` · `rooms/<room>.css` |
| Loops (≤ 1 MB, no audio) and trailers | `static/media/` · `static/video/` |
| Public fact sheets | `static/docs/<slug>-factsheet.pdf` (linked automatically once the file exists) |

Never edit `dist/`: it is rebuilt on every run.

## Decisions

- **Clean URLs:** `games/aura.html` is served as `/games/aura`; the canonical has no `www` and no `.html`.
- **Fonts are self-hosted** and subset (OFL, see `static/fonts/LICENSES.txt`). There are no requests to third
  parties, no cookies and no analytics, which is what `/privacy` says.
- **Contact without a server:** the form opens an email to partnership@ with the fields filled in. To receive requests
  on the web instead, add a Pages Function (for example with Resend) and update `/privacy`.
- **Every film is real gameplay in English**, captured frame by frame with a virtual clock (no dropped frames, however
  busy the machine is): `../capture/` holds the scripts (`run_all.sh`, `capture_showcase.mjs`, `capture_pb.mjs`) and
  `cut_loops.mjs`, which cuts the loops and the home reel into `static/media/`.
- **Trailer button:** it only appears if the game has an English cut (AURA today). The others say
  "English trailer in production".

## Pending before publishing

1. Legal data (company name, tax ID, address) in `data/site.mjs`; `--release` blocks until it is there.
2. English trailers for PAGE BREAKER, OBSIDIAN and VICE (oddwin-cinematics); the loops are already clean English captures.
3. Bar & Cigar and Frutiger Eden: written permission, figures and footage from their owner (today: "material pending").
4. One-page fact sheets in PDF (`static/docs/`).
5. The partner portal (private builds and PAR sheets): Cloudflare Access by email, a later phase.

## Deployment (when approved; nothing has been run)

1. Create a Cloudflare Pages project with build `node generate-site.mjs --release` and output `dist`.
2. Check it on the `*.pages.dev` URL with `BASE=https://… node qa/qa.mjs`.
3. Move `oddwinstudios.com` off the Worker `oddwin` (remove its routes in `wrangler.jsonc` or in the dashboard) onto the
   Pages project.
4. In Cloudflare: Always Use HTTPS, plus a 301 redirect rule from `www.oddwinstudios.com/*` to `https://oddwinstudios.com/$1`.
   (`_redirects` cannot filter by host; it only carries the retired routes.)
5. Submit `sitemap.xml` in Search Console.
