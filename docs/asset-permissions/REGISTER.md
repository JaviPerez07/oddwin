# Asset permission register

Generated from `src/data/assets.ts` by `npm run assets:report -- --md`. Do not edit by hand.

- Last check: **2026-10-20** · next review: **2026-11-19**
- Evidence base: web-search results restricted to official domains. Provider websites could not be opened from the build environment (network policy, HTTP 403), so no page was inspected directly and **no file has been downloaded**.
- Requests: drafted in `docs/asset-permissions/requests/` — **none has been sent**; **no permission has been granted**.

## Summary

| Status | Records |
| --- | --- |
| `approved` | 0 |
| `permission_pending` | 4 |
| `restricted` | 5 |
| `unknown` | 0 |
| `not_found` | 47 |
| **Total** | 56 |

| Availability | Records |
| --- | --- |
| `public_download` | 0 |
| `login_required` | 5 |
| `access_blocked` | 48 |
| `not_located` | 3 |

## Approved (displayable once a local file is present)

_None._

## Located resources

Specific files or packs identified (not just the game page).

| Resource | Subject | Kind | Source | Availability | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `starburst:thumbnail` | starburst | thumbnail | <https://clientarea.evolution.com/netent/games/game-thumbnails/> | login_required | search_snippet | `restricted` |
| `starburst:promo-material` | starburst | promo-material | <https://clientarea.netent.com/promotionpacks/starburst/> | login_required | search_snippet | `restricted` |
| `dead-or-alive-2:thumbnail` | dead-or-alive-2 | thumbnail | <https://clientarea.evolution.com/netent/games/game-thumbnails/> | login_required | search_snippet | `restricted` |
| `dead-or-alive-2:promo-material` | dead-or-alive-2 | promo-material | <https://clientarea.netent.com/promotionpacks/dead-or-alive-2/> | login_required | search_snippet | `restricted` |
| `bonanza-megaways:screenshot` | bonanza-megaways | screenshot | <https://www.bigtimegaming.com/games/bonanza> | access_blocked | search_snippet | `permission_pending` |
| `bonanza-megaways:promo-material` | bonanza-megaways | promo-material | <https://www.bigtimegaming.com/marketing> | access_blocked | search_snippet | `permission_pending` |
| `playngo:provider-logo` | studio: playngo | provider-logo | <https://www.playngo.com/brand> | access_blocked | search_snippet | `permission_pending` |
| `netent:provider-logo` | studio: netent | provider-logo | <https://clientarea.evolution.com/netent/games/netent-branding-logos/> | login_required | search_snippet | `restricted` |
| `big-time-gaming:provider-logo` | studio: big-time-gaming | provider-logo | <https://www.bigtimegaming.com/marketing> | access_blocked | search_snippet | `permission_pending` |

## Downloadable without an account

_None._

_Public availability does not imply permission to reuse._

## Pending permission

| Resource | Subject | Kind | Source | Availability | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `bonanza-megaways:screenshot` | bonanza-megaways | screenshot | <https://www.bigtimegaming.com/games/bonanza> | access_blocked | search_snippet | Game page lists screenshot files (01-BaseGame, 02-BaseGame-BigWin, 03-FreeSpins) per search snippet; page not opened. No BTG-specific usage terms found. Evolution terms covering beta.bigtimegaming.com (search snippet) require express written consent; whether they govern www.bigtimegaming.com/marketing is unclear. |
| `bonanza-megaways:promo-material` | bonanza-megaways | promo-material | <https://www.bigtimegaming.com/marketing> | access_blocked | search_snippet | Public marketing page lists Bonanza_Round.png per search snippet; no usage terms seen; page not opened. No BTG-specific usage terms found. Evolution terms covering beta.bigtimegaming.com (search snippet) require express written consent; whether they govern www.bigtimegaming.com/marketing is unclear. |
| `playngo:provider-logo` | studio: playngo | provider-logo | <https://www.playngo.com/brand> | access_blocked | search_snippet | Brand page offers logo downloads (search snippet) but every use must be approved first — request approval. Terms — search snippet: graphic material, logos, text and photographs may not be distributed without explicit written consent; trademarks not to be reproduced unless permitted in writing. |
| `big-time-gaming:provider-logo` | studio: big-time-gaming | provider-logo | <https://www.bigtimegaming.com/marketing> | access_blocked | search_snippet | "Media Kit Logo.png" listed on the public marketing page (search snippet); usage terms unclear. No BTG-specific usage terms found. Evolution terms covering beta.bigtimegaming.com (search snippet) require express written consent; whether they govern www.bigtimegaming.com/marketing is unclear. |

