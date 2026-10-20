import type { MetadataRoute } from "next";
import { getMarkets, getProviders, getSlots, getCasinos } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { isSlotIndexable } from "@/lib/validation";

/** Only indexable URLs: drafts, pending reviews, test data and tracking links are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slots, providers, markets, casinos] = await Promise.all([getSlots(), getProviders(), getMarkets(), getCasinos()]);
  const staticPaths = ["/", "/services", "/games", "/slots", "/providers", "/casinos", "/about", "/methodology", "/responsible-gambling", "/affiliate-disclosure", "/privacy", "/terms", "/contact"];
  const published = slots.filter(isSlotIndexable);

  return [
    ...staticPaths.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const })),
    ...published.map((s) => ({ url: absoluteUrl(`/slots/${s.slug}`), lastModified: s.updatedAt })),
    ...providers
      .filter((p) => p.status === "published" && published.some((s) => s.providerId === p.id))
      .map((p) => ({ url: absoluteUrl(`/providers/${p.slug}`) })),
    ...markets.filter((m) => m.status === "verified").map((m) => ({ url: absoluteUrl(`/markets/${m.code}`) })),
    ...casinos.filter((c) => !c.isTestData && c.status === "verified").map((c) => ({ url: absoluteUrl(`/casinos/${c.slug}`) })),
    ...["aura", "obsidian-the-lost-vault", "dead-air-channel-13"].map((slug) => ({ url: absoluteUrl(`/games/${slug}`) })),
  ];
}
