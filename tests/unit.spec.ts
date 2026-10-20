import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { assets } from "../src/data/assets";
import { providers } from "../src/data/providers";
import { slots } from "../src/data/slots";
import { canDisplay, displayBlockers, SURFACE_USES } from "../src/lib/assets";
import { fixtureAssets } from "../src/data/fixtures/assets";
import { offers } from "../src/data/offers";
import { casinos } from "../src/data/casinos";
import { fixtureCasinos, fixtureOffers } from "../src/data/fixtures";
import { markets } from "../src/data/markets";
import { checkOfferEligibility, destinationProblem } from "../src/lib/eligibility";
import { searchItems } from "../src/lib/search";
import { isSlotIndexable, validateCatalog, validateSlot } from "../src/lib/validation";

test.describe("data integrity", () => {
  test("catalogue passes validation", () => {
    expect(validateCatalog()).toEqual([]);
  });

  test("production ships no casinos, offers or test data", () => {
    expect(casinos).toEqual([]);
    expect(offers).toEqual([]);
  });

  test("no slot is indexable while its core facts are unverified", () => {
    for (const s of slots) expect(isSlotIndexable(s)).toBe(false);
  });

  test("a slot cannot be published with pending core facts", () => {
    const draft = { ...slots[0], publicationStatus: "published" as const };
    expect(validateSlot(draft).some((p) => p.includes("cannot publish"))).toBe(true);
  });

  test("a fact marked verified needs a confirmed primary source", () => {
    const bad = { ...slots[0], rtp: { ...slots[0].rtp, status: "verified" as const } };
    expect(validateSlot(bad).some((p) => p.includes("verified without a confirmed"))).toBe(true);
  });

  test("demo CTA states require HTTPS", () => {
    const bad = { ...slots[0], demo: { kind: "verified" as const, url: "http://example.com", source: "x", checkedAt: "2026-10-20" } };
    expect(validateSlot(bad)).toContain(`${slots[0].slug}: demo URL must be HTTPS`);
  });

  test("no slot currently exposes a live demo link", () => {
    for (const s of slots) expect(["pending", "not_found"]).toContain(s.demo.kind);
  });
});

test.describe("offer eligibility", () => {
  const gb = { ...markets.find((m) => m.code === "gb")!, allowedOperators: ["fixture-north"] };
  const north = fixtureCasinos[0];
  const now = new Date("2026-10-20T12:00:00Z");
  const base = { marketCode: "gb", market: gb, casino: north, now, siteHost: "localhost" };
  const byId = (id: string) => fixtureOffers.find((o) => o.id === id)!;

  test("test data is rejected when fixtures are disabled", () => {
    // AFFILIATE_TEST_FIXTURES is not set in the unit project.
    expect(checkOfferEligibility(byId("fx-north-gb"), base)).toContain("test_data_disabled");
  });

  test("paused, expired, pending, bad-host and http offers each fail", () => {
    expect(checkOfferEligibility(byId("fx-north-paused"), base)).toContain("not_approved");
    expect(checkOfferEligibility(byId("fx-north-expired"), base)).toContain("expired");
    expect(checkOfferEligibility(byId("fx-north-pending"), base)).toContain("not_verified");
    expect(destinationProblem(byId("fx-north-badhost"))).toBe("destination_not_allow_listed");
    expect(destinationProblem(byId("fx-north-http"))).toBe("insecure_destination");
  });

  test("an offer is never valid in another market", () => {
    expect(checkOfferEligibility(byId("fx-north-gb"), { ...base, marketCode: "es" })).toContain("wrong_market");
  });

  test("a real (non-test) offer needs a verified market", () => {
    const real = { ...byId("fx-north-gb"), isTestData: false };
    expect(checkOfferEligibility(real, base)).toContain("market_not_verified");
  });
});

test("search ranks exact titles first and matches mechanics", () => {
  const items = slots.map((s) => ({ type: "slot" as const, title: s.name, subtitle: "", href: s.slug, keywords: s.mechanics.join(" ") }));
  expect(searchItems(items, "starburst")[0].href).toBe("starburst");
  expect(searchItems(items, "megaways").map((i) => i.href)).toContain("bonanza-megaways");
  expect(searchItems(items, "zzzz")).toEqual([]);
});