## Restricted by the terms consulted

| Resource | Subject | Kind | Source | Availability | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `starburst:thumbnail` | starburst | thumbnail | <https://clientarea.evolution.com/netent/games/game-thumbnails/> | login_required | search_snippet | File name gamethumb_starburst seen in the thumbnails pack listing; file itself not inspected. Terms — search snippet: intellectual property may not be reproduced, republished or redistributed without the prior written consent of Evolution; personal, non-commercial use. |
| `starburst:promo-material` | starburst | promo-material | <https://clientarea.netent.com/promotionpacks/starburst/> | login_required | search_snippet | Promotion pack (~853 MB: banners, symbols, videos, wallpapers) listed in the Client Area. Terms — search snippet: intellectual property may not be reproduced, republished or redistributed without the prior written consent of Evolution; personal, non-commercial use. |
| `dead-or-alive-2:thumbnail` | dead-or-alive-2 | thumbnail | <https://clientarea.evolution.com/netent/games/game-thumbnails/> | login_required | search_snippet | File name gamethumb_deadoraliveii seen in the thumbnails pack listing; file itself not inspected. Terms — search snippet: intellectual property may not be reproduced, republished or redistributed without the prior written consent of Evolution; personal, non-commercial use. |
| `dead-or-alive-2:promo-material` | dead-or-alive-2 | promo-material | <https://clientarea.netent.com/promotionpacks/dead-or-alive-2/> | login_required | search_snippet | Promotion pack (banners, game preview, symbols, videos) listed in the Client Area. Terms — search snippet: intellectual property may not be reproduced, republished or redistributed without the prior written consent of Evolution; personal, non-commercial use. |
| `netent:provider-logo` | studio: netent | provider-logo | <https://clientarea.evolution.com/netent/games/netent-branding-logos/> | login_required | search_snippet | "NetEnt Branding Logos" pack (PNG/SVG) in the Client Area (search snippet); written consent required by terms. Terms — search snippet: intellectual property may not be reproduced, republished or redistributed without the prior written consent of Evolution; personal, non-commercial use. |

## Unknown — terms not found

_None._

## Not found

