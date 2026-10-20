#!/usr/bin/env node
/**
 * Loads key pages in Chromium against a running `next dev` server, then asks
 * the Next.js dev diagnostics endpoint (/_next/mcp → get_errors) for the
 * errors behind the dev overlay's "Issues" badge. Exits 1 if any are reported.
 *   npm run dev   (in another terminal)
 *   npm run check:dev
 */
import { chromium, devices } from "@playwright/test";

const BASE = process.env.DEV_URL || "http://localhost:3000";
const PATHS = ["/", "/slots", "/slots/gates-of-olympus", "/slots/big-bass-bonanza", "/providers", "/casinos", "/markets/gb", "/methodology"];

const browser = await chromium.launch();
const contexts = [await browser.newContext({ viewport: { width: 1440, height: 900 } }), await browser.newContext({ ...devices["Pixel 7"] })];
const consoleErrors = [];
for (const ctx of contexts) {
  for (const path of PATHS) {
    const page = await ctx.newPage();
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${path}: ${m.text()}`));
    page.on("pageerror", (e) => consoleErrors.push(`${path}: ${e}`));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
  }
}
await new Promise((r) => setTimeout(r, 3000));

const res = await fetch(`${BASE}/_next/mcp`, {
  method: "POST",
  headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_errors", arguments: {} } }),
});
const body = await res.text();
const data = JSON.parse(body.match(/data: (.*)/)?.[1] ?? body);
const report = JSON.parse(data.result.content[0].text);
await browser.close();

console.log("Dev diagnostics:", JSON.stringify(report));
if (consoleErrors.length) console.log("Console errors:\\n" + consoleErrors.join("\\n"));
const count = (report.configErrors?.length ?? 0) + (report.sessionErrors?.length ?? 0) + consoleErrors.length;
process.exit(count ? 1 : 0);
