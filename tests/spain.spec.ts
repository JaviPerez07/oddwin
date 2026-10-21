import { expect, test } from "@playwright/test";
import { slots } from "../src/data/slots";
import { markets } from "../src/data/markets";
import { affiliateDisclosure, responsibleMessage } from "../src/config/editorial";
import { checkOfferEligibility } from "../src/lib/eligibility";
import { fixtureOffers, fixtureCasinos } from "../src/data/fixtures";

const paths = ["/slots", "/casinos", "/methodology", "/affiliate-disclosure", "/responsible-gambling", ...slots.map((s) => `/slots/${s.slug}`)];
for (const path of paths) {
  test(`Spanish metadata and responsible resources: ${path}`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(/<html[^>]+lang="es"/);
    expect(html).toContain('property="og:locale" content="es_ES"');
    expect(html).toContain('hrefLang="es-ES"');
    expect(html).toContain(responsibleMessage);
    expect(html).toContain("+18 | Juega con responsabilidad");
    expect(html).toContain('href="https://www.jugarbien.es"');
    expect(html).toContain('href="https://fejar.org"');
    expect(html).toContain("900 200 225");
    expect(html).toContain('href="https://www.ordenacionjuego.es/participantes-juego/juego-seguro/rgiaj"');
    expect(html).not.toMatch(/GamCare|Gambling Therapy|Gamblers Anonymous|Ontario|Canadá|Reino Unido|\/markets\/gb|Free spins: where|>Confirmed<|>Secondary<|>Conflict</);
    if (path.startsWith("/slots/")) {
      expect(html).toContain(affiliateDisclosure);
      expect(html).toContain("Fecha de referencia:");
      expect(html).toContain("Pendiente de consulta y verificación.");

    }
  });
}

test("non-Spanish markets are gone and not linked in sitemap", async ({ request }) => {
  expect(markets.map((m) => m.code)).toEqual(["es"]);
  for (const market of ["gb", "ca-on", "se", "de", "mt"]) {
    expect((await request.get(`/markets/${market}`)).status()).toBe(404);
  }
  expect((await request.get("/markets/es")).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toMatch(/\/markets\/(gb|ca-on|se|de|mt)/);
});

test("non-Spanish offers are rejected even with apparently valid licence data", () => {
  const market = { ...markets[0], code: "gb", status: "verified" as const, allowedOperators: ["fixture-north"] };
  expect(checkOfferEligibility(fixtureOffers[0], { marketCode: "gb", market, casino: fixtureCasinos[0], now: new Date("2026-10-21"), siteHost: "localhost" })).toContain("wrong_market");
});

test("own games are absent from the editorial catalogue", async ({ request }) => {
  const html = await (await request.get("/slots")).text();
  expect(slots.some((s) => /^(aura|obsidian|dead-air)/.test(s.slug))).toBe(false);
  // Header/footer legitimately link to the separate B2B games section.
  expect(html).not.toMatch(/href="\/slots\/(aura|obsidian|dead-air)/);
});


test("an approved Spanish offer remains eligible when all checks pass", () => {
  const offer = { ...fixtureOffers.find((item) => item.id === "fx-south-es")!, isTestData: false };
  const market = { ...markets[0], status: "verified" as const, allowedOperators: ["fixture-south"] };
  expect(checkOfferEligibility(offer, { marketCode: "es", market, casino: fixtureCasinos[1], now: new Date("2026-10-21"), siteHost: "localhost" })).toEqual([]);
});
