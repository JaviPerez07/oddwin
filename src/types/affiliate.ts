export type OfferApprovalStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "paused"
  | "expired"
  | "rejected";

export type CommissionModel = "revenue_share" | "cpa" | "hybrid" | "unknown";

export interface AffiliateOffer {
  id: string;
  casinoId: string;
  marketCode: string;
  programName: string;
  officialProgramUrl: string;
  /** Exact HTTPS URL issued by the programme. Never constructed by us. */
  trackingUrl: string;
  commissionModel: CommissionModel;
  termsUrl: string;
  approvalStatus: OfferApprovalStatus;
  /** e.g. ["seo", "organic"]; must include "seo" for this site to send traffic. */
  permittedTrafficSources: string[];
  /** Domains the programme approved us to promote from. */
  permittedDomains: string[];
  /** Hostnames trackingUrl may resolve to (redirect allow-list). */
  allowedDestinationHosts: string[];
  /** Offer copy verified for this market on verifiedAt. No bonus text unless verified. */
  headline: string;
  verifiedAt: string | null;
  expiresAt: string | null;
  internalNotes?: string;
  isTestData?: boolean;
}
