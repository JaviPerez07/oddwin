# OddWin Studios — slot reviews, mechanics and demos

An independent slot-review and discovery site by **OddWin Studios** (brand configured in `src/config/site.ts`).
Dark, game-product interface; reviews that explain how each game is built; every figure marked with its
verification status; an affiliate layer that is built and tested but contains **no real offers**.

![Home](docs/screenshots/home-desktop.jpg)

## Run it

Requirements: Node 20.9+ (tested on Node 22), npm.

```bash
npm ci
cp .env.example .env.local   # optional; every variable has a safe default
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve (set `SITE_ENV=production` when deploying) |
| `npm run lint` | ESLint (Next.js config) |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm run build:e2e` | Two production builds for tests: `.next-e2e-prod` (SITE_ENV=production) and `.next-e2e-fixtures` (dev fixtures on) |
| `npm run test:e2e` | Playwright suite against both builds (starts `next start` on :3100 and :3101) |
| `npm test` | `build:e2e` + `test:e2e` |
| `npm run check:dev` | Reports dev-overlay issues for key pages (needs `npm run dev`) |
| `npm run assets:report` | Asset register summary; `-- --md` regenerates `docs/asset-permissions/REGISTER.md`, `-- --check` verifies it |

Playwright is pinned to **1.56.1** to match the Chromium build preinstalled in this environment
(`/opt/pw-browsers`). Elsewhere, run `npx playwright install chromium` once.

## Stack and why

| Dependency | Purpose |
| --- | --- |
| Next.js 16 (App Router, Turbopack) | Static generation of every review, metadata API, sitemap/robots, route handler for `/go` |
| React 19, TypeScript (strict) | UI and typed content model |
| Tailwind CSS 4 | Design tokens (`src/app/globals.css`) and styling |
| radix-ui | Accessible primitives behind the shadcn-pattern components in `src/components/ui` (dialog, popover) |
| motion | Layout transitions when catalogue filters change — honours reduced motion |
| lucide-react | A handful of interface icons |
| clsx, tailwind-merge, class-variance-authority | Class composition for components |
| Archivo, IBM Plex Mono (Fontsource, OFL-1.1) | Self-hosted fonts in `src/fonts` — no font CDN at build time |
| @playwright/test | End-to-end and unit tests |

No database or CMS yet: content is typed TypeScript in `src/data`, read only through the async access layer in
`src/lib/data/index.ts`, so swapping in a database/CMS later touches one module. Payload CMS was evaluated and
deferred: it adds a database and admin surface the MVP doesn't need yet.

## Routes

`/` · `/slots` (search + filters, URL-synced) · `/slots/[slug]` · `/providers` · `/providers/[slug]` · `/casinos` ·
`/casinos/[slug]` · `/markets/[country]` · `/about` · `/methodology` · `/responsible-gambling` · `/affiliate-disclosure` ·
`/privacy` · `/terms` · `/contact` · `/go/[offerId]` (redirect) · `/sitemap.xml` · `/robots.txt`.

## Content and verification model

Every factual field is a `Fact<T>` with a status (`verified | pending | conflicting | unsourced`) and source IDs;
every slot carries `SourceRecord`s (URL, fields covered, date consulted, result, trust level, editor note).

- **Current state: nothing is verified.** The build environment's network policy blocked provider and regulator
  sites, so figures are leads: URLs/snippets from a search index restricted to official domains, or editor notes.
  They render with an amber marker, and every review is `pending_review`.
- `lib/validation.ts` refuses to publish a slot unless RTP, volatility and max win are verified by a confirmed
  primary/secondary source. Unpublished reviews are visible but `noindex` and excluded from the sitemap.
