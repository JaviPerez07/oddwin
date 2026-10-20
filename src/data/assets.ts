import type { AssetKind, AssetRecord, Availability, PermissionStatus } from "@/types/asset";

/*
 * Asset registry — official imagery for games and studios.
 *
 * Evidence base (CHECKED): web-search results restricted to official domains.
 * Provider websites could not be opened from our build environment (network
 * policy returns HTTP 403 for every provider domain), so no page was inspected
 * directly, no file was downloaded and no request has been sent.
 *
 * Nothing in this file is `approved`. The site renders official art only when
 * lib/assets.ts#canDisplay passes for a record (approved status, documented
 * evidence, required uses, worldwide territory, not expired or revoked, and a
 * local file that exists).
 */
export const CHECKED = "2026-10-20";
export const NEXT_REVIEW = "2026-11-19";
export const OWNER = "Unassigned — OddWin Studios editorial lead";

export interface ProviderAccess {
  holder: string;
  site: string;
  termsUrl: string | null;
  /** Clause or summary of the reuse terms found, with evidence type. */
  termsSummary: string;
  mediaAreaUrl: string | null;
  mediaAccess: string;
  /** Default status for this provider's game assets once a resource is located. */
  defaultStatus: PermissionStatus;
  /** Draft request in docs/asset-permissions/requests/. */
  requestDraft: string;
  /**
   * Official, role-based contact points (no personal addresses). Each was seen
   * verbatim on an official domain in search results — confirm on the live
   * page before sending.
   */
  contacts: { channel: string; value: string; foundAt: string }[];
  /** Fastest legitimate route identified, with assumptions stated. */
  route: string;
}

