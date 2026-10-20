import type { AffiliateOffer } from "@/types/affiliate";

/**
 * Production affiliate offers. Intentionally empty: no programme has approved
 * this site yet, so no tracking URL exists. Never add an offer here without
 * the programme's written approval, the exact tracking URL it issued, and the
 * market eligibility checks described in lib/eligibility.ts.
 */
export const offers: AffiliateOffer[] = [];
