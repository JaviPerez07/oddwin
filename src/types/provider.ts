import type { LicensedArt } from "./slot";
import type { Fact, SourceRecord } from "./source";

export type EntityStatus = "draft" | "pending_review" | "published";

export interface Provider {
  id: string;
  slug: string;
  name: string;
  officialWebsite: Fact<string>;
  /** Resolved from the asset manifest; null until a logo is licensed (typographic name shown instead). */
  logo: LicensedArt | null;
  description: string;
  sources: SourceRecord[];
  status: EntityStatus;
}
