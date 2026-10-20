import type { SourceRecord } from "./source";

export type CasinoStatus = "draft" | "pending_review" | "verified" | "suspended";

export interface CasinoLicence {
  marketCode: string;
  authority: string;
  licenceNumber: string;
  verificationSource: string;
  lastVerifiedAt: string;
}

export interface Casino {
  id: string;
  slug: string;
  name: string;
  legalEntity: string;
  officialWebsite: string;
  licences: CasinoLicence[];
  editorialSummary: string;
  sources: SourceRecord[];
  lastVerifiedAt: string | null;
  status: CasinoStatus;
  /** True only for development fixtures; never shipped to production. */
  isTestData?: boolean;
}
