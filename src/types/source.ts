/**
 * Every time-sensitive or factual claim on the site points at one or more
 * SourceRecords. A fact is only "verified" when at least one source with
 * result "confirmed" backs it — see lib/validation.ts.
 */
export type SourceTrust =
  /** Provider, operator or regulator's own page, loaded and read by an editor. */
  | "primary"
  /** Reputable third party (e.g. a regulator register mirror, press release). */
  | "secondary"
  /** URL and snippet surfaced by a search index on the official domain; page not loaded. */
  | "search_index"
  /** Editor's pre-publication notes with no attached document yet. */
  | "preliminary";

export type SourceResult =
  | "confirmed"
  | "not_loaded"
  | "conflict"
  | "not_found";

export interface SourceRecord {
  id: string;
  url: string | null;
  label: string;
  /** Field names (e.g. "rtp", "maxWin") this source is used for. */
  fields: string[];
  /** ISO date the source was consulted, or null if it never has been. */
  consultedAt: string | null;
  result: SourceResult;
  trust: SourceTrust;
  editorNote?: string;
}

export type FactStatus =
  /** Backed by a confirmed primary/secondary source. */
  | "verified"
  /** We have a lead but it has not been checked against the live source. */
  | "pending"
  /** Leads disagree; value withheld until resolved. */
  | "conflicting"
  /** Nobody has sourced this yet. */
  | "unsourced";

export interface Fact<T> {
  value: T | null;
  status: FactStatus;
  sourceIds: string[];
  note?: string;
}
