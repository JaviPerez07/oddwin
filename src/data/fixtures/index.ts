import type { AffiliateOffer } from "@/types/affiliate";
import type { Casino } from "@/types/casino";

/*
 * DEVELOPMENT FIXTURES — NOT REAL OPERATORS OR OFFERS.
 * Used to exercise eligibility, market switching and the /go redirect in tests.
 * Loaded only when fixturesEnabled() (never when SITE_ENV=production).
 * All destinations use example.com, which is reserved for documentation (RFC 2606).
 */

export const fixtureCasinos: Casino[] = [
  {
    id: "fixture-north",
    slug: "fixture-north",
    name: "Fixture Casino North",
    legalEntity: "Test Entity Ltd (fictional)",
    officialWebsite: "https://example.com/",
    licences: [
      { marketCode: "gb", authority: "Test authority", licenceNumber: "TEST-0001", verificationSource: "https://example.com/register", lastVerifiedAt: "2026-10-20" },
    ],
    editorialSummary: "Fictional operator used to test the affiliate pipeline. It does not exist.",
    sources: [],
    lastVerifiedAt: "2026-10-20",
    status: "verified",
    isTestData: true,
  },
  {
    id: "fixture-south",
    slug: "fixture-south",
    name: "Fixture Casino South",
    legalEntity: "Test Entity SL (fictional)",
    officialWebsite: "https://example.com/",
    licences: [
      { marketCode: "es", authority: "Test authority", licenceNumber: "TEST-0002", verificationSource: "https://example.com/register", lastVerifiedAt: "2026-10-20" },
    ],
    editorialSummary: "Fictional operator used to test market switching. It does not exist.",
    sources: [],
    lastVerifiedAt: "2026-10-20",
    status: "verified",
    isTestData: true,
  },
];

const base = {
  programName: "Fixture Programme (fictional)",
  officialProgramUrl: "https://example.com/affiliates",
  commissionModel: "unknown" as const,
  termsUrl: "https://example.com/terms",
  permittedTrafficSources: ["seo"],
  permittedDomains: ["localhost"],
  allowedDestinationHosts: ["example.com"],
  isTestData: true,
};

export const fixtureOffers: AffiliateOffer[] = [
  { ...base, id: "fx-north-gb", casinoId: "fixture-north", marketCode: "gb", trackingUrl: "https://example.com/track/north-gb", approvalStatus: "approved", headline: "Test offer — Great Britain", verifiedAt: "2026-10-20", expiresAt: "2099-01-01" },
  { ...base, id: "fx-south-es", casinoId: "fixture-south", marketCode: "es", trackingUrl: "https://example.com/track/south-es", approvalStatus: "approved", headline: "Test offer — Spain", verifiedAt: "2026-10-20", expiresAt: "2099-01-01" },
  { ...base, id: "fx-north-paused", casinoId: "fixture-north", marketCode: "gb", trackingUrl: "https://example.com/track/paused", approvalStatus: "paused", headline: "Paused test offer", verifiedAt: "2026-10-20", expiresAt: "2099-01-01" },
  { ...base, id: "fx-north-expired", casinoId: "fixture-north", marketCode: "gb", trackingUrl: "https://example.com/track/expired", approvalStatus: "approved", headline: "Expired test offer", verifiedAt: "2026-10-20", expiresAt: "2020-01-01" },
  { ...base, id: "fx-north-pending", casinoId: "fixture-north", marketCode: "gb", trackingUrl: "https://example.com/track/pending", approvalStatus: "pending_review", headline: "Pending test offer", verifiedAt: null, expiresAt: null },
  { ...base, id: "fx-north-badhost", casinoId: "fixture-north", marketCode: "gb", trackingUrl: "https://evil.example.net/steal", approvalStatus: "approved", headline: "Misconfigured test offer", verifiedAt: "2026-10-20", expiresAt: "2099-01-01" },
  { ...base, id: "fx-north-http", casinoId: "fixture-north", marketCode: "gb", trackingUrl: "http://example.com/insecure", approvalStatus: "approved", headline: "Insecure test offer", verifiedAt: "2026-10-20", expiresAt: "2099-01-01" },
];

/** Test markets need an allow-listed operator; production market data stays untouched. */
export const fixtureMarketOperators: Record<string, string[]> = {
  gb: ["fixture-north"],
  es: ["fixture-south"],
};
