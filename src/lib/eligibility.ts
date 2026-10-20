import { site } from "@/config/site";
import { fixturesEnabled } from "@/lib/env";
import type { AffiliateOffer } from "@/types/affiliate";
import type { Casino } from "@/types/casino";
import type { Market } from "@/types/market";

export type IneligibleReason =
  | "not_approved"
  | "not_verified"
  | "expired"
  | "wrong_market"
  | "unknown_market"
  | "market_not_verified"
  | "operator_not_allowed_in_market"
  | "unknown_casino"
  | "casino_not_verified"
  | "no_licence_for_market"
  | "traffic_source_not_permitted"
  | "domain_not_permitted"
  | "insecure_destination"
  | "destination_not_allow_listed"
  | "test_data_disabled";

export interface EligibilityContext {
  marketCode: string;
  market: Market | null;
  casino: Casino | null;
  now: Date;
  siteHost?: string;
}

/** Strict URL check: HTTPS only and the host must be on the offer's allow-list. */
export function destinationProblem(offer: AffiliateOffer): IneligibleReason | null {
  let url: URL;
  try {
    url = new URL(offer.trackingUrl);
  } catch {
    return "insecure_destination";
  }
  if (url.protocol !== "https:" || url.username || url.password) return "insecure_destination";
  const host = url.hostname.toLowerCase();
  const allowed = offer.allowedDestinationHosts.some((h) => host === h.toLowerCase());
  return allowed ? null : "destination_not_allow_listed";
}

/**
 * Single source of truth for whether an offer may be shown or followed.
 * Used at render time (to list offers) and again at redirect time (/go/[id]).
 * Returns every failed rule so the reasons can be audited.
 */
export function checkOfferEligibility(offer: AffiliateOffer, ctx: EligibilityContext): IneligibleReason[] {
  const reasons: IneligibleReason[] = [];
  const siteHost = ctx.siteHost ?? new URL(site.url).hostname;

  if (offer.isTestData && !fixturesEnabled()) reasons.push("test_data_disabled");
  if (offer.approvalStatus !== "approved") reasons.push("not_approved");
  if (!offer.verifiedAt) reasons.push("not_verified");
  if (offer.expiresAt && new Date(offer.expiresAt).getTime() <= ctx.now.getTime()) reasons.push("expired");
  if (offer.marketCode !== ctx.marketCode) reasons.push("wrong_market");

  if (!ctx.market) {
    reasons.push("unknown_market");
  } else {
    // Real offers require a market whose regulatory facts have been verified.
    if (ctx.market.status !== "verified" && !offer.isTestData) reasons.push("market_not_verified");
    if (!ctx.market.allowedOperators.includes(offer.casinoId)) reasons.push("operator_not_allowed_in_market");
  }

  if (!ctx.casino) {
    reasons.push("unknown_casino");
  } else {
    if (ctx.casino.status !== "verified") reasons.push("casino_not_verified");
    if (!ctx.casino.licences.some((l) => l.marketCode === ctx.marketCode)) reasons.push("no_licence_for_market");
  }

  if (!offer.permittedTrafficSources.includes("seo")) reasons.push("traffic_source_not_permitted");
  if (!offer.permittedDomains.includes(siteHost)) reasons.push("domain_not_permitted");

  const dest = destinationProblem(offer);
  if (dest) reasons.push(dest);

  return reasons;
}

export function isOfferEligible(offer: AffiliateOffer, ctx: EligibilityContext): boolean {
  return checkOfferEligibility(offer, ctx).length === 0;
}

/** Shape sent to the client: no tracking URL, no internal notes. */
export interface PublicOffer {
  id: string;
  casinoName: string;
  casinoSlug: string;
  marketCode: string;
  headline: string;
  termsUrl: string;
  commercialRelationship: string;
  verifiedAt: string;
  expiresAt: string | null;
  isTestData: boolean;
}

export function toPublicOffer(offer: AffiliateOffer, casino: Casino): PublicOffer {
  return {
    id: offer.id,
    casinoName: casino.name,
    casinoSlug: casino.slug,
    marketCode: offer.marketCode,
    headline: offer.headline,
    termsUrl: offer.termsUrl,
    commercialRelationship: `Enlace de afiliación — ${offer.programName}`,
    verifiedAt: offer.verifiedAt ?? "",
    expiresAt: offer.expiresAt,
    isTestData: Boolean(offer.isTestData),
  };
}
