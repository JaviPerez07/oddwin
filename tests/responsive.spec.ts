import { expect, test } from "@playwright/test";

test("no horizontal overflow on key pages", async ({ page }) => {
  for (const path of ["/", "/slots", "/slots/gates-of-olympus", "/slots/bonanza-megaways", "/providers", "/casinos", "/markets/de", "/methodology"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("mobile menu opens, closes and the market selector works", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("mobile-menu-trigger").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByTestId("market-trigger").click();
  await page.getByTestId("market-option-es").click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
