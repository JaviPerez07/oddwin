# Asset permissions

How OddWin Studios obtains, records and publishes official game and studio imagery.

- **Register (generated):** [`REGISTER.md`](REGISTER.md), built from `src/data/assets.ts` with `npm run assets:report -- --md`. The unit tests fail if it's out of date.
- **Request drafts:** [`requests/`](requests/), one per provider, plus the shared [`_common-uses.md`](requests/_common-uses.md) annex.
- **Request log:** [`requests/LOG.md`](requests/LOG.md).

## Current state (2026-10-20)

- **0 approved assets. 0 files downloaded. 0 requests sent. 0 permissions received.**
- The provider websites could not be opened from the build environment (network policy, HTTP 403). All findings come from web-search results restricted to official domains. They are marked `search_snippet` and must be confirmed in a browser.
- Every provider whose terms were found (Pragmatic Play, Play'n GO, Evolution/NetEnt, and Evolution's terms covering Big Time Gaming's beta site) requires prior written consent to reproduce images or logos.
- Official asset portals (Pragmatic Client Hub, Evolution/NetEnt Client Area, Hacksaw and Relax client areas) appear to be customer-only.
- No provider was found to publish a licence that lets independent publishers or affiliates use game assets.

## Status meanings

| Status | Meaning | Displayed? |
| --- | --- | --- |
| `approved` | Written evidence covers the specific uses | Only if every display rule passes (below) |
| `permission_pending` | A route to permission exists or was requested; terms unclear or awaiting reply | No |
| `restricted` | The terms consulted don't allow the proposed use without further permission | No |
| `unknown` | No reliable conclusion (e.g. terms not found) | No |
| `not_found` | Resource not located | No |

Never set `approved` because an image is on a search engine or an official site, can be downloaded without an account, is used by other affiliate sites, was shared by a third party, or because we joined an affiliate programme.

## Display rules (enforced in `src/lib/assets.ts`)

An asset appears as official art on a surface only if **all** of these hold:

1. The status is `approved`, and `evidence` is filled (written permission, licence, or quoted terms).
2. `authorisedUses` covers the surface:
   - hero: `editorial` + `affiliate_pages`
   - catalogue card: also `catalogue`
   - studio logo: also `logo_reproduction`
3. `territories` is `"worldwide"`. We don't geolocate visitors, so a market-limited licence isn't enough.
4. The asset is not past `expiresAt` and has no `revoked` entry.
5. The file is local under `/public/art/licensed/`, its width and height are set, and it exists at build time.

Official art is always credited, with `attribution` if one is required, otherwise "© holder". It is cropped only if `modification` is authorised; otherwise it's shown whole. If the file fails to load at runtime, the plain typographic panel is shown instead. The site never hot-links or scrapes provider websites.

## When a permission arrives

1. Save the written permission outside the repo. It may contain personal data. Note its reference: sender role, date, subject.
2. Download the files from the channel the provider indicates. Store optimised copies (WebP/PNG/JPEG) at `public/art/licensed/<game-id>/<kind>.<ext>`.
3. Update the record in `src/data/assets.ts`:
   - `permission.status: "approved"`
   - `evidence` (type, reference, receivedAt, summary of what's allowed)
   - `authorisedUses`, `territories`, `attribution`, `expiresAt`
   - `localPath`, `width`, `height`, `alt`
   - `availability`, `sourceEvidence: "provided_by_rights_holder"`, `checkedAt`, `owner`
4. Run `npm run assets:report -- --md`, then `npm test`.
5. Fill in `requests/LOG.md`.

## Withdrawing an asset

Set `permission.revoked = { at, reason }`, or change the status, then rebuild. The asset disappears from every page, because cards, heroes and logos all read the same register. Delete the file when the licence requires it.
