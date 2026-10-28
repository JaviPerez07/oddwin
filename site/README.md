# oddwinstudios.com · v2 (B2B)

Static site generated with Node (no dependencies). Direction A, "Release Slate": ODDWIN gold, Archivo wide for headings,
and one room per game in that game's own identity.

**Live on oddwinstudios.com** (Worker `oddwin-web`). The previous Next.js site (`~/Projects/oddwin-studios-web`, Worker `oddwin`) is retired but kept for rollback.

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
- **Demo request form:** posts to `/api/demo-request` (`worker/demo-request.js`): server-side validation, honeypot +
  minimum fill time, rate limits, idempotency key, a copy in KV (`REQUESTS`) and a notification to the team through
  Zoho SMTP (`worker/smtp.js`, authenticated as our own mailbox, visitor in Reply-To). Secrets: `SMTP_USER`,
  `SMTP_PASS`, `NOTIFY_TO`, `IP_SALT` (`npx wrangler secret put …`). Without SMTP secrets the request is still stored
  and the visitor is asked to email partnership@ too.
- **Private demos:** `../demos/` (demo.oddwinstudios.com, invitation-only Worker) — procedure in `../demos/README.md`.
- **Fact sheets:** `node tools/factsheets.mjs` prints `static/docs/<slug>-factsheet.pdf` from `data/games.mjs`.
- **Every film is real gameplay in English**, captured frame by frame with a virtual clock (no dropped frames, however
  busy the machine is): `../capture/` holds the scripts (`run_all.sh`, `capture_showcase.mjs`, `capture_pb.mjs`) and
  `cut_loops.mjs`, which cuts the loops and the home reel into `static/media/`.
- **Trailer button:** it only appears if the game has an English cut (AURA and PAGE BREAKER today). The others say
  "English trailer in production".

## Pending before publishing

1. Legal data (company name, tax ID, address) in `data/site.mjs`; `--release` blocks until it is there.
2. English trailers for OBSIDIAN and VICE (oddwin-cinematics); the loops are already clean English captures. PAGE BREAKER's English cut is built by `page-breaker/trailer/film/tools/make_en.py`.
3. Bar & Cigar and Frutiger Eden: written permission, figures and footage from their owner (today: "material pending").
4. One-page fact sheets in PDF (`static/docs/`).
5. The partner portal (private builds and PAR sheets): Cloudflare Access by email, a later phase.

## Deployment (live since 27/10/2026)

`oddwinstudios.com` and `www` are served by the Worker **`oddwin-web`** with static assets (`wrangler.jsonc`):

```bash
node generate-site.mjs && npx wrangler deploy
```

- `worker.js` adds the host-level 301s that `_redirects` cannot express (http → https, www → apex, `.html` → clean URL);
  `_redirects` (retired routes) and `_headers` (CSP, cache) in `dist/` apply as usual.
- Custom domains belong to the Worker, which also creates their DNS records. The old Next.js Worker `oddwin` is still
  in the account, without domains: to roll back, move both custom domains back to it.
- `oddwin-web.pages.dev` (a Pages project with the same build) answers with `X-Robots-Tag: noindex`.
- Once the legal data is in, deploy with `node generate-site.mjs --release && npx wrangler deploy`.
- Pending: submit `https://oddwinstudios.com/sitemap.xml` in Search Console.
