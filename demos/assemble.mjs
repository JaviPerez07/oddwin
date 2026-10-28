// Assembles the private demo site: public/play/<slug>/ from builds/<slug>/ (only the games listed in READY, i.e.
// evaluation builds that were verified), poster images for the portal, and games.json for the worker.
//   node assemble.mjs && npx wrangler deploy
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { games } from '../site/data/games.mjs';

const here = dirname(fileURLToPath(import.meta.url));
// evaluation builds verified end to end (see README.md · "Status per game"); a game not listed is never published
export const READY = ['page-breaker', 'obsidian', 'aura', 'vice-miami-spin', 'bar-and-cigar', 'frutiger-eden', 'dead-air'];

const pub = join(here, 'public');
rmSync(pub, { recursive: true, force: true });
mkdirSync(join(pub, 'play'), { recursive: true });
cpSync(join(here, 'static'), join(pub, 'static'), { recursive: true });
const list = [];
for (const slug of READY) {
  const src = join(here, 'builds', slug), g = games.find((x) => x.slug === slug);
  if (!g || !existsSync(join(src, 'index.html'))) { console.log(`✗ ${slug}: no build at builds/${slug}`); continue; }
  cpSync(src, join(pub, 'play', slug), { recursive: true });
  cpSync(join(here, '../site/static/media', `${g.hero.video}.jpg`), join(pub, 'static', `${slug}.jpg`));
  list.push({ slug, name: g.fullName || g.name, line: g.concept });
  console.log(`✓ ${slug}`);
}
writeFileSync(join(here, 'games.json'), JSON.stringify(list, null, 1) + '\n');

// guard rails: nothing that should never ship
const walk = (d) => readdirSync(d).flatMap((n) => { const f = join(d, n); return statSync(f).isDirectory() ? walk(f) : [f]; });
const files = walk(pub), bad = files.filter((f) => /\.(map|ts|tsx|md|env|log)$|\/\.git\/|node_modules|\.DS_Store/.test(f));
const big = files.filter((f) => statSync(f).size > 25 * 1024 * 1024);
if (bad.length || big.length) { console.error('✗ refusing:', [...bad, ...big].map((f) => f.slice(pub.length)).join(', ')); process.exit(1); }
console.log(`${list.length} games · ${files.length} files · ${(files.reduce((n, f) => n + statSync(f).size, 0) / 1048576).toFixed(1)} MB → public/`);