export const PROVIDER_ACCESS: Record<string, ProviderAccess> = {
  "pragmatic-play": {
    holder: "Pragmatic Play",
    site: "https://www.pragmaticplay.com/en/",
    termsUrl: "https://www.pragmaticplay.com/en/terms-of-use/",
    termsSummary:
      "Terms of use (v1.0, Feb 2021) — search snippet: no reproduction of the service or its images/titles in any form without express written consent; downloads for personal, non-commercial use only.",
    mediaAreaUrl: "https://www.pragmaticplay.com/en/client-hub/",
    mediaAccess: "Client Hub (game pages: \"download our rich media assets\"); described as a partner login — no public registration route found (search snippet).",
    defaultStatus: "restricted",
    requestDraft: "docs/asset-permissions/requests/pragmatic-play.md",
    contacts: [
      { channel: "Contact form (operators, resellers, platforms; department field)", value: "https://www.pragmaticplay.com/en/contact/", foundAt: "https://www.pragmaticplay.com/en/contact/" },
      { channel: "Sales", value: "sales@pragmaticplay.com", foundAt: "https://www.pragmaticplay.com/en/contact/" },
      { channel: "Legal notices (formal correspondence only)", value: "legal@pragmaticplay.com", foundAt: "https://www.pragmaticplay.com/en/terms-of-use/" },
    ],
    route: "No press or marketing address found. Use the contact form or sales@ and ask to be routed to marketing/PR for written consent and Client Hub media access (assumption: sales forwards it). legal@ only if there is no reply.",
  },
  playngo: {
    holder: "Play'n GO",
    site: "https://www.playngo.com",
    termsUrl: "https://www.playngo.com/terms",
    termsSummary:
      "Terms — search snippet: graphic material, logos, text and photographs may not be distributed without explicit written consent; trademarks not to be reproduced unless permitted in writing.",
    mediaAreaUrl: "https://www.playngo.com/brand",
    mediaAccess: "Brand page offers logo downloads but states every use of the brand must be approved first (search snippet, German version de.playngo.com/our-brand). No game-asset press area found.",
    defaultStatus: "restricted",
    requestDraft: "docs/asset-permissions/requests/playngo.md",
    contacts: [
      { channel: "Marketing (listed for media contacts)", value: "marketing@playngo.com", foundAt: "https://www.playngo.com/contact" },
      { channel: "Brand-use request form (linked from the brand page; form URL not captured)", value: "https://www.playngo.com/brand", foundAt: "https://de.playngo.com/our-brand" },
    ],
    route: "Submit the brand-use request form from the brand page (\"every use of our brand must be approved\") and email marketing@playngo.com for game assets.",
  },
  netent: {
    holder: "NetEnt / Evolution",
    site: "https://netent.com",
    termsUrl: "https://netent.com/terms-and-conditions",
    termsSummary:
      "Terms — search snippet: intellectual property may not be reproduced, republished or redistributed without the prior written consent of Evolution; personal, non-commercial use.",
    mediaAreaUrl: "https://clientarea.netent.com/promotion-packs/",
    mediaAccess: "Client Area promotion packs (banners, symbols, wallpapers, thumbnails); access appears limited to NetEnt/Evolution customers (\"Apply for client access\") — search snippet.",
    defaultStatus: "restricted",
    requestDraft: "docs/asset-permissions/requests/evolution-netent.md",
    contacts: [
      { channel: "Press (Evolution, also listed on the NetEnt contact page)", value: "press@evolution.com", foundAt: "https://www.evolution.com/contact-us" },
      { channel: "Affiliate info / Studio Assets (licence clause not found)", value: "https://netent.com/affiliates-info", foundAt: "https://netent.com/affiliates-info" },
    ],
    route: "Email press@evolution.com for written media permission covering NetEnt and Big Time Gaming titles; ask whether the affiliates-info \"Studio Assets\" or a media account in the Client Area may be used, and under which terms.",
  },
  "big-time-gaming": {
    holder: "Big Time Gaming / Evolution",
    site: "https://www.bigtimegaming.com",
    termsUrl: "https://playin.com/terms-and-conditions",
    termsSummary:
      "No BTG-specific usage terms found. Evolution terms covering beta.bigtimegaming.com (search snippet) require express written consent; whether they govern www.bigtimegaming.com/marketing is unclear.",
    mediaAreaUrl: "https://www.bigtimegaming.com/marketing",
    mediaAccess: "Public \"Marketing Packs\" page listing a media-kit logo and per-game files (search snippet); no login mentioned, no licence text seen.",
    defaultStatus: "permission_pending",
    requestDraft: "docs/asset-permissions/requests/big-time-gaming.md",
    contacts: [
      { channel: "Sales (referenced by BTG press releases and the marketing page)", value: "sales@bigtimegaming.com", foundAt: "https://www.bigtimegaming.com/marketing" },
      { channel: "Licensing (Megaways mechanic licensing)", value: "licensing@bigtimegaming.com", foundAt: "https://www.bigtimegaming.com" },
      { channel: "Evolution press (group)", value: "press@evolution.com", foundAt: "https://www.evolution.com/contact-us" },
    ],
    route: "Include BTG in the Evolution request (press@evolution.com) and copy sales@bigtimegaming.com; ask specifically whether the public Marketing Packs may be used by publishers and on what terms.",
  },
  "hacksaw-gaming": {
    holder: "Hacksaw Gaming",
    site: "https://www.hacksawgaming.com",
    termsUrl: null,
    termsSummary: "No website terms of use or media kit found; site footer states all rights reserved (search snippet).",
    mediaAreaUrl: "https://www.hacksawgroup.com/en/media/",
    mediaAccess: "Group media page for press releases and media enquiries; no downloadable assets seen (search snippet). A client area for operators is mentioned in the privacy policy.",
    defaultStatus: "unknown",
    requestDraft: "docs/asset-permissions/requests/hacksaw-gaming.md",
    contacts: [
      { channel: "Contact page with Marketing / General addresses (obfuscated in search results — read in a browser)", value: "https://www.hacksawgaming.com/contact", foundAt: "https://www.hacksawgaming.com/contact" },
      { channel: "Group media enquiries (PR agency address published by Hacksaw Group)", value: "Hacksaw@icrinc.com", foundAt: "https://www.hacksawgroup.com/en/media/" },
    ],
    route: "Read the Marketing address on hacksawgaming.com/contact in a browser and send the request there; alternatively the group media address for a media-permission request.",
  },
  "relax-gaming": {
    holder: "Relax Gaming",
    site: "https://www.relax-gaming.com",
    termsUrl: null,
    termsSummary: "No public terms on asset reuse found; footer states all rights reserved (search snippet).",
    mediaAreaUrl: "https://clientarea.relax-gaming.com/",
    mediaAccess: "Client Area for current and prospective customers, email login (privacy notice, search snippet); contents not visible.",
    defaultStatus: "unknown",
    requestDraft: "docs/asset-permissions/requests/relax-gaming.md",
    contacts: [
      { channel: "Contact form", value: "https://www.relax-gaming.com/contact/", foundAt: "https://www.relax-gaming.com/contact/" },
      { channel: "Sales / partnerships", value: "sales@relax-gaming.com", foundAt: "https://www.relax-gaming.com/news/2022/06/the-casino-beats-summit-all-things-accolades--aggregation" },
    ],
    route: "Use the contact form (mention media and affiliate use) and ask whether publishers can be given Client Area access as prospective partners. A named affiliate manager was listed in a 2022 news post (link above) — may be out of date.",
  },
};

interface Located {
  url: string;
  availability: Availability;
  status?: PermissionStatus;
  note: string;
}

interface GameSeed {
  id: string;
  provider: keyof typeof PROVIDER_ACCESS;
  page: string;
  located?: Partial<Record<AssetKind, Located>>;
}

