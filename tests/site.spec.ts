import { expect, test, type Page } from "@playwright/test";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("response", (r) => {
    if (r.status() >= 400 && new URL(r.url()).origin === new URL(page.url() || "http://x").origin) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}

test("home loads with featured review and catalogue", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await expect(page).toHaveTitle(/OddWin Studios/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Gates of Olympus");
  await expect(page.getByTestId("slot-card").first().locator('[data-cover="placeholder"]')).toBeVisible();
  // No internal workflow labels leak to visitors.
  await expect(page.getByText(/provisional cover/i)).toHaveCount(0);
  await expect(page.getByTestId("slot-card").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("spotlight shelf switches the featured game", async ({ page }) => {
  await page.goto("/");
  const items = page.getByTestId("spotlight-item");
  await items.nth(1).click();
  await expect(items.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Gates of Olympus");
});

test("primary navigation reaches each section", async ({ page, isMobile }) => {
  await page.goto("/");
  for (const [label, path, heading] of [
    ["Slots", "/slots", "All slots"],
    ["Providers", "/providers", "The people who build the maths"],
    ["Casinos", "/casinos", "Operators, listed only"],
  ] as const) {
    if (isMobile) {
      await page.getByTestId("mobile-menu-trigger").click();
      await page.getByRole("dialog").getByRole("link", { name: label, exact: true }).click();
    } else {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label, exact: true }).click();
    }
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
  }
});

test("catalogue lists all games and search narrows results", async ({ page }) => {
  await page.goto("/slots");
  await expect(page.getByTestId("catalog-count")).toHaveText(/^10 games/);
  await page.getByTestId("catalog-search").fill("megaways");
  await expect(page.getByTestId("catalog-count")).toHaveText(/^1 game/);
  await expect(page.getByTestId("catalog-results")).toContainText("Bonanza Megaways");
  await expect(page).toHaveURL(/q=megaways/);
  await page.getByTestId("catalog-search").fill("no such game");
  await expect(page.getByTestId("catalog-empty")).toBeVisible();
});

test("filters apply, combine, sync to the URL and clear", async ({ page }) => {
  await page.goto("/slots");
  await page.getByTestId("filter-provider-pragmatic-play").click();
  await expect(page.getByTestId("catalog-count")).toHaveText(/^3 games/);
  await expect(page).toHaveURL(/provider=pragmatic-play/);
  await page.getByTestId("filter-mechanic-money-collect").click();
  await expect(page.getByTestId("catalog-count")).toHaveText(/^1 game/);
  await page.getByTestId("catalog-clear").click();
  await expect(page.getByTestId("catalog-count")).toHaveText(/^10 games/);
  await expect(page).toHaveURL(/\/slots$/);
});

test("deep link with a mechanic filter is honoured", async ({ page }) => {
  await page.goto("/slots?mechanic=cluster-pays");
  await expect(page.getByTestId("catalog-count")).toHaveText(/^1 game/);
  await expect(page.getByTestId("catalog-results")).toContainText("Reactoonz");
});

test("header search finds a game and navigates to it", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("search-trigger").click();
  await page.getByTestId("search-input").fill("book of");
  await page.getByTestId("search-input").press("Enter");
  await expect(page).toHaveURL(/\/slots\/book-of-dead$/);
});

test("slot page has its own metadata and is noindex while in verification", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/slots/gates-of-olympus");
  await expect(page).toHaveTitle("Gates of Olympus review — mechanics, RTP versions & demo · OddWin Studios");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://localhost:3100/slots/gates-of-olympus");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Gates of Olympus/);
  await expect(page.getByTestId("verification-banner")).toBeVisible();
  const jsonLd = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent ?? ""));
  expect(jsonLd.some((t) => t.includes('"BreadcrumbList"'))).toBe(true);
  // No fabricated ratings in structured data.
  expect(await page.content()).not.toContain("AggregateRating");
  expect(errors).toEqual([]);
});

test("demo button only exists for verified destinations", async ({ page }) => {
  await page.goto("/slots/gates-of-olympus");
  await expect(page.getByTestId("demo-panel")).toHaveAttribute("data-demo-state", "pending");
  await expect(page.getByTestId("demo-cta")).toHaveCount(0);
  await page.goto("/slots/money-train-2");
  await expect(page.getByTestId("demo-panel")).toHaveAttribute("data-demo-state", "not_found");
  await expect(page.getByTestId("demo-cta")).toHaveCount(0);
});