| Resource | Reference page | Availability |
| --- | --- | --- |
| `gates-of-olympus:key-art` | <https://www.pragmaticplay.com/en/games/gates-of-olympus/> | access_blocked |
| `gates-of-olympus:thumbnail` | <https://www.pragmaticplay.com/en/games/gates-of-olympus/> | access_blocked |
| `gates-of-olympus:game-logo` | <https://www.pragmaticplay.com/en/games/gates-of-olympus/> | access_blocked |
| `gates-of-olympus:screenshot` | <https://www.pragmaticplay.com/en/games/gates-of-olympus/> | access_blocked |
| `gates-of-olympus:promo-material` | <https://www.pragmaticplay.com/en/games/gates-of-olympus/> | access_blocked |
| `sweet-bonanza:key-art` | <https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/> | access_blocked |
| `sweet-bonanza:thumbnail` | <https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/> | access_blocked |
| `sweet-bonanza:game-logo` | <https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/> | access_blocked |
| `sweet-bonanza:screenshot` | <https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/> | access_blocked |
| `sweet-bonanza:promo-material` | <https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/> | access_blocked |
| `big-bass-bonanza:key-art` | <https://www.pragmaticplay.com/en/games/big-bass-bonanza/> | access_blocked |
| `big-bass-bonanza:thumbnail` | <https://www.pragmaticplay.com/en/games/big-bass-bonanza/> | access_blocked |
| `big-bass-bonanza:game-logo` | <https://www.pragmaticplay.com/en/games/big-bass-bonanza/> | access_blocked |
| `big-bass-bonanza:screenshot` | <https://www.pragmaticplay.com/en/games/big-bass-bonanza/> | access_blocked |
| `big-bass-bonanza:promo-material` | <https://www.pragmaticplay.com/en/games/big-bass-bonanza/> | access_blocked |
| `book-of-dead:key-art` | <https://www.playngo.com/games/rich-wilde-and-the-book-of-dead> | access_blocked |
| `book-of-dead:thumbnail` | <https://www.playngo.com/games/rich-wilde-and-the-book-of-dead> | access_blocked |
| `book-of-dead:game-logo` | <https://www.playngo.com/games/rich-wilde-and-the-book-of-dead> | access_blocked |
| `book-of-dead:screenshot` | <https://www.playngo.com/games/rich-wilde-and-the-book-of-dead> | access_blocked |
| `book-of-dead:promo-material` | <https://www.playngo.com/games/rich-wilde-and-the-book-of-dead> | access_blocked |
| `reactoonz:key-art` | <https://www.playngo.com/games/reactoonz> | access_blocked |
| `reactoonz:thumbnail` | <https://www.playngo.com/games/reactoonz> | access_blocked |
| `reactoonz:game-logo` | <https://www.playngo.com/games/reactoonz> | access_blocked |
| `reactoonz:screenshot` | <https://www.playngo.com/games/reactoonz> | access_blocked |
| `reactoonz:promo-material` | <https://www.playngo.com/games/reactoonz> | access_blocked |
| `starburst:key-art` | <https://netent.com/games/starburst> | access_blocked |
| `starburst:game-logo` | <https://netent.com/games/starburst> | access_blocked |
| `starburst:screenshot` | <https://netent.com/games/starburst> | access_blocked |
| `dead-or-alive-2:key-art` | <https://netent.com/games/dead-or-alive-2> | access_blocked |
| `dead-or-alive-2:game-logo` | <https://netent.com/games/dead-or-alive-2> | access_blocked |
| `dead-or-alive-2:screenshot` | <https://netent.com/games/dead-or-alive-2> | access_blocked |
| `bonanza-megaways:key-art` | <https://www.bigtimegaming.com/games/bonanza> | access_blocked |
| `bonanza-megaways:thumbnail` | <https://www.bigtimegaming.com/games/bonanza> | access_blocked |
| `bonanza-megaways:game-logo` | <https://www.bigtimegaming.com/games/bonanza> | access_blocked |
| `wanted-dead-or-a-wild:key-art` | <https://www.hacksawgaming.com/games/wanted-dead-or-a-wild> | access_blocked |
| `wanted-dead-or-a-wild:thumbnail` | <https://www.hacksawgaming.com/games/wanted-dead-or-a-wild> | access_blocked |
| `wanted-dead-or-a-wild:game-logo` | <https://www.hacksawgaming.com/games/wanted-dead-or-a-wild> | access_blocked |
| `wanted-dead-or-a-wild:screenshot` | <https://www.hacksawgaming.com/games/wanted-dead-or-a-wild> | access_blocked |
| `wanted-dead-or-a-wild:promo-material` | <https://www.hacksawgaming.com/games/wanted-dead-or-a-wild> | access_blocked |
| `money-train-2:key-art` | <https://www.relax-gaming.com/products/casino/moneytrain2> | access_blocked |
| `money-train-2:thumbnail` | <https://www.relax-gaming.com/products/casino/moneytrain2> | access_blocked |
| `money-train-2:game-logo` | <https://www.relax-gaming.com/products/casino/moneytrain2> | access_blocked |
| `money-train-2:screenshot` | <https://www.relax-gaming.com/products/casino/moneytrain2> | access_blocked |
| `money-train-2:promo-material` | <https://www.relax-gaming.com/products/casino/moneytrain2> | access_blocked |
| `pragmatic-play:provider-logo` | <https://www.pragmaticplay.com/en/> | not_located |
| `hacksaw-gaming:provider-logo` | <https://www.hacksawgaming.com> | not_located |
| `relax-gaming:provider-logo` | <https://www.relax-gaming.com> | not_located |

## Providers to contact

