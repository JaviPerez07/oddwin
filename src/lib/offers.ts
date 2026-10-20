import { getCasinos, getMarkets, getOffers } from "@/lib/data";
import { isOfferEligible, toPublicOffer, type PublicOffer } from "@/lib/eligibility";

/**
 * Eligible offers grouped by market code, computed on the server. The client
 * picks the list for the visitor's chosen market and also hides anything whose
 * expiry passes after the page was built; /go re-validates on every click.
 */
export async function getEligibleOffersByMarket(now = new Date()): Promise<Record<string, PublicOffer[]>> {
  const [offers, casinos, markets] = await Promise.all([getOffers(), getCasinos(), getMarkets()]);
  const byMarket: Record<string, PublicOffer[]> = {};
  for (const market of markets) {
    byMarket[market.code] = offers
      .map((offer) => ({ offer, casino: casinos.find((c) => c.id === offer.casinoId) ?? null }))
      .filter(({ offer, casino }) => isOfferEligible(offer, { marketCode: market.code, market, casino, now }))
      .map(({ offer, casino }) => toPublicOffer(offer, casino!));
  }
  return byMarket;
}