- Conflicting leads (e.g. two official BTG pages disagreeing on Bonanza's RTP) are withheld, not averaged.
- Demo links follow a four-state model; only `verified` and `official_site_only` render a button. None qualify yet.

To verify a game: open each source, update `result: "confirmed"`, `trust: "primary"`, `consultedAt`, set the
fact's `status: "verified"`, then `reviewedAt` and `publicationStatus: "published"`. `npm test` fails if a
published review is missing verified core facts.

## Artwork and the asset register

All official imagery (key art, thumbnails, game logos, screenshots, promo material, studio logos) is governed by the
register in `src/data/assets.ts`. Each record holds:
- source and evidence type, holder and availability
- terms URL and permission status (`approved | permission_pending | restricted | unknown | not_found`)
- documented evidence, authorised uses, territories, required attribution and expiry or revocation
- next review date, owner and notes

Everything lives in **[`docs/asset-permissions/`](docs/asset-permissions/README.md)**:
- [`REGISTER.md`](docs/asset-permissions/REGISTER.md), generated with `npm run assets:report -- --md` (the tests fail if it's stale)
- per-provider request drafts, plus a request log

**Current state:** 0 approved assets, 0 files, 0 requests sent. Provider sites were not reachable from the build
environment; the terms found require written consent.

Display is decided per surface by `lib/assets.ts#canDisplay`:
- hero, catalogue card or studio logo, each needing its own authorised uses
- worldwide territory, not expired or revoked
- a local file under `public/art/licensed/` that exists

Catalogue and review pages read the same register. Official art is always credited and only cropped when
modification is authorised. If a file fails at runtime, the plain typographic panel replaces it. Without approved art, a
game is shown as a plain panel (name, studio, colour hairline, conceptual mechanic glyph); our own diagrams are labelled
as such.

The fixtures build adds fictional approved assets: grey test patterns generated by `scripts/make-test-assets.mjs`, which
is git-ignored. They exercise every rule end to end (`tests/assets.spec.ts`).

## Figures on prominent surfaces

Only **verified** figures appear on the homepage feature, cards, catalogue, sort and filters, and in a review's key
figures. Unverified leads are shown in the review's technical file, labelled "Lead", with their status and sources.
The RTP sort and volatility filter appear automatically once verified values exist.

## Dev diagnostics

`npm run check:dev` (with `npm run dev` running) loads key pages on desktop and mobile and queries Next's dev
diagnostics endpoint for the errors behind the dev overlay's "Issues" badge; it exits non-zero if any exist.

## Affiliate layer (built, no real offers)

- `data/casinos.ts` and `data/offers.ts` are intentionally empty. Fictional `example.com` fixtures in
  `data/fixtures` load only when `AFFILIATE_TEST_FIXTURES=1` **and** `SITE_ENV` is not `production`.
- `lib/eligibility.ts` is the single rule set (approval, verification date, expiry, market, operator licence per
  market, verified market record, traffic source, permitted domain, HTTPS + host allow-list). It runs at render
  time and again at click time.
- `/go/[offerId]?market=xx` resolves only stored offers, never accepts a destination from the request, logs
  offer/market/time only (no IP, no user agent), and returns `noindex` headers.

### Before any real offer goes live
1. Verify each market record against the regulator's live pages (currently all `pending`).
2. Get written approval from the affiliate programme, including this domain as an approved traffic source.
3. Verify the operator's licence on the regulator's register for each market; record entity, number, date.
4. Paste the exact tracking URL issued by the programme; add its host to `allowedDestinationHosts`.
5. Check local rules on what may be shown (e.g. Ontario restricts advertising inducements), then legal review of
   `/privacy`, `/terms` and `/affiliate-disclosure` (currently marked as drafts).

## Environment variables

See `.env.example`. `SITE_ENV=production` must be set in production: it hard-disables fixtures and enables
indexing in `robots.txt` (all other environments disallow crawling). Analytics is off unless
`NEXT_PUBLIC_ANALYTICS_ENDPOINT` is set, and then only sends after consent; no cookies are used.

## Deploying

Any Node host or Vercel works: `npm ci && npm run build && npm start` with `SITE_ENV=production` and
`NEXT_PUBLIC_SITE_URL=https://your-domain`. Not deployed from this session (no hosting credentials available).