const GAMES: GameSeed[] = [
  { id: "gates-of-olympus", provider: "pragmatic-play", page: "https://www.pragmaticplay.com/en/games/gates-of-olympus/" },
  { id: "sweet-bonanza", provider: "pragmatic-play", page: "https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/" },
  { id: "big-bass-bonanza", provider: "pragmatic-play", page: "https://www.pragmaticplay.com/en/games/big-bass-bonanza/" },
  { id: "book-of-dead", provider: "playngo", page: "https://www.playngo.com/games/rich-wilde-and-the-book-of-dead" },
  { id: "reactoonz", provider: "playngo", page: "https://www.playngo.com/games/reactoonz" },
  {
    id: "starburst",
    provider: "netent",
    page: "https://netent.com/games/starburst",
    located: {
      "promo-material": { url: "https://clientarea.netent.com/promotionpacks/starburst/", availability: "login_required", note: "Promotion pack (~853 MB: banners, symbols, videos, wallpapers) listed in the Client Area." },
      thumbnail: { url: "https://clientarea.evolution.com/netent/games/game-thumbnails/", availability: "login_required", note: "File name gamethumb_starburst seen in the thumbnails pack listing; file itself not inspected." },
    },
  },
  {
    id: "dead-or-alive-2",
    provider: "netent",
    page: "https://netent.com/games/dead-or-alive-2",
    located: {
      "promo-material": { url: "https://clientarea.netent.com/promotionpacks/dead-or-alive-2/", availability: "login_required", note: "Promotion pack (banners, game preview, symbols, videos) listed in the Client Area." },
      thumbnail: { url: "https://clientarea.evolution.com/netent/games/game-thumbnails/", availability: "login_required", note: "File name gamethumb_deadoraliveii seen in the thumbnails pack listing; file itself not inspected." },
    },
  },
  {
    id: "bonanza-megaways",
    provider: "big-time-gaming",
    page: "https://www.bigtimegaming.com/games/bonanza",
    located: {
      screenshot: { url: "https://www.bigtimegaming.com/games/bonanza", availability: "access_blocked", note: "Game page lists screenshot files (01-BaseGame, 02-BaseGame-BigWin, 03-FreeSpins) per search snippet; page not opened." },
      "promo-material": { url: "https://www.bigtimegaming.com/marketing", availability: "access_blocked", note: "Public marketing page lists Bonanza_Round.png per search snippet; no usage terms seen; page not opened." },
    },
  },
  { id: "wanted-dead-or-a-wild", provider: "hacksaw-gaming", page: "https://www.hacksawgaming.com/games/wanted-dead-or-a-wild" },
  { id: "money-train-2", provider: "relax-gaming", page: "https://www.relax-gaming.com/products/casino/moneytrain2" },
];

const GAME_KINDS: AssetKind[] = ["key-art", "thumbnail", "game-logo", "screenshot", "promo-material"];

const pending = (status: PermissionStatus) => ({
  status,
  evidence: null,
  authorisedUses: [],
  territories: null,
  attribution: null,
  expiresAt: null,
  revoked: null,
});

export const assets: AssetRecord[] = [
  ...GAMES.flatMap((g) => {
    const p = PROVIDER_ACCESS[g.provider];
    return GAME_KINDS.map((kind): AssetRecord => {
      const loc = g.located?.[kind];
      return {
        id: `${g.id}:${kind}`,
        subject: { type: "slot", id: g.id },
        kind,
        sourceUrl: loc?.url ?? g.page,
        sourceEvidence: "search_snippet",
        holder: p.holder,
        availability: loc?.availability ?? "access_blocked",
        localPath: null,
        checkedAt: CHECKED,
        termsUrl: p.termsUrl,
        permission: pending(loc ? (loc.status ?? p.defaultStatus) : "not_found"),
        nextReviewAt: NEXT_REVIEW,
        owner: OWNER,
        notes: loc
          ? `${loc.note} ${p.termsSummary}`
          : `No specific file located. Official game page recorded as the reference; it could not be opened from our environment. ${p.termsSummary}`,
      };
    });
  }),
  ...Object.entries(PROVIDER_ACCESS).map(([id, p]): AssetRecord => {
    const logo: Record<string, { url: string; availability: Availability; status: PermissionStatus; note: string } | undefined> = {
      playngo: { url: "https://www.playngo.com/brand", availability: "access_blocked", status: "permission_pending", note: "Brand page offers logo downloads (search snippet) but every use must be approved first — request approval." },
      netent: { url: "https://clientarea.evolution.com/netent/games/netent-branding-logos/", availability: "login_required", status: "restricted", note: "\"NetEnt Branding Logos\" pack (PNG/SVG) in the Client Area (search snippet); written consent required by terms." },
      "big-time-gaming": { url: "https://www.bigtimegaming.com/marketing", availability: "access_blocked", status: "permission_pending", note: "\"Media Kit Logo.png\" listed on the public marketing page (search snippet); usage terms unclear." },
    };
    const l = logo[id];
    return {
      id: `${id}:provider-logo`,
      subject: { type: "provider", id },
      kind: "provider-logo",
      sourceUrl: l?.url ?? p.site,
      sourceEvidence: "search_snippet",
      holder: p.holder,
      availability: l?.availability ?? "not_located",
      localPath: null,
      checkedAt: CHECKED,
      termsUrl: p.termsUrl,
      permission: pending(l?.status ?? "not_found"),
      nextReviewAt: NEXT_REVIEW,
      owner: OWNER,
      notes: l ? `${l.note} ${p.termsSummary}` : `No logo file or brand guidelines located. ${p.termsSummary}`,
    };
  }),
];