test("no commercial offer appears in production for any market", async ({ page }) => {
  await page.goto("/slots/starburst");
  await expect(page.getByTestId("offers-empty")).toBeVisible();
  await page.getByTestId("offers-panel").getByTestId("market-trigger").click();
  await page.getByTestId("market-option-es").click();
  await expect(page.getByTestId("offers-empty")).toHaveText(/Aún no hay ofertas de operadores verificados/);
  await expect(page.getByTestId("offer-cta")).toHaveCount(0);
});

test("unknown slug returns 404", async ({ page }) => {
  const res = await page.goto("/slots/not-a-real-slot");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("didn’t land");
});

test("analytics events fire for slot views and filters", async ({ page }) => {
  await page.goto("/slots/reactoonz");
  await expect.poll(() => page.evaluate(() => (window.__analyticsEvents ?? []).map((e) => e.name))).toContain("slot_view");
  await page.goto("/slots");
  await page.getByTestId("filter-provider-netent").click();
  await expect.poll(() => page.evaluate(() => (window.__analyticsEvents ?? []).map((e) => e.name))).toContain("filter_use");
});

test("sitemap and robots are coherent", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>http://localhost:3100/</loc>");
  expect(sitemap).toContain("http://localhost:3100/methodology");
  expect(sitemap).not.toContain("/slots/gates-of-olympus"); // pending review → excluded
  expect(sitemap).not.toContain("/go/");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /go/");
  expect(robots).toContain("Sitemap: http://localhost:3100/sitemap.xml");
});

test("all key pages render without errors", async ({ page }) => {
  for (const path of ["/providers/netent", "/casinos", "/markets/es", "/about", "/methodology", "/responsible-gambling", "/affiliate-disclosure", "/privacy", "/terms", "/contact"]) {
    const errors = collectErrors(page);
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors, path).toEqual([]);
  }
});

test("unverified figures are never presented as facts", async ({ page }) => {
  // Review hero: every key-figure cell carries its own status; unverified ones show no number.
  await page.goto("/slots/gates-of-olympus");
  const cells = page.getByTestId("key-figures").locator("[data-status]");
  await expect(cells).toHaveCount(6);
  for (const cell of await cells.all()) {
    if ((await cell.getAttribute("data-status")) !== "verified") await expect(cell.locator("dd")).not.toHaveText(/\d/);
  }
  // The technical file still lists the lead, explicitly labelled.
  await expect(page.locator("#technical-file")).toContainText("96.50%");
  await expect(page.locator("#technical-file")).toContainText("Lead");

  // Homepage feature and catalogue cards show no unverified figures.
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Featured reviews" })).not.toContainText("96.50%");
  await page.goto("/slots");
  await expect(page.getByTestId("catalog-results")).not.toContainText("%");
  // Sort and filter options that would rely on unverified leads are not offered.
  await expect(page.getByTestId("catalog-sort").locator("option", { hasText: "RTP" })).toHaveCount(0);
  await expect(page.locator('[data-testid^="filter-volatility-"]')).toHaveCount(0);
});

test("mechanics and studio modules use conceptual glyphs and typography, not fake art", async ({ page }) => {
  await page.goto("/");
  const tiles = page.getByTestId("mechanic-tile");
  await expect(tiles).toHaveCount(6);
  for (const t of await tiles.all()) await expect(t.locator("svg")).toHaveCount(1);
  const studios = page.getByTestId("provider-tile");
  await expect(studios).toHaveCount(6);
  await expect(studios.locator("img")).toHaveCount(0); // no logo is licensed yet
  await expect(studios.first()).toContainText("Big Time Gaming");
});

test("no broken images on key pages", async ({ page }) => {
  for (const path of ["/", "/slots", "/slots/gates-of-olympus", "/slots/big-bass-bonanza", "/providers"]) {
    await page.goto(path);
    const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
    expect(broken, path).toEqual([]);
  }
});

test("all ten review pages render with no official art and no broken images", async ({ page }) => {
  const slugs = ["gates-of-olympus", "big-bass-bonanza", "sweet-bonanza", "bonanza-megaways", "book-of-dead", "reactoonz", "starburst", "dead-or-alive-2", "money-train-2", "wanted-dead-or-a-wild"];
  for (const slug of slugs) {
    const res = await page.goto(`/slots/${slug}`);
    expect(res?.status(), slug).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), slug).toBeVisible();
    // Nothing is approved in production: no official covers, no credits, no images from /art/.
    await expect(page.locator('[data-cover^="official"]'), slug).toHaveCount(0);
    await expect(page.locator('img[src*="/art/"]'), slug).toHaveCount(0);
    const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).length);
    expect(broken, slug).toBe(0);
  }
});