| Provider | Terms | Media / asset area | Access | Default status | Request draft |
| --- | --- | --- | --- | --- | --- |
| Pragmatic Play | <https://www.pragmaticplay.com/en/terms-of-use/> | <https://www.pragmaticplay.com/en/client-hub/> | Client Hub (game pages: "download our rich media assets"); described as a partner login — no public registration route found (search snippet). | `restricted` | `docs/asset-permissions/requests/pragmatic-play.md` (not sent) |
| Play'n GO | <https://www.playngo.com/terms> | <https://www.playngo.com/brand> | Brand page offers logo downloads but states every use of the brand must be approved first (search snippet, German version de.playngo.com/our-brand). No game-asset press area found. | `restricted` | `docs/asset-permissions/requests/playngo.md` (not sent) |
| NetEnt / Evolution | <https://netent.com/terms-and-conditions> | <https://clientarea.netent.com/promotion-packs/> | Client Area promotion packs (banners, symbols, wallpapers, thumbnails); access appears limited to NetEnt/Evolution customers ("Apply for client access") — search snippet. | `restricted` | `docs/asset-permissions/requests/evolution-netent.md` (not sent) |
| Big Time Gaming / Evolution | <https://playin.com/terms-and-conditions> | <https://www.bigtimegaming.com/marketing> | Public "Marketing Packs" page listing a media-kit logo and per-game files (search snippet); no login mentioned, no licence text seen. | `permission_pending` | `docs/asset-permissions/requests/big-time-gaming.md` (not sent) |
| Hacksaw Gaming | — | <https://www.hacksawgroup.com/en/media/> | Group media page for press releases and media enquiries; no downloadable assets seen (search snippet). A client area for operators is mentioned in the privacy policy. | `unknown` | `docs/asset-permissions/requests/hacksaw-gaming.md` (not sent) |
| Relax Gaming | — | <https://clientarea.relax-gaming.com/> | Client Area for current and prospective customers, email login (privacy notice, search snippet); contents not visible. | `unknown` | `docs/asset-permissions/requests/relax-gaming.md` (not sent) |

### Contact points and routes

Role-based addresses seen on official domains in search results (no personal addresses stored). Confirm each on the live page before sending.

**Pragmatic Play** — No press or marketing address found. Use the contact form or sales@ and ask to be routed to marketing/PR for written consent and Client Hub media access (assumption: sales forwards it). legal@ only if there is no reply.

- Contact form (operators, resellers, platforms; department field): https://www.pragmaticplay.com/en/contact/ (seen at <https://www.pragmaticplay.com/en/contact/>)
- Sales: sales@pragmaticplay.com (seen at <https://www.pragmaticplay.com/en/contact/>)
- Legal notices (formal correspondence only): legal@pragmaticplay.com (seen at <https://www.pragmaticplay.com/en/terms-of-use/>)

**Play'n GO** — Submit the brand-use request form from the brand page ("every use of our brand must be approved") and email marketing@playngo.com for game assets.

- Marketing (listed for media contacts): marketing@playngo.com (seen at <https://www.playngo.com/contact>)
- Brand-use request form (linked from the brand page; form URL not captured): https://www.playngo.com/brand (seen at <https://de.playngo.com/our-brand>)

**NetEnt / Evolution** — Email press@evolution.com for written media permission covering NetEnt and Big Time Gaming titles; ask whether the affiliates-info "Studio Assets" or a media account in the Client Area may be used, and under which terms.

- Press (Evolution, also listed on the NetEnt contact page): press@evolution.com (seen at <https://www.evolution.com/contact-us>)
- Affiliate info / Studio Assets (licence clause not found): https://netent.com/affiliates-info (seen at <https://netent.com/affiliates-info>)

**Big Time Gaming / Evolution** — Include BTG in the Evolution request (press@evolution.com) and copy sales@bigtimegaming.com; ask specifically whether the public Marketing Packs may be used by publishers and on what terms.

- Sales (referenced by BTG press releases and the marketing page): sales@bigtimegaming.com (seen at <https://www.bigtimegaming.com/marketing>)
- Licensing (Megaways mechanic licensing): licensing@bigtimegaming.com (seen at <https://www.bigtimegaming.com>)
- Evolution press (group): press@evolution.com (seen at <https://www.evolution.com/contact-us>)

**Hacksaw Gaming** — Read the Marketing address on hacksawgaming.com/contact in a browser and send the request there; alternatively the group media address for a media-permission request.

- Contact page with Marketing / General addresses (obfuscated in search results — read in a browser): https://www.hacksawgaming.com/contact (seen at <https://www.hacksawgaming.com/contact>)
- Group media enquiries (PR agency address published by Hacksaw Group): Hacksaw@icrinc.com (seen at <https://www.hacksawgroup.com/en/media/>)

**Relax Gaming** — Use the contact form (mention media and affiliate use) and ask whether publishers can be given Client Area access as prospective partners. A named affiliate manager was listed in a 2022 news post (link above) — may be out of date.

- Contact form: https://www.relax-gaming.com/contact/ (seen at <https://www.relax-gaming.com/contact/>)
- Sales / partnerships: sales@relax-gaming.com (seen at <https://www.relax-gaming.com/news/2022/06/the-casino-beats-summit-all-things-accolades--aggregation>)