test.describe("asset registry", () => {
  const STATUSES = ["approved", "permission_pending", "restricted", "unknown", "not_found"];

  test("every game and studio has records for each asset kind", () => {
    for (const s of slots)
      for (const kind of ["key-art", "thumbnail", "game-logo", "screenshot", "promo-material"])
        expect(assets.some((a) => a.subject.id === s.id && a.kind === kind), `${s.id} ${kind}`).toBe(true);
    for (const p of providers) expect(assets.some((a) => a.subject.id === p.id && a.kind === "provider-logo"), p.id).toBe(true);
  });

  test("records are unique, dated, owned and use a known status", () => {
    expect(new Set(assets.map((a) => a.id)).size).toBe(assets.length);
    for (const a of assets) {
      expect(STATUSES).toContain(a.permission.status);
      expect(a.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.owner.length).toBeGreaterThan(0);
      expect(a.notes.length).toBeGreaterThan(0);
    }
  });

  test("approval always carries evidence and explicit uses", () => {
    for (const a of [...assets, ...fixtureAssets].filter((x) => x.permission.status === "approved")) {
      expect(a.permission.evidence, a.id).not.toBeNull();
      expect(a.permission.authorisedUses.length, a.id).toBeGreaterThan(0);
    }
  });

  test("current state: no real asset is approved or displayable on any surface", () => {
    expect(assets.filter((a) => a.permission.status === "approved")).toEqual([]);
    for (const a of assets) for (const surface of Object.keys(SURFACE_USES) as (keyof typeof SURFACE_USES)[]) expect(canDisplay(a, surface)).toBe(false);
  });

  test("not_found records have no local file", () => {
    for (const a of assets.filter((x) => x.permission.status === "not_found")) expect(a.localPath).toBeNull();
  });

  test("real records never point at test paths, and local files exist when set", () => {
    for (const a of assets.filter((x) => x.localPath)) {
      expect(a.localPath!.startsWith("/art/licensed/"), a.id).toBe(true);
      expect(existsSync(join(process.cwd(), "public", a.localPath!)), a.id).toBe(true);
    }
  });
});

test.describe("display rules", () => {
  const ok = () => true;
  const happy = fixtureAssets.find((a) => a.id === "fx:gates-of-olympus:key-art")!;
  const asReal = { ...happy, isTestData: false, localPath: "/art/licensed/x/key-art.png" };
  const now = new Date("2026-10-20T12:00:00Z");

  test("an approved, evidenced, worldwide asset with a file is displayable", () => {
    expect(displayBlockers(asReal, "hero", now, ok)).toEqual([]);
  });
  test("each missing condition blocks display", () => {
    const p = asReal.permission;
    expect(displayBlockers({ ...asReal, permission: { ...p, status: "permission_pending" } }, "hero", now, ok)).toContain("not_approved");
    expect(displayBlockers({ ...asReal, permission: { ...p, evidence: null } }, "hero", now, ok)).toContain("no_evidence");
    expect(displayBlockers({ ...asReal, permission: { ...p, authorisedUses: ["editorial"] } }, "card", now, ok)).toContain("use_not_authorised");
    expect(displayBlockers({ ...asReal, permission: { ...p, territories: ["gb"] } }, "hero", now, ok)).toContain("territory_not_worldwide");
    expect(displayBlockers({ ...asReal, permission: { ...p, expiresAt: "2026-01-01" } }, "hero", now, ok)).toContain("expired");
    expect(displayBlockers({ ...asReal, permission: { ...p, revoked: { at: "2026-10-19", reason: "withdrawn" } } }, "hero", now, ok)).toContain("revoked");
    expect(displayBlockers({ ...asReal, localPath: null }, "hero", now, ok)).toContain("no_local_file");
    expect(displayBlockers({ ...asReal, localPath: "https://cdn.example.com/x.png" }, "hero", now, ok)).toContain("unsafe_path");
    expect(displayBlockers({ ...asReal, localPath: "/art/licensed/../../secret" }, "hero", now, ok)).toContain("unsafe_path");
    expect(displayBlockers(asReal, "hero", now, () => false)).toContain("file_missing");
    expect(displayBlockers({ ...asReal, width: undefined }, "hero", now, ok)).toContain("missing_dimensions");
  });
  test("logos additionally need logo_reproduction", () => {
    expect(displayBlockers({ ...asReal, kind: "provider-logo", permission: { ...asReal.permission, authorisedUses: ["editorial", "affiliate_pages"] } }, "provider-logo", now, ok)).toContain("use_not_authorised");
  });
  test("test data is never displayable when fixtures are disabled", () => {
    expect(displayBlockers(happy, "hero", now, ok)).toContain("test_data_disabled");
  });
});

test("the generated permission register is up to date", () => {
  execFileSync(process.execPath, ["--experimental-strip-types", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/assets-report.mts", "--check"], { stdio: "pipe" });
});
