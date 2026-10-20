import type { EntityStatus } from "./provider";
import type { Fact, FactStatus, SourceRecord } from "./source";

export type Volatility = "low" | "medium" | "medium-high" | "high" | "very-high";

export type Mechanic =
  | "pay-anywhere"
  | "tumble"
  | "cluster-pays"
  | "megaways"
  | "paylines"
  | "both-ways"
  | "expanding-symbols"
  | "expanding-wilds"
  | "sticky-wilds"
  | "multipliers"
  | "free-spins"
  | "money-collect"
  | "hold-and-respin"
  | "bonus-buy"
  | "respins"
  | "feature-choice";

export interface RtpVersion {
  value: number;
  label: string;
}

/** Demo availability is a four-state machine; only the first two may render a CTA. */
export type DemoState =
  | { kind: "verified"; url: string; source: string; checkedAt: string }
  | { kind: "official_site_only"; url: string; source: string; checkedAt: string }
  | { kind: "pending"; lead: string | null; note: string }
  | { kind: "not_found"; note: string };

export type SchematicPattern = "scatter" | "line" | "cluster" | "expand" | "collect" | "sticky" | "respin" | "megaways";

/**
 * A technical drawing of the reel layout, drawn by us. It is deliberately
 * diagrammatic so it can never be mistaken for official game artwork.
 */
export interface Schematic {
  reels: number;
  /** A single row count, or per-reel heights for variable layouts (Megaways). */
  rows: number | number[];
  topReel?: boolean;
  pattern: SchematicPattern;
  /** Reel indexes the pattern emphasises (e.g. expanded reels). */
  focus?: number[];
  /** Whether the drawn dimensions come from a verified source. */
  dimsStatus: FactStatus;
}

/**
 * Official artwork resolved from the asset registry for one display surface.
 * Present only when lib/assets.ts#canDisplay passed.
 */
export interface LicensedArt {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Rights holder, for the credit line. */
  credit: string;
  /** Credit text the rights holder requires, if any. */
  attribution: string | null;
  licenceRef: string;
  approvedAt: string;
  /** "cover" only when the licence allows modification (cropping); otherwise shown uncropped. */
  fit: "cover" | "contain";
  isTestData?: boolean;
}

/** Colours associated with the game's theme, used for the provisional cover and ambient light. */
export interface SlotPalette {
  /** Main hue of the cover field. */
  base: string;
  /** Darker companion for depth. */
  deep: string;
  /** Light/glow hue used for ambient lighting behind the cover. */
  glow: string;
  /** Small highlight colour. */
  accent: string;
}

export interface SlotArtwork {
  /** Hero/key art for review pages and the homepage feature. */
  licensed: LicensedArt | null;
  /** Catalogue thumbnail (cards, shelves). */
  card?: LicensedArt | null;
  palette: SlotPalette;
  /** Technical reel-layout diagram, shown in the specs (never as the cover). */
  schematic: Schematic;
}

export interface EditorialSection {
  id: string;
  heading: string;
  paragraphs: string[];
  /** Optional callout rendered as a pull-quote beside the section. */
  aside?: string;
}

export interface SlotReview {
  /** Editorial headline, distinct from the game name. */
  headline: string;
  dek: string;
  sections: EditorialSection[];
  strengths: string[];
  limitations: string[];
  /** "Who it suits" style framing — no promises of outcomes. */
  verdict: string;
}

export interface Slot {
  id: string;
  slug: string;
  name: string;
  providerId: string;
  shortDescription: string;
  review: SlotReview;
  artwork: SlotArtwork;
  releaseDate: Fact<string>;
  rtp: Fact<RtpVersion[]>;
  volatility: Fact<Volatility>;
  maxWin: Fact<string>;
  grid: Fact<string>;
  payStructure: Fact<string>;
  freeSpins: Fact<string>;
  jackpot: Fact<string>;
  mechanics: Mechanic[];
  mechanicsStatus: Fact<true>["status"];
  demo: DemoState;
  sources: SourceRecord[];
  publishedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  publicationStatus: EntityStatus;
  featured?: boolean;
}
