/**
 * Asset registry types. Every image the site could show for a game or studio
 * is a record with its provenance, permission status and the evidence behind
 * it. Display is decided per surface by lib/assets.ts#canDisplay — never by
 * the mere existence of a file or URL.
 */
export type AssetKind = "key-art" | "thumbnail" | "game-logo" | "screenshot" | "promo-material" | "provider-logo";

/**
 * - approved: evidence that the specific uses listed are authorised.
 * - permission_pending: a route to permission exists / was requested; awaiting it or a clarification.
 * - restricted: the terms consulted do not allow the proposed use without further permission.
 * - unknown: no reliable conclusion could be reached (e.g. terms not found).
 * - not_found: the resource itself has not been located.
 */
export type PermissionStatus = "approved" | "permission_pending" | "restricted" | "unknown" | "not_found";

/** Uses a permission must explicitly cover. */
export type AssetUse =
  | "editorial" // review pages and editorial context
  | "catalogue" // listing/catalogue thumbnails
  | "affiliate_pages" // pages that also carry labelled affiliate links
  | "logo_reproduction" // showing a trademark/logo
  | "modification"; // cropping beyond aspect fit, overlays, recolouring

/** How the file itself can be obtained. */
export type Availability =
  | "public_download" // reachable without an account (does NOT imply permission)
  | "login_required" // behind a partner/client portal
  | "access_blocked" // could not be checked from our environment
  | "not_located";

export interface PermissionEvidence {
  type: "written_permission" | "licence_agreement" | "published_terms" | "press_kit_terms";
  /** Reference a human can retrieve: email subject/date, contract id, or terms URL + clause. */
  reference: string;
  url: string | null;
  receivedAt: string;
  /** What exactly is allowed, in the grantor's terms. */
  summary: string;
}

export interface AssetPermission {
  status: PermissionStatus;
  evidence: PermissionEvidence | null;
  authorisedUses: AssetUse[];
  /** "worldwide", a list of market codes, or null when unknown. */
  territories: "worldwide" | string[] | null;
  /** Exact credit line required by the rights holder, if any. */
  attribution: string | null;
  expiresAt: string | null;
  /** Set to withdraw an asset immediately (e.g. permission withdrawn). */
  revoked: { at: string; reason: string } | null;
}

export interface AssetRecord {
  id: string;
  subject: { type: "slot" | "provider"; id: string };
  kind: AssetKind;
  /** Official location of the resource (page, portal or pack). */
  sourceUrl: string | null;
  /** How the source URL was established. */
  sourceEvidence: "loaded_page" | "search_snippet" | "provided_by_rights_holder" | null;
  holder: string | null;
  availability: Availability;
  /** Local copy under /public/art/licensed/ (or /public/art/test/ for fixtures). */
  localPath: string | null;
  width?: number;
  height?: number;
  alt?: string;
  checkedAt: string;
  termsUrl: string | null;
  permission: AssetPermission;
  nextReviewAt: string | null;
  /** Role or person responsible for verifying this record. */
  owner: string;
  notes: string;
  isTestData?: boolean;
}
