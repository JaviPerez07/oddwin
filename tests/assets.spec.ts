import { expect, test, type Page } from "@playwright/test";

// Runs against the fixtures build: fictional approved assets (test patterns).

async function brokenImages(page: Page) {
  return page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
}

test("an approved asset renders on the review hero with its credit", async ({ page }) => {
  await page.goto("/slots/gates-of-olympus");
  const hero = page.locator('[data-cover="official-test"]').first();
  await expect(hero).toBeVisible();
  const img = hero.locator("img");
  await expect(img).toHaveAttribute("alt", /Test pattern/);
  await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByTestId("hero-credit")).toContainText("Test image — not game artwork");
  expect(await brokenImages(page)).toEqual([]);
});

test("catalogue cards use the same registry and credit official art", async ({ page }) => {
  await page.goto("/slots");
  const card = page.getByTestId("slot-card").filter({ hasText: "Gates of Olympus" });
  await expect(card.locator('[data-cover="official-test"] img')).toBeVisible();
  await expect(card.getByTestId("art-credit")).toContainText("Test image");
  expect(await brokenImages(page)).toEqual([]);
});

test("missing file, revoked, expired, territory-limited and under-licensed assets fall back", async ({ page }) => {
  await page.goto("/slots");
  for (const name of ["Big Bass Bonanza", "Reactoonz"]) {
    const card = page.getByTestId("slot-card").filter({ hasText: name });
    await expect(card.locator('[data-cover="placeholder"]'), name).toBeVisible();
    await expect(card.locator("img"), name).toHaveCount(0);
  }
  for (const slug of ["sweet-bonanza", "starburst", "book-of-dead"]) {
    await page.goto(`/slots/${slug}`);
    await expect(page.locator('[data-surface="hero"][data-cover^="official"]'), slug).toHaveCount(0);
    await expect(page.getByTestId("hero-credit"), slug).toHaveCount(0);
  }
});

test("if an approved image fails at runtime, the fallback replaces it", async ({ page }) => {
  await page.route(/test-key-art/, (route) => route.abort());
  await page.goto("/slots/gates-of-olympus");
  await expect(page.locator('[data-surface="hero"][data-cover="official-test"] [data-cover="placeholder"]')).toBeVisible();
  expect(await brokenImages(page)).toEqual([]);
});

test("a licensed provider logo replaces the typographic name", async ({ page }) => {
  await page.goto("/");
  const tile = page.getByTestId("provider-tile").filter({ has: page.locator('img[alt="Test logo"]') });
  await expect(tile).toHaveCount(1);
});
