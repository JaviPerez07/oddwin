import type { Fact, SourceRecord } from "./source";

export interface HelpResource {
  name: string;
  url: string;
  description: string;
  status: Fact<true>["status"];
}

export interface Market {
  /** Lower-case route segment, e.g. "gb", "es", "ca-on". */
  code: string;
  /** ISO 3166 country (and subdivision where relevant). */
  countryCode: string;
  countryName: string;
  minimumLegalAge: Fact<number>;
  regulatoryAuthority: Fact<{ name: string; englishName?: string; url: string }>;
  licenceRegisterUrl: Fact<string>;
  /** IDs of casinos verified as licensed for this market. */
  allowedOperators: string[];
  promotionalRules: Fact<string[]>;
  /** Channels we may use to promote operators here — empty until legal review. */
  allowedPromotionalMethods: string[];
  selfExclusion: HelpResource | null;
  helpResources: HelpResource[];
  regulatorySources: SourceRecord[];
  lastVerifiedAt: string | null;
  status: "draft" | "pending_review" | "verified";
}
