import { getCasinos, getMarket, getOfferById } from "@/lib/data";
import { checkOfferEligibility, type IneligibleReason } from "@/lib/eligibility";

const OFFER_ID = /^[a-z0-9-]{1,64}$/;
const MARKET_CODE = /^[a-z]{2}(-[a-z]{2})?$/;

export type RedirectDecision =
  | { ok: true; destination: string; offerId: string; market: string }
  | { ok: false; status: 400 | 404 | 410; reason: string; reasons?: IneligibleReason[] };

/**
 * Resolves a click to a stored, approved offer. The destination always comes
 * from our own data — never from the request — and every eligibility rule is
 * re-checked at click time, so paused or expired offers stop immediately.
 */
export async function resolveOfferRedirect(offerId: string, marketParam: string | null, now = new Date()): Promise<RedirectDecision> {
  if (!OFFER_ID.test(offerId)) return { ok: false, status: 400, reason: "invalid_offer_id" };
  const market = (marketParam ?? "").toLowerCase();
  if (!MARKET_CODE.test(market)) return { ok: false, status: 400, reason: "market_required" };

  const offer = await getOfferById(offerId);
  if (!offer) return { ok: false, status: 404, reason: "unknown_offer" };

  const [marketRecord, casinos] = await Promise.all([getMarket(market), getCasinos()]);
  const casino = casinos.find((c) => c.id === offer.casinoId) ?? null;
  const reasons = checkOfferEligibility(offer, { marketCode: market, market: marketRecord, casino, now });
  if (reasons.length) {
    const gone = reasons.includes("expired") || reasons.includes("not_approved");
    return { ok: false, status: gone ? 410 : 404, reason: "not_eligible", reasons };
  }
  return { ok: true, destination: offer.trackingUrl, offerId: offer.id, market };
}
