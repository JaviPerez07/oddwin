/**
 * Data access layer. Every page reads content through these async functions,
 * so swapping the typed in-repo data for a database or CMS later only touches
 * this file.
 */
import { site } from "@/config/site";
import { casinos as prodCasinos } from "@/data/casinos";
import { fixtureCasinos, fixtureMarketOperators, fixtureOffers } from "@/data/fixtures";
import { markets as marketData } from "@/data/markets";
import { offers as prodOffers } from "@/data/offers";
import { providers } from "@/data/providers";
import { slots } from "@/data/slots";
import { providerLogo, slotCardArt, slotHeroArt } from "@/lib/assets";
import { fixturesEnabled } from "@/lib/env";
import type { AffiliateOffer } from "@/types/affiliate";
import type { Casino } from "@/types/casino";
import type { Market } from "@/types/market";
import type { Provider } from "@/types/provider";
import type { Mechanic, Slot } from "@/types/slot";

/** Attach publishable official artwork from the asset manifest, if any. */
function withArt(slot: Slot): Slot {
  // Hero and catalogue imagery come from the same registry, resolved per surface.
  return { ...slot, artwork: { ...slot.artwork, licensed: slotHeroArt(slot.id, slot.name), card: slotCardArt(slot.id, slot.name) } };
}

function withLogo(p: Provider): Provider {
  return { ...p, logo: providerLogo(p.id, p.name) };
}

function visible(slot: Slot): boolean {
  if (slot.publicationStatus === "published") return true;
  return slot.publicationStatus === "pending_review" && site.showPendingReviews;
}

export async function getSlots(): Promise<Slot[]> {
  return slots
    .filter(visible)
    .map(withArt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name));
}

export async function getSlotBySlug(slug: string): Promise<Slot | null> {
  const slot = slots.find((s) => s.slug === slug);
  return slot && visible(slot) ? withArt(slot) : null;
}

export async function getFeaturedSlot(): Promise<Slot | null> {
  const all = await getSlots();
  return all.find((s) => s.featured) ?? all[0] ?? null;
}

export async function getSlotsByProvider(providerId: string): Promise<Slot[]> {
  return (await getSlots()).filter((s) => s.providerId === providerId);
}

export async function getSlotsByMechanic(mechanic: Mechanic): Promise<Slot[]> {
  return (await getSlots()).filter((s) => s.mechanics.includes(mechanic));
}

/** Related games ranked by number of shared mechanics (real overlap only). */
export async function getRelatedSlots(slot: Slot, limit = 3): Promise<Slot[]> {
  const all = await getSlots();
  return all
    .filter((s) => s.id !== slot.id)
    .map((s) => ({ s, score: s.mechanics.filter((m) => slot.mechanics.includes(m)).length }))
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name))
    .slice(0, limit)
    .map(({ s }) => s);
}

export async function getProviders(): Promise<Provider[]> {
  return providers.map(withLogo).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const p = providers.find((x) => x.slug === slug);
  return p ? withLogo(p) : null;
}

export async function getProviderById(id: string): Promise<Provider | null> {
  const p = providers.find((x) => x.id === id);
  return p ? withLogo(p) : null;
}

export function getProviderMap(): Record<string, Provider> {
  return Object.fromEntries(providers.map((p) => [p.id, withLogo(p)]));
}

export async function getMarkets(): Promise<Market[]> {
  const useFixtures = fixturesEnabled();
  return marketData.map((m) =>
    useFixtures && fixtureMarketOperators[m.code]
      ? { ...m, allowedOperators: [...m.allowedOperators, ...fixtureMarketOperators[m.code]] }
      : m,
  );
}

export async function getMarket(code: string): Promise<Market | null> {
  return (await getMarkets()).find((m) => m.code === code.toLowerCase()) ?? null;
}

export async function getCasinos(): Promise<Casino[]> {
  return fixturesEnabled() ? [...prodCasinos, ...fixtureCasinos] : [...prodCasinos];
}

export async function getCasinoBySlug(slug: string): Promise<Casino | null> {
  return (await getCasinos()).find((c) => c.slug === slug) ?? null;
}

export async function getOffers(): Promise<AffiliateOffer[]> {
  return fixturesEnabled() ? [...prodOffers, ...fixtureOffers] : [...prodOffers];
}

export async function getOfferById(id: string): Promise<AffiliateOffer | null> {
  return (await getOffers()).find((o) => o.id === id) ?? null;
}
