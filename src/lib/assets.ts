import { existsSync } from "node:fs";
import { join } from "node:path";
import { assets as registry } from "@/data/assets";
import { fixtureAssets } from "@/data/fixtures/assets";
import { fixturesEnabled } from "@/lib/env";
import type { AssetKind, AssetRecord, AssetUse } from "@/types/asset";
import type { LicensedArt } from "@/types/slot";

/** Where an asset would appear, and which authorised uses that requires. */
export type Surface = "hero" | "card" | "provider-logo";

/*
 * Every page that shows game imagery may also carry labelled affiliate links
 * (review pages) or sit in a site that does, so "affiliate_pages" is required
 * everywhere. A territory-limited licence is not enough: we don't geolocate
 * visitors, so the asset would reach markets it isn't licensed for.
 */
export const SURFACE_USES: Record<Surface, AssetUse[]> = {
  hero: ["editorial", "affiliate_pages"],
  card: ["editorial", "catalogue", "affiliate_pages"],
  "provider-logo": ["editorial", "logo_reproduction", "affiliate_pages"],
};

const SURFACE_KINDS: Record<Surface, AssetKind[]> = {
  hero: ["key-art"],
  card: ["thumbnail", "key-art"],
  "provider-logo": ["provider-logo"],
};

export function getAssets(): AssetRecord[] {
  return fixturesEnabled() ? [...registry, ...fixtureAssets] : registry;
}

export type DisplayBlocker =
  | "not_approved"
  | "no_evidence"
  | "use_not_authorised"
  | "territory_not_worldwide"
  | "expired"
  | "revoked"
  | "no_local_file"
  | "unsafe_path"
  | "missing_dimensions"
  | "file_missing"
  | "test_data_disabled";

export function fileExists(localPath: string): boolean {
  return existsSync(join(process.cwd(), "public", localPath));
}

/**
 * The single rule deciding whether a record may be shown as official art on a
 * surface. Returns every blocker so audits can explain the decision.
 */
export function displayBlockers(a: AssetRecord, surface: Surface, now = new Date(), exists: (p: string) => boolean = fileExists): DisplayBlocker[] {
  const out: DisplayBlocker[] = [];
  const p = a.permission;
  if (a.isTestData && !fixturesEnabled()) out.push("test_data_disabled");
  if (p.status !== "approved") out.push("not_approved");
  if (!p.evidence) out.push("no_evidence");
  if (!SURFACE_USES[surface].every((u) => p.authorisedUses.includes(u))) out.push("use_not_authorised");
  if (p.territories !== "worldwide") out.push("territory_not_worldwide");
  if (p.expiresAt && new Date(p.expiresAt).getTime() <= now.getTime()) out.push("expired");
  if (p.revoked) out.push("revoked");
  if (!a.localPath) out.push("no_local_file");
  else {
    const allowedRoot = a.isTestData ? "/art/test/" : "/art/licensed/";
    if (!a.localPath.startsWith(allowedRoot) || a.localPath.includes("..")) out.push("unsafe_path");
    else if (!exists(a.localPath)) out.push("file_missing");
  }
  if (!a.width || !a.height) out.push("missing_dimensions");
  return out;
}

export function canDisplay(a: AssetRecord, surface: Surface, now = new Date(), exists?: (p: string) => boolean): boolean {
  return displayBlockers(a, surface, now, exists).length === 0;
}

function toLicensed(a: AssetRecord, fallbackAlt: string): LicensedArt {
  return {
    src: a.localPath!,
    width: a.width!,
    height: a.height!,
    alt: a.alt ?? fallbackAlt,
    credit: a.holder ?? "Titular de derechos",
    attribution: a.permission.attribution,
    licenceRef: a.permission.evidence!.reference,
    approvedAt: a.permission.evidence!.receivedAt,
    fit: a.permission.authorisedUses.includes("modification") ? "cover" : "contain",
    isTestData: a.isTestData,
  };
}

function resolve(type: "slot" | "provider", id: string, surface: Surface, alt: string): LicensedArt | null {
  const records = getAssets().filter((a) => a.subject.type === type && a.subject.id === id);
  for (const kind of SURFACE_KINDS[surface]) {
    const found = records.find((a) => a.kind === kind && canDisplay(a, surface));
    if (found) return toLicensed(found, alt);
  }
  return null;
}

export function slotHeroArt(slotId: string, name: string): LicensedArt | null {
  return resolve("slot", slotId, "hero", `${name} — official artwork`);
}

export function slotCardArt(slotId: string, name: string): LicensedArt | null {
  return resolve("slot", slotId, "card", `${name} — official artwork`);
}

export function providerLogo(providerId: string, name: string): LicensedArt | null {
  return resolve("provider", providerId, "provider-logo", `${name} logo`);
}

export function assetsFor(type: "slot" | "provider", id: string): AssetRecord[] {
  return getAssets().filter((a) => a.subject.type === type && a.subject.id === id);
}
