// Prints one A4-landscape PDF per game to static/docs/<slug>-factsheet.pdf (and a PNG preview to qa/shots/).
//   node tools/factsheets.mjs            (then node generate-site.mjs to link the files on the game pages)
// Uses the Chrome installed on this Mac through playwright-core from the Obsidian game's node_modules.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { games } from '../data/games.mjs';
import { factsheet } from '../src/factsheet.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire('/Users/javiperezz7/Projects/obsidian-vault/game/')('playwright-core');
const tmp = join(root, 'qa', 'factsheets'); mkdirSync(tmp, { recursive: true }); mkdirSync(join(root, 'static', 'docs'), { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
for (const g of games) {
  const html = join(tmp, `${g.slug}.html`);
  writeFileSync(html, factsheet(g, root));
  await page.goto('file://' + html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(() => document.body.scrollHeight > window.innerHeight + 2);
  await page.pdf({ path: join(root, 'static', 'docs', `${g.slug}-factsheet.pdf`), format: 'A4', landscape: true, printBackground: true, pageRanges: '1' });
  await page.screenshot({ path: join(tmp, `${g.slug}.png`) });
  console.log(`${g.slug}${over ? '  ✗ content longer than one page' : ''}`);
}
await browser.close();
