import { expect, test } from "@playwright/test";

// Runs against the fixtures build (SITE_ENV=test, AFFILIATE_TEST_FIXTURES=1).

test("market selection changes the visible offers", async ({ page }) => {
  await page.goto("/slots/gates-of-olympus");
  const panel = page.getByTestId("offers-panel");
  await expect(panel.getByTestId("offers-no-market")).toBeVisible();

  await panel.getByTestId("market-trigger").click();
  await page.getByTestId("market-option-gb").click();
  await expect(panel.getByTestId("offer-item")).toHaveCount(1);
  await expect(panel.getByTestId("offer-item")).toHaveAttribute("data-offer-id", "fx-north-gb");
  await expect(panel).toContainText("Test data — not a real operator");

  await panel.getByTestId("market-trigger").click();
  await page.getByTestId("market-option-es").click();
  await expect(panel.getByTestId("offer-item")).toHaveCount(1);
  await expect(panel.getByTestId("offer-item")).toHaveAttribute("data-offer-id", "fx-south-es");

  await panel.getByTestId("market-trigger").click();
  await page.getByTestId("market-option-se").click();
  await expect(panel.getByTestId("offers-empty")).toBeVisible();
});

test("affiliate links carry sponsored rel and point at our redirect", async ({ page }) => {
  await page.goto("/slots/starburst");
  const panel = page.getByTestId("offers-panel");
  await panel.getByTestId("market-trigger").click();
  await page.getByTestId("market-option-gb").click();
  const cta = panel.getByTestId("offer-cta");
  await expect(cta).toHaveAttribute("rel", /sponsored/);
  await expect(cta).toHaveAttribute("href", "/go/fx-north-gb?market=gb");
});

test.describe("/go redirect", () => {
  test("approved offer redirects to its registered HTTPS destination", async ({ request }) => {
    const res = await request.get("/go/fx-north-gb?market=gb", { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()["location"]).toBe("https://example.com/track/north-gb");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("a destination supplied by the visitor is ignored", async ({ request }) => {
    const res = await request.get("/go/fx-north-gb?market=gb&url=https://evil.example.net&to=https://evil.example.net", { maxRedirects: 0 });
    expect(res.headers()["location"]).toBe("https://example.com/track/north-gb");
  });

  for (const [id, market, status] of [
    ["fx-north-paused", "gb", 410],
    ["fx-north-expired", "gb", 410],
    ["fx-north-pending", "gb", 410],
    ["fx-north-badhost", "gb", 404],
    ["fx-north-http", "gb", 404],
    ["fx-north-gb", "es", 404],
    ["does-not-exist", "gb", 404],
  ] as const) {
    test(`${id} in ${market} is refused (${status})`, async ({ request }) => {
      const res = await request.get(`/go/${id}?market=${market}`, { maxRedirects: 0 });
      expect(res.status()).toBe(status);
      expect(res.headers()["location"]).toBeUndefined();
    });
  }

  test("missing market or malformed id is a 400", async ({ request }) => {
    expect((await request.get("/go/fx-north-gb", { maxRedirects: 0 })).status()).toBe(400);
    expect((await request.get("/go/..%2F..%2Fetc?market=gb", { maxRedirects: 0 })).status()).toBe(400);
  });
});

test("test casinos are labelled and noindex", async ({ page }) => {
  await page.goto("/casinos/fixture-north");
  await expect(page.getByTestId("test-data-banner")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
