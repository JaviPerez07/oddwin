import { expect, test } from "@playwright/test";

// Production build: fixtures must be impossible to reach.
test("fixture offers cannot be followed in production", async ({ request }) => {
  const res = await request.get("/go/fx-north-gb?market=gb", { maxRedirects: 0 });
  expect(res.status()).toBe(404);
  expect(res.headers()["location"]).toBeUndefined();
});

test("fixture casinos do not exist in production", async ({ request }) => {
  expect((await request.get("/casinos/fixture-north")).status()).toBe(404);
});
